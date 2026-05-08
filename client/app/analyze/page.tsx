"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { PrivateRoute } from "@/components/PrivateRoute";
import { api } from "@/lib/api";
import { streamAnalyze } from "@/lib/sse";

type Status = "idle" | "streaming" | "done" | "error";

interface AgentUpdate {
  agent: string;
  content: string;
  toolCalls?: string[];
  ts: number;
}

interface HistoryItem {
  id: string;
  question: string;
  status: string;
  durationMs: number;
  createdAt: string;
}

export default function AnalyzePage() {
  return (
    <PrivateRoute>
      <AnalyzeView />
    </PrivateRoute>
  );
}

function AnalyzeView() {
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [updates, setUpdates] = useState<AgentUpdate[]>([]);
  const [answer, setAnswer] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const startedAtRef = useRef<number>(0);
  const abortRef = useRef<AbortController | null>(null);

  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const loadHistory = async () => {
    try {
      const r = await api.get("/api/analyze/history");
      setHistory(r.data.data || []);
    } catch {}
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (status !== "streaming") return;
    const t = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 500);
    return () => clearInterval(t);
  }, [status]);

  const start = async () => {
    const q = question.trim();
    if (q.length < 1 || q.length > 4000) {
      setErrorMsg("Question must be 1–4000 characters.");
      return;
    }
    setStatus("streaming");
    setUpdates([]);
    setAnswer("");
    setErrorMsg("");
    setViewingId(null);
    startedAtRef.current = Date.now();
    setElapsed(0);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    await streamAnalyze({
      question: q,
      baseURL,
      signal: ctrl.signal,
      onEvent: (event, data) => {
        if (event === "agent_update") {
          setUpdates((prev) => [
            ...prev,
            {
              agent: data?.agent || "agent",
              content: typeof data?.content === "string" ? data.content : "",
              toolCalls: Array.isArray(data?.tool_calls) ? data.tool_calls : [],
              ts: Date.now(),
            },
          ]);
        } else if (event === "final") {
          setAnswer(typeof data?.answer === "string" ? data.answer : "");
        } else if (event === "error") {
          setErrorMsg(data?.message || "Agent returned an error");
          setStatus("error");
        } else if (event === "done") {
          setStatus((s) => (s === "error" ? s : "done"));
          loadHistory();
        }
      },
      onError: (err) => {
        setErrorMsg(err.message);
        setStatus("error");
      },
      onDone: () => {
        setStatus((s) => {
          if (s === "streaming") {
            loadHistory();
            return "done";
          }
          return s;
        });
      },
    });
  };

  const cancel = () => {
    abortRef.current?.abort();
    setStatus("idle");
  };

  const loadPast = async (id: string) => {
    try {
      const r = await api.get(`/api/analyze/${id}`);
      const a = r.data.data;
      setViewingId(id);
      setQuestion(a.question);
      setAnswer(a.answer || "");
      setErrorMsg(a.status === "error" ? a.error || "Failed" : "");
      setUpdates(
        (a.trace || []).map((line: string, i: number) => {
          const colonIdx = line.indexOf(":");
          return {
            agent: colonIdx > 0 ? line.slice(0, colonIdx) : "agent",
            content: colonIdx > 0 ? line.slice(colonIdx + 1).trim() : line,
            ts: i,
          };
        })
      );
      setStatus(a.status === "error" ? "error" : "done");
    } catch {}
  };

  const deleteOne = async (id: string) => {
    if (!confirm("Delete this analysis?")) return;
    try {
      await api.delete(`/api/analyze/${id}`);
      if (viewingId === id) {
        setViewingId(null);
        setAnswer("");
        setUpdates([]);
        setStatus("idle");
      }
      loadHistory();
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      {/* Sidebar: history */}
      <aside className="bg-white rounded-lg shadow p-4 h-fit">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">History</h2>
        {history.length === 0 ? (
          <p className="text-xs text-gray-500">No analyses yet.</p>
        ) : (
          <ul className="space-y-2">
            {history.map((h) => (
              <li
                key={h.id}
                className={`group p-2 rounded border text-xs cursor-pointer hover:bg-indigo-50 ${
                  viewingId === h.id ? "border-indigo-400 bg-indigo-50" : "border-gray-200"
                }`}
                onClick={() => loadPast(h.id)}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{h.question}</p>
                    <p className="text-gray-500 mt-0.5">
                      <span
                        className={
                          h.status === "success"
                            ? "text-green-600"
                            : h.status === "error"
                            ? "text-red-600"
                            : "text-gray-500"
                        }
                      >
                        {h.status}
                      </span>
                      {" · "}
                      {(h.durationMs / 1000).toFixed(1)}s
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteOne(h.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-500 text-xs"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Main */}
      <section className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-2">Analyse</h1>
          <p className="text-sm text-gray-600 mb-4">
            Ask the multi-agent service a question. Typical responses ~30s; complex strategies up to a few minutes.
          </p>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={status === "streaming"}
            maxLength={4000}
            rows={4}
            placeholder="e.g., Analyse my portfolio's sector concentration and suggest rebalancing."
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">{question.length}/4000</span>
            <div className="flex gap-2">
              {status === "streaming" ? (
                <button
                  onClick={cancel}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-800 text-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={start}
                  disabled={!question.trim()}
                  className="px-4 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-50"
                >
                  Analyse
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live status / spinner */}
        {status === "streaming" && (
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <Spinner />
            <div className="flex-1">
              <p className="text-sm font-medium">Running agents…</p>
              <p className="text-xs text-gray-500">
                {elapsed}s elapsed · typically ~30s, up to ~3 min for complex questions
              </p>
            </div>
          </div>
        )}

        {/* Error box */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm">
            <strong>Error:</strong> {errorMsg}
          </div>
        )}

        {/* Trace */}
        {updates.length > 0 && (
          <details className="bg-white rounded-lg shadow p-4" open={status === "streaming"}>
            <summary className="cursor-pointer text-sm font-semibold text-gray-700">
              Agent trace ({updates.length})
            </summary>
            <ul className="mt-3 space-y-2 max-h-96 overflow-y-auto">
              {updates.map((u, i) => (
                <li key={i} className="text-xs border-l-2 border-indigo-200 pl-2">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono mr-2">
                    {u.agent}
                  </span>
                  {u.toolCalls && u.toolCalls.length > 0 && (
                    <span className="text-amber-700 mr-2">
                      [{u.toolCalls.join(", ")}]
                    </span>
                  )}
                  <span className="text-gray-700">{u.content}</span>
                </li>
              ))}
            </ul>
          </details>
        )}

        {/* Final answer */}
        {answer && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Answer</h3>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Spinner() {
  return (
    <div className="h-5 w-5 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
  );
}
