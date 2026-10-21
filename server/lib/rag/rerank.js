const { CohereClient } = require("cohere-ai");
const { rag } = require("./config");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let client = null;
const getClient = () => {
  if (!client) client = new CohereClient({ token: process.env.COHERE_API_KEY });
  return client;
};

/**
 * Reranks RRF candidates and keeps the best `topN`.
 *
 * RRF ranking is cheap but coarse; the cross-encoder is what actually makes
 * "which of these 40 chunks answers the question" reliable. If Cohere is down
 * or unconfigured we fall back to fusion order and report it, rather than
 * failing a request that can still produce a grounded answer.
 */
async function rerankChunks({ query, candidates, topN = rag.rerank.topN }) {
  const fallback = () => ({
    chunks: candidates.slice(0, topN).map((chunk, index) => ({
      ...chunk,
      score: chunk.score,
      rank: index,
    })),
    applied: false,
    reason: undefined,
  });

  if (candidates.length === 0) return { chunks: [], applied: false };

  if (!process.env.COHERE_API_KEY) {
    console.warn("[rag] COHERE_API_KEY is missing - returning RRF order without reranking");
    return { ...fallback(), reason: "COHERE_API_KEY is not configured" };
  }

  let lastError;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await getClient().rerank({
        model: rag.rerank.model,
        query,
        documents: candidates.map((chunk) => chunk.text),
        topN: Math.min(topN, candidates.length),
        maxChunksPerDoc: 1,
      });

      const results = response.results || [];
      const chunks = results
        .map((result) => {
          const candidate = candidates[result.index];
          if (!candidate) return null;
          const score = result.relevanceScore ?? result.relevance_score ?? 0;
          return { ...candidate, score: Number(score), rank: results.indexOf(result) };
        })
        .filter(Boolean);

      if (chunks.length === 0) throw new Error("rerank returned no results");

      return { chunks, applied: true, model: rag.rerank.model };
    } catch (error) {
      lastError = error;
      const status = error.statusCode || error.status;
      if (status && status !== 429 && status < 500) break;
      await sleep(800 * 2 ** attempt);
    }
  }

  console.error(`[rag] Cohere rerank failed: ${lastError?.message}`);
  return { ...fallback(), reason: lastError?.message || "rerank failed" };
}

module.exports = { rerankChunks };
