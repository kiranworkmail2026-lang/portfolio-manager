package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	mopt "go.mongodb.org/mongo-driver/mongo/options"

	"portfolio-manager/server/config"
	"portfolio-manager/server/middleware"
	"portfolio-manager/server/models"
)

// ---- helpers ----

var (
	slugRe  = regexp.MustCompile(`[^a-z0-9]+`)
	htmlTag = regexp.MustCompile(`<[^>]*>`)
)

func slugify(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	s = slugRe.ReplaceAllString(s, "-")
	s = strings.Trim(s, "-")
	if s == "" {
		s = "post"
	}
	if len(s) > 80 {
		s = s[:80]
		s = strings.Trim(s, "-")
	}
	return s
}

func uniqueSlug(ctx context.Context, base string, excludeID primitive.ObjectID) (string, error) {
	candidate := base
	for i := 1; i < 50; i++ {
		filter := bson.M{"slug": candidate, "status": "published"}
		if !excludeID.IsZero() {
			filter["_id"] = bson.M{"$ne": excludeID}
		}
		count, err := config.Posts().CountDocuments(ctx, filter)
		if err != nil {
			return "", err
		}
		if count == 0 {
			return candidate, nil
		}
		candidate = fmt.Sprintf("%s-%d", base, i+1)
	}
	return fmt.Sprintf("%s-%d", base, time.Now().Unix()), nil
}

func makeExcerpt(html string, max int) string {
	plain := htmlTag.ReplaceAllString(html, " ")
	plain = strings.Join(strings.Fields(plain), " ")
	if utf8.RuneCountInString(plain) <= max {
		return plain
	}
	r := []rune(plain)
	return strings.TrimSpace(string(r[:max])) + "…"
}

// ---- request shapes ----

type createPostReq struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

type updatePostReq struct {
	Title   *string `json:"title,omitempty"`
	Content *string `json:"content,omitempty"`
	Status  *string `json:"status,omitempty"`
}

// ---- handlers (authenticated, author-scoped) ----

// CreatePost — POST /api/posts
// Creates a draft from the supplied title and HTML content.
// If title is empty it defaults to "Untitled".
func CreatePost(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFrom(r)
	userID, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "invalid user")
		return
	}

	var req createPostReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid body")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	// Look up author name
	var author models.User
	if err := config.Users().FindOne(ctx, bson.M{"_id": userID}).Decode(&author); err != nil {
		writeErr(w, http.StatusUnauthorized, "user not found")
		return
	}

	title := strings.TrimSpace(req.Title)
	contentHTML := req.Content

	if title == "" {
		title = "Untitled"
	}

	now := time.Now()
	excerpt := makeExcerpt(contentHTML, 200)

	post := models.Post{
		AuthorID:   userID,
		AuthorName: author.Name,
		Title:      title,
		Slug:       "", // assigned on first publish
		Content:    contentHTML,
		Excerpt:    excerpt,
		Status:     "draft",
		CreatedAt:  now,
		UpdatedAt:  now,
	}
	res, err := config.Posts().InsertOne(ctx, post)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "insert error")
		return
	}
	post.ID = res.InsertedID.(primitive.ObjectID)
	writeJSON(w, http.StatusCreated, map[string]interface{}{"data": post})
}

// ListMyPosts — GET /api/posts (author's drafts + published, newest first)
func ListMyPosts(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFrom(r)
	userID, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "invalid user")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()
	opts := mopt.Find().SetSort(bson.D{{Key: "updatedAt", Value: -1}}).SetLimit(100)
	cur, err := config.Posts().Find(ctx, bson.M{"authorId": userID}, opts)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "db error")
		return
	}
	var posts []models.Post
	if err := cur.All(ctx, &posts); err != nil {
		writeErr(w, http.StatusInternalServerError, "decode error")
		return
	}
	if posts == nil {
		posts = []models.Post{}
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"data": posts})
}

// GetMyPost — GET /api/posts/:id (author only)
func GetMyPost(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFrom(r)
	userID, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "invalid user")
		return
	}
	id := chi.URLParam(r, "id")
	pid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "invalid id")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()
	var p models.Post
	if err := config.Posts().FindOne(ctx, bson.M{"_id": pid, "authorId": userID}).Decode(&p); err != nil {
		writeErr(w, http.StatusNotFound, "not found")
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"data": p})
}

