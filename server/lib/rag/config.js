require("dotenv").config();

const num = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const trimmed = (value) => (typeof value === "string" ? value.trim() : "");

/**
 * Retrieval pipeline settings.
 *
 * Everything here is overridable from server/.env so the deployed instance can
 * point at a different Qdrant cluster or embedder without touching code.
 */
const rag = {
  qdrant: {
    url: trimmed(process.env.QDRANT_URL),
    apiKey: trimmed(process.env.QDRANT_API_KEY),
    collection: trimmed(process.env.QDRANT_COLLECTION) || "askpdf_docs",
    timeoutMs: num(process.env.QDRANT_TIMEOUT_MS, 30_000),
  },
  ollama: {
    url: (trimmed(process.env.OLLAMA_URL) || "http://127.0.0.1:11434").replace(
      /\/+$/,
      "",
    ),
    model: trimmed(process.env.EMBEDDING_MODEL) || "embeddinggemma-2:440m",
    // embeddinggemma is 768-dim; a mismatch here means the collection was
    // created for a different model and every upsert will be rejected.
    dim: num(process.env.EMBEDDING_DIM, 768),
    batchSize: num(process.env.EMBEDDING_BATCH_SIZE, 8),
    timeoutMs: num(process.env.EMBEDDING_TIMEOUT_MS, 120_000),
  },
  rerank: {
    model: trimmed(process.env.COHERE_RERANK_MODEL) || "rerank-v4.0-fast",
    topN: num(process.env.RAG_TOP_N, 5),
    // RRF candidates handed to the reranker; must be >= topN.
    candidateK: num(process.env.RAG_CANDIDATE_K, 40),
  },
  chat: {
    model: trimmed(process.env.GEMINI_CHAT_MODEL) || "gemini-3.1-flash-lite",
    topK: num(process.env.RAG_TOP_K, 10),
    maxOutputTokens: num(process.env.GEMINI_MAX_OUTPUT_TOKENS, 2048),
    temperature: 0.2,
  },
  chunk: {
    size: num(process.env.RAG_CHUNK_SIZE, 1200),
    overlap: num(process.env.RAG_CHUNK_OVERLAP, 200),
    minChars: num(process.env.RAG_MIN_CHUNK_CHARS, 40),
    maxChunks: num(process.env.RAG_MAX_CHUNKS, 4000),
  },
  history: {
    maxMessages: num(process.env.RAG_HISTORY_MESSAGES, 5),
    maxCharsPerMessage: num(process.env.RAG_HISTORY_MESSAGE_CHARS, 2000),
  },
};

/** Throw a 503 with an actionable message when a stage is not configured. */
class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 503;
    this.code = "NOT_CONFIGURED";
  }
}

const requireQdrant = () => {
  if (!rag.qdrant.url) {
    throw new ConfigError(
      "QDRANT_URL is not configured on the server. Set QDRANT_URL (and QDRANT_API_KEY for Qdrant Cloud) in server/.env.",
    );
  }
  if (/cloud\.qdrant\.io/i.test(rag.qdrant.url) && !rag.qdrant.apiKey) {
    throw new ConfigError(
      "QDRANT_API_KEY is required for Qdrant Cloud. Set it in server/.env.",
    );
  }
};

const requireEmbedder = () => {
  if (!rag.ollama.model) {
    throw new ConfigError(
      "EMBEDDING_MODEL is not configured. Set it in server/.env (e.g. embeddinggemma-2:440m).",
    );
  }
};

const requireGemini = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new ConfigError("GEMINI_API_KEY is not configured on the server.");
  }
};

module.exports = {
  rag,
  ConfigError,
  requireQdrant,
  requireEmbedder,
  requireGemini,
};
