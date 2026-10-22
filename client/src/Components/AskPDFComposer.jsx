import React, { useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";
import toast from "react-hot-toast";

const AskPDFComposer = ({ input, onInputChange, onSubmit, isThinking }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const inputRef = useRef(input);
  const onInputChangeRef = useRef(onInputChange);

  useEffect(() => {
    inputRef.current = input;
    onInputChangeRef.current = onInputChange;
  }, [input, onInputChange]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = event.resultIndex; index < event.results.length; index++) {
        if (event.results[index].isFinal) {
          transcript += event.results[index][0].transcript;
        }
      }

      if (transcript) {
        const currentInput = inputRef.current;
        const separator =
          currentInput && !/\s$/.test(currentInput) ? " " : "";
        onInputChangeRef.current(`${currentInput}${separator}${transcript}`);
      }
    };

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error !== "no-speech") {
        toast.error(
          event.error === "not-allowed"
            ? "Microphone access was denied."
            : "Speech recognition could not start. Please try again.",
        );
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onstart = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, []);

  const toggleMic = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
      toast.error("Speech recognition could not start. Please try again.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    onSubmit();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-sand bg-cream px-4 py-3 lg:px-6"
    >
      {isListening && (
        <div className="voice-listening-indicator" role="status">
          <div className="voice-waveform" aria-hidden="true">
            {Array.from({ length: 7 }, (_, index) => (
              <span className="voice-waveform__bar" key={index} />
            ))}
          </div>
          <span>Listening...</span>
        </div>
      )}
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
        <span className="group relative shrink-0">
          <button
            type="button"
            onClick={toggleMic}
            disabled={isThinking}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
            aria-describedby="ask-pdf-mic-tooltip"
            aria-pressed={isListening}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              isListening
                ? "border-error bg-error text-paper"
                : "border-sand bg-paper text-ink hover:bg-cloud"
            }`}
          >
            <Mic className={`h-4 w-4 ${isListening ? "animate-pulse" : ""}`} />
          </button>
          <span
            id="ask-pdf-mic-tooltip"
            role="tooltip"
            className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2.5 py-1.5 text-xs text-paper opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          >
            {isListening ? "Stop voice input" : "Start voice input"}
          </span>
        </span>
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
