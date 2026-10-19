import React from "react";

const AskPDFComposer = ({ input, onInputChange, onSubmit, isThinking }) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="border-t border-sand bg-cream px-4 py-3 lg:px-6"
    >
      <div className="mx-auto flex max-w-5xl items-end gap-2">
        <textarea
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your PDF…"
          disabled={isThinking}
          rows={1}
          className="max-h-24 min-h-10 flex-1 resize-none rounded-xl border border-sand bg-paper px-3 py-2 text-sm leading-5 text-ink placeholder:text-muted focus:border-ink focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!input.trim() || isThinking}
          className="btn-accent flex h-10 w-10 shrink-0 items-center justify-center !rounded-xl !p-0 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M12 19V5m0 0l-6 6m6-6l6 6" transform="rotate(90 12 12)" />
          </svg>
        </button>
      </div>
      <p className="mx-auto mt-1.5 max-w-5xl text-center text-[11px] leading-4 text-muted">
        Answers use retrieval-augmented generation with hybrid search — verify
        critical details against the source pages.
      </p>
    </form>
  );
};

export default AskPDFComposer;
