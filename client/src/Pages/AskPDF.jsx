import React, { useState, useRef, useEffect, useCallback } from "react";
import AskPDFComposer from "../Components/AskPDFComposer";

/**
 * AskPDF — Chat with your PDF using RAG + Hybrid Search
 * Route: /ask-pdf
 *
 * Frontend-only scaffold. Swap the simulated RAG call inside `askQuestion`
 * with your real backend endpoint, e.g.:
 *
 *   const res = await fetch("/api/ask", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({
 *       documentId: file.id,
 *       question: input,
 *       // hybrid search: dense vector retrieval + sparse keyword/BM25
 *       searchMode: "hybrid",
 *       topK: 8,
 *     }),
 *   });
 *   const data = await res.json(); // { answer, sources: [{ page, snippet, score }] }
 */

const SUGGESTED_QUESTIONS = [
  "What is this document about?",
  "Summarize the key findings.",
  "List all the action items mentioned.",
];

const AskPDF = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isIndexed, setIsIndexed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const chatScrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

  // ── Auto-scroll + themed "scroll to bottom" button ────────────────────
  const scrollToBottom = useCallback((smooth = true) => {
    const el = chatScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }, []);

  const handleChatScroll = () => {
    const el = chatScrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distanceFromBottom > 120);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, scrollToBottom]);

  // ── PDF upload (drag & drop / click) ──────────────────────────────────
  const processFile = (pdf) => {
    if (!pdf) return;
    if (pdf.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    setFile({ name: pdf.name, size: pdf.size, id: null });
    setMessages([]);
    setIsIndexed(false);
    setIsUploading(true);

    // Simulated upload + chunking + embedding (RAG indexing) phase.
    // Replace with: POST /api/upload → returns { documentId }
    setTimeout(() => {
      setFile((f) => ({ ...f, id: `doc_${Date.now()}` }));
      setIsUploading(false);
      setIsIndexed(true);
    }, 1800);
  };

  const onDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    processFile(e.dataTransfer.files[0]);
  };

  const onDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current += 1;
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current -= 1;
  };

  // ── RAG + Hybrid Search question flow ─────────────────────────────────
  const askQuestion = async (question) => {
    const q = question.trim();
    if (!q || isThinking) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    setIsThinking(true);

    // Simulated RAG + hybrid-search response.
    // Hybrid search = dense vector similarity (semantic) + BM25/keyword
    // retrieval, fused (e.g. RRF) and reranked before the LLM answers.
    await new Promise((r) => setTimeout(r, 1400));

    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        content: `Based on your document **${file?.name}**, here's what I found (hybrid search across semantic + keyword indexes):`,
        sources: [
          {
            page: 1,
            snippet: "Most relevant retrieved chunk will appear here…",
            score: 0.94,
          },
          {
            page: 4,
            snippet: "Second-ranked passage from the reranked results…",
            score: 0.87,
          },
        ],
      },
    ]);
    setIsThinking(false);
  };

  return (
    <div
      className={`bg-cream ${
        isIndexed
          ? "min-h-[calc(100dvh-80px)] px-3 py-3 lg:px-5"
          : "min-h-screen px-6 py-10 lg:px-10"
      }`}
    >
      <div className={isIndexed ? "mx-auto w-full" : "mx-auto max-w-[1440px]"}>
        {/* Header */}
        {!isIndexed && (
          <div className="mb-8 text-center">
            <h1 className="mx-auto max-w-3xl text-[36px] font-medium leading-[0.95] tracking-heading text-ink sm:text-[48px] lg:text-[56px] lg:tracking-display">
              Ask Your <span className="rounded-2xl bg-accent px-3">PDF</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-body-lg text-body">
              Chat with any document using RAG + hybrid search — semantic vector
              retrieval fused with keyword search for precise, sourced answers.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 items-stretch gap-6">
          {/* ── Left: PDF upload panel ── */}
          {!isIndexed && (
            <div className="flex flex-col gap-6">
              <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-3xl border-2 border-dashed border-sand bg-paper p-8 text-center transition-colors duration-300 hover:border-ink"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => processFile(e.target.files[0])}
                />
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-ink">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 011 9.9M12 12v9m0-9l-4 4m4-4l4 4" />
                  </svg>
                </div>
                <h3 className="text-[20px] font-medium tracking-heading text-ink">
                  {isUploading ? "Indexing document…" : "Upload your PDF"}
                </h3>
                <p className="mt-2 text-base text-body">
                  Drag & drop or click to browse. Up to 50MB.
                </p>
                {isUploading && (
                  <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-sand">
                    <div className="h-full w-2/3 animate-pulse rounded-full bg-accent" />
                  </div>
                )}
              </div>

              {/* Uploaded file card */}
              {file && !isUploading && (
                <div className="rounded-3xl border border-sand bg-paper p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-ink">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <path d="M14 2v6h6" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-medium text-ink">
                        {file.name}
                      </p>
                      <p className="text-caption text-muted">Processing…</p>
                    </div>
                    <button
                      onClick={() => {
                        setFile(null);
                        setMessages([]);
                        setIsIndexed(false);
                        setShowScrollBtn(false);
                      }}
                      className="rounded-full border border-sand px-3 py-1 text-caption text-body transition-colors hover:border-ink hover:text-ink"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* RAG info card */}
              <div className="rounded-3xl border border-sand bg-sand p-6">
                <h4 className="text-base font-medium tracking-heading text-ink">
                  How answers are retrieved
                </h4>
                <ul className="mt-3 space-y-2 text-caption text-body">
                  <li>• Dense vector search for semantic meaning</li>
                  <li>• BM25 keyword search for exact terms</li>
                  <li>• RRF fusion + reranking before generation</li>
                  <li>• Page-level source citations</li>
                </ul>
              </div>
            </div>
          )}

          {/* ── Chat replaces the uploader once the PDF is indexed ── */}
          {file && isIndexed && (
            <div className="relative mx-auto flex h-[calc(100dvh-112px)] min-h-[min(560px,calc(100dvh-112px))] w-full max-w-5xl min-w-0 flex-col overflow-hidden rounded-3xl border border-sand bg-paper">
              <div className="flex items-center justify-between gap-4 border-b border-sand bg-cream px-5 py-3 lg:px-8">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    Chatting with
                  </p>
                  <p className="truncate text-base font-medium text-ink">
                    {file.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setMessages([]);
                    setInput("");
                    setIsIndexed(false);
                    setShowScrollBtn(false);
                  }}
                  className="shrink-0 rounded-full border border-sand px-4 py-2 text-sm text-body transition-colors hover:border-ink hover:text-ink"
                >
                  Change PDF
                </button>
              </div>
              {/* Chat scroll area */}
              <div className="relative min-h-0 flex-1">
                <div
                  ref={chatScrollRef}
                  onScroll={handleChatScroll}
                  className="absolute inset-0 space-y-6 overflow-y-auto px-6 py-6 lg:px-8"
                >
                  {messages.length === 0 && !isThinking ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <h3 className="text-[24px] font-medium tracking-heading text-ink">
                        What would you like to know?
                      </h3>
                      <p className="mt-2 max-w-sm text-base text-body">
                        Your document is indexed. Try one of these:
                      </p>
                      <div className="mt-6 flex max-w-md flex-wrap justify-center gap-3">
                        {SUGGESTED_QUESTIONS.map((q) => (
                          <button
                            key={q}
                            onClick={() => askQuestion(q)}
                            className="rounded-full border border-sand bg-cream px-4 py-2 text-caption text-body transition-colors duration-300 hover:border-ink hover:text-ink"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-3xl px-5 py-4 sm:max-w-[70%] ${
                            msg.role === "user"
                              ? "rounded-br-lg bg-ink text-cream"
                              : "rounded-bl-lg border border-sand bg-cream text-ink"
                          }`}
                        >
                          <p className="text-base leading-relaxed">
                            {msg.content}
                          </p>
                          {msg.sources && (
                            <div className="mt-4 space-y-2 border-t border-sand pt-3">
                              {msg.sources.map((s, j) => (
                                <div
                                  key={j}
                                  className="flex items-start gap-2 text-caption text-body"
                                >
                                  <span className="mt-0.5 shrink-0 rounded-full bg-accent px-2 py-0.5 font-medium text-ink">
                                    p. {s.page}
                                  </span>
                                  <span>{s.snippet}</span>
                                  <span className="ml-auto shrink-0 text-muted">
                                    {Math.round(s.score * 100)}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}

                  {isThinking && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-2 rounded-3xl rounded-bl-lg border border-sand bg-cream px-5 py-4">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-body" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-body [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-body [animation-delay:300ms]" />
                        <span className="ml-2 text-caption text-body">
                          Searching + generating…
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {showScrollBtn && (
                  <button
                    onClick={() => scrollToBottom()}
                    aria-label="Scroll to latest message"
                    className="absolute bottom-3 left-1/2 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-sand bg-accent text-ink shadow-md transition-transform hover:scale-105"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 14l-7 7-7-7m7 7V3" />
                    </svg>
                  </button>
                )}
              </div>
              <AskPDFComposer
                input={input}
                onInputChange={setInput}
                onSubmit={() => askQuestion(input)}
                isThinking={isThinking}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AskPDF;
