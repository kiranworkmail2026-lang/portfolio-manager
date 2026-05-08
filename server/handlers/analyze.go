package handlers

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	mopt "go.mongodb.org/mongo-driver/mongo/options"

	"portfolio-manager/server/config"
	"portfolio-manager/server/middleware"
	"portfolio-manager/server/models"
)

type analyzeReq struct {
	Question string `json:"question"`
}

// Analyze proxies an SSE stream from the multi-agent service to the client.
// It also persists the analysis (events trace + final answer) in Mongo.
func Analyze(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFrom(r)
	userID, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "invalid user")
		return
	}

	var req analyzeReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid body")
		return
	}
	q := strings.TrimSpace(req.Question)
	if len(q) < 1 || len(q) > 4000 {
		writeErr(w, http.StatusBadRequest, "question must be 1-4000 chars")
		return
	}

	agentURL := os.Getenv("AGENT_SERVICE_URL")
	apiKey := os.Getenv("MULTI_AGENT_API_KEY")
	if agentURL == "" || apiKey == "" {
		writeErr(w, http.StatusInternalServerError, "agent service not configured")
		return
	}

	flusher, ok := w.(http.Flusher)
	if !ok {
		writeErr(w, http.StatusInternalServerError, "streaming unsupported")
		return
	}

	// Insert pending Mongo doc.
	now := time.Now()
	pending := models.Analysis{
		UserID:    userID,
		Question:  q,
		Status:    "pending",
		Trace:     []string{},
		AgentPath: []string{},
		ToolCalls: []string{},
		CreatedAt: now,
	}
	dbCtx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()
	insRes, err := config.Analyses().InsertOne(dbCtx, pending)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "could not create analysis")
		return
	}
	analysisID := insRes.InsertedID.(primitive.ObjectID)

	// Build upstream request — 5min timeout via context, not http.Client.Timeout
	// (Timeout cancels mid-stream; context lets stream live until done).
	upstreamCtx, upstreamCancel := context.WithTimeout(r.Context(), 5*time.Minute)
	defer upstreamCancel()

	body, _ := json.Marshal(map[string]string{"question": q})
	upReq, err := http.NewRequestWithContext(upstreamCtx, "POST", agentURL+"/query", bytes.NewReader(body))
	if err != nil {
		failAndPersist(w, flusher, analysisID, now, "request build failed: "+err.Error())
		return
	}
	upReq.Header.Set("Content-Type", "application/json")
	upReq.Header.Set("X-API-Key", apiKey)
	upReq.Header.Set("Accept", "text/event-stream")

	client := &http.Client{} // no Timeout — we use context
	resp, err := client.Do(upReq)
	if err != nil {
		failAndPersist(w, flusher, analysisID, now, "agent service unreachable: "+err.Error())
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		failAndPersist(w, flusher, analysisID, now,
			fmt.Sprintf("agent service returned %d: %s", resp.StatusCode, truncate(string(bodyBytes), 200)))
		return
	}

	// Set SSE headers for downstream client.
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("X-Accel-Buffering", "no")
	w.WriteHeader(http.StatusOK)
	// Send analysis ID as first event so client knows it.
	fmt.Fprintf(w, "event: meta\ndata: {\"analysisId\":\"%s\"}\n\n", analysisID.Hex())
	flusher.Flush()

	// Parse SSE from upstream while relaying to client.
	scanner := bufio.NewScanner(resp.Body)
	scanner.Buffer(make([]byte, 0, 64*1024), 4*1024*1024) // up to 4MB per line for big answers

	var (
		curEvent     string
		curData      strings.Builder
		finalAnswer  string
		errMsg       string
		trace        []string
		agentPathSet = map[string]struct{}{}
		toolSet      = map[string]struct{}{}
		gotDone      bool
	)

	flushFrame := func() {
		if curEvent == "" && curData.Len() == 0 {
			return
		}
		dataStr := curData.String()
		// Relay raw to client.
		if curEvent != "" {
			fmt.Fprintf(w, "event: %s\n", curEvent)
		}
		// data may be multi-line; SSE allows this. Write as-is split by \n.
		for _, ln := range strings.Split(dataStr, "\n") {
			fmt.Fprintf(w, "data: %s\n", ln)
		}
		fmt.Fprint(w, "\n")
		flusher.Flush()

		// Parse JSON for our own bookkeeping.
		switch curEvent {
		case "agent_update":
			var u struct {
				Agent     string   `json:"agent"`
				Content   string   `json:"content"`
				ToolCalls []string `json:"tool_calls"`
			}
			if err := json.Unmarshal([]byte(dataStr), &u); err == nil {
				if u.Agent != "" {
					if _, seen := agentPathSet[u.Agent]; !seen {
						agentPathSet[u.Agent] = struct{}{}
					}
				}
				for _, tc := range u.ToolCalls {
					toolSet[tc] = struct{}{}
				}
				snippet := u.Content
				if snippet == "" && len(u.ToolCalls) > 0 {
					snippet = "tools: " + strings.Join(u.ToolCalls, ", ")
				}
				snippet = truncate(strings.TrimSpace(snippet), 280)
				if snippet != "" && len(trace) < 200 {
					prefix := u.Agent
					if prefix == "" {
						prefix = "agent"
					}
					trace = append(trace, prefix+": "+snippet)
				}
			}
		case "final":
			var f struct {
				Answer string `json:"answer"`
			}
			if err := json.Unmarshal([]byte(dataStr), &f); err == nil {
				finalAnswer = f.Answer
			}
		case "error":
			var e struct {
				Message string `json:"message"`
			}
			if err := json.Unmarshal([]byte(dataStr), &e); err == nil {
				errMsg = e.Message
			}
		case "done":
			gotDone = true
		}

		curEvent = ""
		curData.Reset()
	}

	for scanner.Scan() {
		line := scanner.Text()
		// Comment / keepalive: relay as-is.
		if strings.HasPrefix(line, ":") {
			fmt.Fprintf(w, "%s\n\n", line)
			flusher.Flush()
			continue
		}
		if line == "" {
			flushFrame()
			continue
		}
		if strings.HasPrefix(line, "event:") {
			curEvent = strings.TrimSpace(strings.TrimPrefix(line, "event:"))
			continue
		}
		if strings.HasPrefix(line, "data:") {
			d := strings.TrimPrefix(line, "data:")
			d = strings.TrimPrefix(d, " ")
			if curData.Len() > 0 {
				curData.WriteString("\n")
			}
			curData.WriteString(d)
			continue
		}
		// Other SSE fields (id, retry) — relay
		fmt.Fprintf(w, "%s\n", line)
	}
	flushFrame()

	// Persist final state.
	status := "success"
	if errMsg != "" || (!gotDone && finalAnswer == "") {
		status = "error"
		if errMsg == "" {
			errMsg = "stream ended without final answer"
		}
	}
	completedAt := time.Now()
	durationMs := completedAt.Sub(now).Milliseconds()

	agentPath := make([]string, 0, len(agentPathSet))
	for k := range agentPathSet {
		agentPath = append(agentPath, k)
	}
	tools := make([]string, 0, len(toolSet))
	for k := range toolSet {
		tools = append(tools, k)
	}

	updCtx, updCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer updCancel()
	_, _ = config.Analyses().UpdateOne(updCtx,
		bson.M{"_id": analysisID},
		bson.M{"$set": bson.M{
			"answer":      finalAnswer,
			"trace":       trace,
			"traceCount":  len(trace),
			"agentPath":   agentPath,
			"toolCalls":   tools,
			"status":      status,
			"error":       errMsg,
			"durationMs":  durationMs,
			"completedAt": completedAt,
		}},
	)
}

