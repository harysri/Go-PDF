require("dotenv").config();
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");

const { rag } = require("../lib/rag/config");
const { extractPages, chunkPages } = require("../lib/rag/chunk");
const { embedTexts, embedQuery, pingOllama } = require("../lib/rag/embed");
const {
  hybridSearch,
  upsertChunks,
  deleteDocument,
  pingQdrant,
} = require("../lib/rag/qdrant");
const { rerankChunks } = require("../lib/rag/rerank");
const { condenseQuestion, answerQuestion } = require("../lib/rag/llm");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// Held in memory: the chunk text is what gets indexed, the file itself is
// never needed again, so nothing touches disk.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

const runUpload = (req, res) =>
  new Promise((resolve, reject) => {
    upload.single("file")(req, res, (error) => (error ? reject(error) : resolve()));
  });

const fail = (res, error, fallbackMessage) => {
  const status =
    error.statusCode || (error.code === "LIMIT_FILE_SIZE" ? 413 : 500);

  if (status >= 500) {
    console.error(`[ask-pdf] ${error.message}`);
  }

  return res.status(status).json({
    error: status >= 500 ? fallbackMessage || "Something went wrong" : error.message,
    details: error.message,
    code: error.code,
  });
};

const NOT_FOUND_ANSWER = "I couldn't find that in this document.";

// ---------------------------------------------------------------------------
// POST /api/ask-pdf/upload  ->  { documentId, pages, chunks }
// Chunk -> embed -> upsert. Hybrid search needs both vectors up front.
// Signed-in only: the Ask PDF page is a protected route, so the endpoints it
// calls require the same bearer token (GET /health stays public for probes).
// ---------------------------------------------------------------------------
router.post("/upload", authenticateUser, async (req, res) => {
  const startedAt = Date.now();

  try {
    await runUpload(req, res);

    if (!req.file) {
      return res.status(400).json({ error: "No PDF uploaded (expected field name 'file')" });
    }

    const looksLikePdf =
      req.file.mimetype === "application/pdf" ||
      req.file.buffer.subarray(0, 5).toString("latin1") === "%PDF-";

    if (!looksLikePdf) {
      return res.status(400).json({ error: "Uploaded file is not a PDF" });
    }

    const { pages, numPages } = await extractPages(req.file.buffer);

    if (pages.length === 0) {
      return res.status(422).json({
        error:
          "No selectable text found in this PDF. Scanned documents need OCR before they can be indexed.",
      });
    }

    const chunks = chunkPages(pages);

    if (chunks.length === 0) {
      return res.status(422).json({ error: "Could not extract usable text chunks from this PDF" });
    }

    const documentId = crypto.randomUUID();
    const denseVectors = await embedTexts(chunks.map((chunk) => chunk.text));

    const indexed = await upsertChunks({
      documentId,
      filename: req.file.originalname || "document.pdf",
      chunks,
      denseVectors,
    });

    res.json({
      documentId,
      filename: req.file.originalname || "document.pdf",
      pages: pages.length,
      numPages,
      chunks: indexed,
      meta: {
        embeddingModel: rag.ollama.model,
        embeddingDim: rag.ollama.dim,
        collection: rag.qdrant.collection,
        durationMs: Date.now() - startedAt,
      },
    });
  } catch (error) {
    return fail(res, error, "Failed to index PDF");
  }
});

// ---------------------------------------------------------------------------
// POST /api/ask-pdf/ask  ->  { answer, sources }
// Query -> condense -> embed -> hybrid RRF -> rerank -> generate.
// ---------------------------------------------------------------------------
router.post("/ask", authenticateUser, async (req, res) => {
  const startedAt = Date.now();
  const timings = {};

  try {
    const { documentId, question, history = [], topK } = req.body || {};

    if (!documentId || typeof documentId !== "string") {
      return res.status(400).json({ error: "documentId is required" });
    }

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ error: "question is required" });
    }

    if (question.length > 2000) {
      return res.status(400).json({ error: "question is too long (max 2000 characters)" });
    }

    if (!Array.isArray(history)) {
      return res.status(400).json({ error: "history must be an array of { role, content }" });
    }

    // 1. Retrieval query: follow-ups are ambiguous on their own.
    const searchQuery = await condenseQuestion({ history, question: question.trim() });
    timings.condenseMs = Date.now() - startedAt;

    // 2. Dense query vector (sparse side is inferred by Qdrant from the text).
    const queryVector = await embedQuery(searchQuery);
    timings.embedMs = Date.now() - startedAt - timings.condenseMs;

    // 3. Hybrid search, fused with RRF inside Qdrant.
    const candidates = await hybridSearch({
      documentId,
      queryText: searchQuery,
      queryVector,
      limit: Math.max(rag.rerank.candidateK, Number(topK) || rag.chat.topK),
    });
    timings.searchMs = Date.now() - startedAt - timings.condenseMs - timings.embedMs;

    if (candidates.length === 0) {
      return res.json({
        answer: NOT_FOUND_ANSWER,
        sources: [],
        query: searchQuery,
        meta: { retrieved: 0, timings: { ...timings, totalMs: Date.now() - startedAt } },
      });
    }

    // 4. Cross-encoder keeps the best handful.
    const rerankStartedAt = Date.now();
    const { chunks, applied, reason, model } = await rerankChunks({
      query: searchQuery,
      candidates,
      topN: Number(topK) || rag.rerank.topN,
    });
    timings.rerankMs = Date.now() - rerankStartedAt;

    // 5. Grounded generation.
    const answerStartedAt = Date.now();
    const answer = await answerQuestion({
      history,
      chunks,
      question: question.trim(),
    });
    timings.answerMs = Date.now() - answerStartedAt;

    const sources = chunks.map((chunk, index) => ({
      id: `S${index + 1}`,
      page: chunk.page,
      chunkIndex: chunk.chunkIndex,
      snippet:
        chunk.text.length > 240 ? `${chunk.text.slice(0, 240).trimEnd()}…` : chunk.text,
      score: Number(chunk.score) || 0,
    }));

    res.json({
      answer,
      sources,
      query: searchQuery,
      meta: {
        retrieved: candidates.length,
        reranked: applied,
        rerankModel: applied ? model : undefined,
        rerankSkipped: reason,
        chatModel: rag.chat.model,
        timings: { ...timings, totalMs: Date.now() - startedAt },
      },
    });
  } catch (error) {
    return fail(res, error, "Failed to answer question");
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/ask-pdf/:documentId
// ---------------------------------------------------------------------------
router.delete("/:documentId", authenticateUser, async (req, res) => {
  try {
    const { documentId } = req.params;
    if (!documentId) return res.status(400).json({ error: "documentId is required" });

    await deleteDocument(documentId);
    res.json({ deleted: true, documentId });
  } catch (error) {
    return fail(res, error, "Failed to delete document");
  }
});

// ---------------------------------------------------------------------------
// GET /api/ask-pdf/health — which stages are actually wired up
// ---------------------------------------------------------------------------
router.get("/health", async (req, res) => {
  const [ollama, qdrant] = await Promise.all([pingOllama(), pingQdrant()]);

  res.json({
    ok: Boolean(ollama.ok && qdrant.ok && process.env.GEMINI_API_KEY),
    embedder: ollama,
    qdrant,
    reranker: {
      ok: Boolean(process.env.COHERE_API_KEY),
      model: rag.rerank.model,
    },
    chat: {
      ok: Boolean(process.env.GEMINI_API_KEY),
      model: rag.chat.model,
    },
  });
});

module.exports = router;
