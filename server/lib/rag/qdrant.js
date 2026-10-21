const crypto = require("crypto");
const { QdrantClient } = require("@qdrant/js-client-rest");
const { rag, ConfigError, requireQdrant } = require("./config");

const DENSE = "dense";
const SPARSE = "bm25";
const DOC_FIELD = "documentId";

// Qdrant's built-in sparse encoder. Cloud runs the inference server-side, so
// nothing has to be tokenized locally.
const BM25_DOCUMENT = (text) => ({ text, model: "qdrant/bm25" });

let client = null;
let bootstrapped = null;

function getClient() {
  requireQdrant();

  if (!client) {
    client = new QdrantClient({
      url: rag.qdrant.url,
      apiKey: rag.qdrant.apiKey || undefined,
      timeout: rag.qdrant.timeoutMs,
      checkCompatibility: false,
    });
  }

  return client;
}

async function createCollection(name) {
  await getClient().createCollection(name, {
    vectors: {
      [DENSE]: { size: rag.ollama.dim, distance: "Cosine" },
    },
    sparse_vectors: {
      [SPARSE]: { modifier: "idf" },
    },
  });

  // documentId is filtered on every query, so it needs an index.
  await getClient().createPayloadIndex(name, {
    field_name: DOC_FIELD,
    field_schema: "keyword",
    wait: true,
  });
}

/**
 * Creates the collection on first use. Cached so concurrent uploads don't all
 * try to create it at once.
 */
function ensureCollection() {
  if (bootstrapped) return bootstrapped;

  bootstrapped = (async () => {
    const { collection } = rag.qdrant;
    const api = getClient();

    try {
      const { collections } = await api.getCollections();
      const exists = (collections || []).some((entry) => entry.name === collection);

      if (exists) {
        const info = await api.getCollection(collection);
        const size = info?.config?.params?.vectors?.[DENSE]?.size;

        if (size && size !== rag.ollama.dim) {
          throw new ConfigError(
            `Qdrant collection "${collection}" stores ${size}-dim vectors but EMBEDDING_DIM is ${rag.ollama.dim}. ` +
              "Point QDRANT_COLLECTION at a new collection or fix EMBEDDING_DIM."
          );
        }

        const sparse = info?.config?.params?.sparse_vectors || {};
        if (!sparse[SPARSE]) {
          throw new ConfigError(
            `Qdrant collection "${collection}" has no "${SPARSE}" sparse vector, so keyword search cannot run. ` +
              "Delete the collection (or use a new QDRANT_COLLECTION) and let the server recreate it."
          );
        }

        return collection;
      }

      await createCollection(collection);
      return collection;
    } catch (error) {
      if (error instanceof ConfigError) throw error;

      // Another worker may have won the race; treat "already exists" as fine.
      if (/already exists|already_exists|409/i.test(error.message || "")) {
        return collection;
      }

      throw new ConfigError(
        `Qdrant is not usable (${error.message}). Check QDRANT_URL / QDRANT_API_KEY.`
      );
    }
  })();

  // A failed bootstrap must be retried on the next request.
  bootstrapped.catch(() => {
    bootstrapped = null;
  });

  return bootstrapped;
}

function documentFilter(documentId) {
  return { must: [{ key: DOC_FIELD, match: { value: documentId } }] };
}

/**
 * Upserts one PDF's chunks. Dense vectors come from Ollama; the sparse BM25
 * vector is produced by Qdrant from the same chunk text.
 */
async function upsertChunks({ documentId, filename, chunks, denseVectors }) {
  const collection = await ensureCollection();
  const api = getClient();
  const points = chunks.map((chunk, index) => ({
    id: crypto.randomUUID(),
    vector: {
      [DENSE]: denseVectors[index],
      [SPARSE]: BM25_DOCUMENT(chunk.text),
    },
    payload: {
      [DOC_FIELD]: documentId,
      filename,
      page: chunk.page,
      chunkIndex: chunk.chunkIndex,
      text: chunk.text,
    },
  }));

  const size = 64;
  for (let index = 0; index < points.length; index += size) {
    await api.upsert(collection, {
      points: points.slice(index, index + size),
      wait: true,
    });
  }

  return points.length;
}

/**
 * Dense + sparse retrieval fused with Reciprocal Rank Fusion, scoped to a
 * single document. RRF means the two result lists never need comparable
 * scores — Qdrant ranks them, we only take the fused order.
 */
async function hybridSearch({ documentId, queryText, queryVector, limit }) {
  const collection = await ensureCollection();
  const filter = documentFilter(documentId);

  const response = await getClient().query(collection, {
    prefetch: [
      {
        query: queryVector,
        using: DENSE,
        limit,
        filter,
      },
      {
        query: BM25_DOCUMENT(queryText),
        using: SPARSE,
        limit,
        filter,
      },
    ],
    query: { fusion: "rrf" },
    limit,
    with_payload: true,
    filter,
  });

  return (response.points || []).map((point) => ({
    id: point.id,
    score: point.score,
    page: point.payload?.page,
    chunkIndex: point.payload?.chunkIndex,
    text: point.payload?.text || "",
  }));
}

async function deleteDocument(documentId) {
  const collection = await ensureCollection();
  await getClient().delete(collection, {
    filter: documentFilter(documentId),
    wait: true,
  });
}

async function pingQdrant() {
  if (!rag.qdrant.url) return { ok: false, error: "QDRANT_URL is not set" };

  try {
    const api = getClient();
    const { collections } = await api.getCollections();
    return {
      ok: true,
      url: rag.qdrant.url,
      collection: rag.qdrant.collection,
      exists: (collections || []).some((entry) => entry.name === rag.qdrant.collection),
    };
  } catch (error) {
    return { ok: false, url: rag.qdrant.url, error: error.message };
  }
}

module.exports = {
  DENSE,
  SPARSE,
  ensureCollection,
  upsertChunks,
  hybridSearch,
  deleteDocument,
  pingQdrant,
};