// failAndPersist writes an SSE error event to the client and marks the analysis failed.
func failAndPersist(w http.ResponseWriter, flusher http.Flusher, id primitive.ObjectID, started time.Time, msg string) {
	// If headers not yet written, set them now.
	if w.Header().Get("Content-Type") == "" {
		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.WriteHeader(http.StatusOK)
	}
	payload, _ := json.Marshal(map[string]string{"message": msg})
	fmt.Fprintf(w, "event: error\ndata: %s\n\n", payload)
	fmt.Fprintf(w, "event: done\ndata: {}\n\n")
	flusher.Flush()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, _ = config.Analyses().UpdateOne(ctx,
		bson.M{"_id": id},
		bson.M{"$set": bson.M{
			"status":      "error",
			"error":       msg,
			"durationMs":  time.Since(started).Milliseconds(),
			"completedAt": time.Now(),
		}},
	)
}

func truncate(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n] + "…"
}

// AnalysisHistory lists the user's past analyses (without full answer body).
func AnalysisHistory(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFrom(r)
	userID, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "invalid user")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()
	opts := mopt.Find().
		SetSort(bson.D{{Key: "createdAt", Value: -1}}).
		SetLimit(50).
		SetProjection(bson.M{"answer": 0, "trace": 0})
	cur, err := config.Analyses().Find(ctx, bson.M{"userId": userID}, opts)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "db error")
		return
	}
	var items []models.Analysis
	if err := cur.All(ctx, &items); err != nil {
		writeErr(w, http.StatusInternalServerError, "decode error")
		return
	}
	if items == nil {
		items = []models.Analysis{}
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"data": items})
}

// AnalysisGet returns a single analysis (with full answer + trace).
func AnalysisGet(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFrom(r)
	userID, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "invalid user")
		return
	}
	id := chi.URLParam(r, "id")
	aid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "invalid id")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()
	var a models.Analysis
	if err := config.Analyses().FindOne(ctx, bson.M{"_id": aid, "userId": userID}).Decode(&a); err != nil {
		writeErr(w, http.StatusNotFound, "not found")
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"data": a})
}

// AnalysisDelete removes a single analysis.
func AnalysisDelete(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFrom(r)
	userID, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "invalid user")
		return
	}
	id := chi.URLParam(r, "id")
	aid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "invalid id")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()
	res, err := config.Analyses().DeleteOne(ctx, bson.M{"_id": aid, "userId": userID})
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "db error")
		return
	}
	if res.DeletedCount == 0 {
		writeErr(w, http.StatusNotFound, "not found")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"message": "deleted"})
}
