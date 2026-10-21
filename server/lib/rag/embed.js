const { rag, ConfigError } = require("./config");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryable = (status) => status === 429 || status >= 500;

/**
 * POST /api/embed on an Ollama daemon.
 *
 * Batching matters: embeddinggemma on CPU is the slowest ingest stage, and one
 * request per chunk pays the model warm-up cost every single time.
 */
async function embedBatch(texts) {
  const { url, model, dim, timeoutMs } = rag.ollama;

  let lastError;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    let response;

    try {
      response = await fetch(`${url}/api/embed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, input: texts, truncate: true }),
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      lastError = error;
      if (error.name === "TimeoutError") {
        lastError = new Error(
          `Embedding request timed out after ${Math.round(timeoutMs / 1000)}s`
        );
        break;
      }
      if (error.cause?.code === "ECONNREFUSED") {
        throw new ConfigError(
          `Ollama is not reachable at ${url}. Start it with \`ollama serve\` and make sure ${model} is pulled.`
        );
      }
      await sleep(1000 * 2 ** attempt);
      continue;
    }

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      lastError = new Error(
        `Ollama returned ${response.status}: ${body.slice(0, 300) || response.statusText}`
      );
      if (!isRetryable(response.status)) break;
      await sleep(1000 * 2 ** attempt);
      continue;
    }

    const payload = await response.json();

    // Newer daemons return `embeddings`; older single-input calls used `embedding`.
    const vectors = payload.embeddings || (payload.embedding ? [payload.embedding] : null);

    if (!Array.isArray(vectors) || vectors.length !== texts.length) {
      throw new Error(
        `Ollama returned ${vectors ? vectors.length : 0} vectors for ${texts.length} inputs`
      );
    }

    for (const vector of vectors) {
      if (!Array.isArray(vector) || vector.length !== dim) {
        throw new ConfigError(
          `Embedding model ${model} returned ${vector?.length ?? 0} dimensions, but EMBEDDING_DIM is ${dim}. ` +
            "Set EMBEDDING_DIM (and recreate the Qdrant collection) to match the model."
        );
      }
    }

    return vectors;
  }

  throw new Error(`Embedding failed (${model}): ${lastError?.message || "unknown error"}`);
}

/** Embeds many texts in fixed-size batches, preserving input order. */
async function embedTexts(texts) {
  const { batchSize } = rag.ollama;
  const vectors = [];

  for (let index = 0; index < texts.length; index += batchSize) {
    const slice = texts.slice(index, index + batchSize);
    const batch = await embedBatch(slice);
    vectors.push(...batch);
  }

  return vectors;
}

async function embedQuery(text) {
  const [vector] = await embedBatch([text]);
  return vector;
}

/** Cheap reachability probe used by GET /api/ask-pdf/health. */
async function pingOllama() {
  const { url } = rag.ollama;

  try {
    const response = await fetch(`${url}/api/tags`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return { ok: false, error: `HTTP ${response.status}` };
    const payload = await response.json();
    const names = (payload.models || []).map((entry) => entry.name);
    const model = rag.ollama.model;
    return {
      ok: names.includes(model) || names.includes(`${model}:latest`),
      url,
      model,
      pulled: names.filter((name) => name.startsWith(model.split(":")[0])).slice(0, 5),
      error: names.includes(model) ? undefined : `model ${model} is not pulled`,
    };
  } catch (error) {
    return { ok: false, url, error: error.message };
  }
}

module.exports = { embedTexts, embedQuery, pingOllama };
