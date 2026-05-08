// Minimal SSE client over fetch + ReadableStream. Supports POST + cookies.
//
// Usage:
//   const stop = streamAnalyze({
//     question: "...",
//     onEvent: (name, data) => {...},
//     onError: (err) => {...},
//     onDone: () => {...},
//   });
//   // stop() to abort

export type SSEHandler = (event: string, data: any) => void;

export interface AnalyzeStreamOpts {
  question: string;
  baseURL: string;
  onEvent: SSEHandler;
  onError?: (err: Error) => void;
  onDone?: () => void;
  signal?: AbortSignal;
}

export async function streamAnalyze(opts: AnalyzeStreamOpts): Promise<void> {
  const ctrl = new AbortController();
  const signal = opts.signal ?? ctrl.signal;

  let res: Response;
  try {
    res = await fetch(`${opts.baseURL}/api/analyze`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
      body: JSON.stringify({ question: opts.question }),
      signal,
    });
  } catch (e: any) {
    opts.onError?.(new Error(e?.message || "network error"));
    return;
  }

  if (!res.ok || !res.body) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
    } catch {}
    opts.onError?.(new Error(msg));
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let curEvent = "";
  let curData = "";

  const flushFrame = () => {
    if (!curEvent && !curData) return;
    let parsed: any = curData;
    try {
      parsed = JSON.parse(curData);
    } catch {}
    opts.onEvent(curEvent || "message", parsed);
    curEvent = "";
    curData = "";
  };

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      let nl: number;
      while ((nl = buf.indexOf("\n")) !== -1) {
        const line = buf.slice(0, nl).replace(/\r$/, "");
        buf = buf.slice(nl + 1);

        if (line === "") {
          flushFrame();
        } else if (line.startsWith(":")) {
          // comment / keepalive — ignore
        } else if (line.startsWith("event:")) {
          curEvent = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          const d = line.slice(5).replace(/^ /, "");
          curData = curData ? curData + "\n" + d : d;
        }
      }
    }
    flushFrame();
    opts.onDone?.();
  } catch (e: any) {
    if (e?.name !== "AbortError") {
      opts.onError?.(new Error(e?.message || "stream error"));
    }
  }
}