// UpdatePost — PATCH /api/posts/:id (author only).
// Updates any of: title, content, status. Generates slug + publishedAt on first publish.
func UpdatePost(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFrom(r)
	userID, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "invalid user")
		return
	}
	id := chi.URLParam(r, "id")
	pid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "invalid id")
		return
	}
	var req updatePostReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid body")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	// Load existing
	var existing models.Post
	if err := config.Posts().FindOne(ctx, bson.M{"_id": pid, "authorId": userID}).Decode(&existing); err != nil {
		writeErr(w, http.StatusNotFound, "not found")
		return
	}

	now := time.Now()
	set := bson.M{"updatedAt": now}

	if req.Title != nil {
		t := strings.TrimSpace(*req.Title)
		if t == "" {
			writeErr(w, http.StatusBadRequest, "title cannot be empty")
			return
		}
		set["title"] = t
		existing.Title = t
	}
	if req.Content != nil {
		set["content"] = *req.Content
		set["excerpt"] = makeExcerpt(*req.Content, 200)
		existing.Content = *req.Content
	}

	if req.Status != nil {
		switch *req.Status {
		case "draft":
			set["status"] = "draft"
		case "published":
			// Validate publishable
			if strings.TrimSpace(existing.Title) == "" {
				writeErr(w, http.StatusBadRequest, "title required to publish")
				return
			}
			if strings.TrimSpace(htmlTag.ReplaceAllString(existing.Content, " ")) == "" {
				writeErr(w, http.StatusBadRequest, "content required to publish")
				return
			}
			set["status"] = "published"
			// Generate slug if not set, or if title changed and slug isn't unique
			base := slugify(existing.Title)
			slug, err := uniqueSlug(ctx, base, pid)
			if err != nil {
				writeErr(w, http.StatusInternalServerError, "slug error")
				return
			}
			set["slug"] = slug
			if existing.PublishedAt == nil {
				set["publishedAt"] = now
			}
		default:
			writeErr(w, http.StatusBadRequest, "status must be draft or published")
			return
		}
	}

	_, err = config.Posts().UpdateOne(ctx, bson.M{"_id": pid, "authorId": userID}, bson.M{"$set": set})
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "update error")
		return
	}

	// Return updated doc
	var updated models.Post
	if err := config.Posts().FindOne(ctx, bson.M{"_id": pid}).Decode(&updated); err != nil {
		writeErr(w, http.StatusInternalServerError, "reload error")
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"data": updated})
}

// DeletePost — DELETE /api/posts/:id (author only, hard delete)
func DeletePost(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFrom(r)
	userID, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "invalid user")
		return
	}
	id := chi.URLParam(r, "id")
	pid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "invalid id")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()
	res, err := config.Posts().DeleteOne(ctx, bson.M{"_id": pid, "authorId": userID})
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

// ---- public endpoints ----

// publicPost is what we expose at /api/blog (no draft fields, no IDs that aren't useful).
type publicPost struct {
	ID          primitive.ObjectID `json:"id"`
	AuthorName  string             `json:"authorName"`
	Title       string             `json:"title"`
	Slug        string             `json:"slug"`
	Excerpt     string             `json:"excerpt"`
	Content     string             `json:"content,omitempty"`
	PublishedAt *time.Time         `json:"publishedAt,omitempty"`
}

func toPublic(p models.Post, includeContent bool) publicPost {
	pp := publicPost{
		ID:          p.ID,
		AuthorName:  p.AuthorName,
		Title:       p.Title,
		Slug:        p.Slug,
		Excerpt:     p.Excerpt,
		PublishedAt: p.PublishedAt,
	}
	if includeContent {
		pp.Content = p.Content
	}
	return pp
}

// ListPublishedPosts — GET /api/blog (public)
func ListPublishedPosts(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()
	opts := mopt.Find().SetSort(bson.D{{Key: "publishedAt", Value: -1}}).SetLimit(50)
	cur, err := config.Posts().Find(ctx, bson.M{"status": "published"}, opts)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "db error")
		return
	}
	var posts []models.Post
	if err := cur.All(ctx, &posts); err != nil {
		writeErr(w, http.StatusInternalServerError, "decode error")
		return
	}
	out := make([]publicPost, 0, len(posts))
	for _, p := range posts {
		out = append(out, toPublic(p, false))
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"data": out})
}

// GetPublishedPostBySlug — GET /api/blog/:slug (public)
func GetPublishedPostBySlug(w http.ResponseWriter, r *http.Request) {
	slug := strings.TrimSpace(chi.URLParam(r, "slug"))
	if slug == "" {
		writeErr(w, http.StatusBadRequest, "slug required")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()
	var p models.Post
	err := config.Posts().FindOne(ctx, bson.M{"slug": slug, "status": "published"}).Decode(&p)
	if err == mongo.ErrNoDocuments {
		writeErr(w, http.StatusNotFound, "not found")
		return
	}
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "db error")
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"data": toPublic(p, true)})
}
