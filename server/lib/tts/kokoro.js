/**
 * Kokoro-82M text-to-speech, loaded once per server process.
 *
 * `kokoro-js` is ESM-only while this server is CommonJS, so the module is
 * imported dynamically. The model (~90 MB at q8) is downloaded from the
 * Hugging Face Hub on first use and then cached on disk, so the first request
 * is slow and later ones are not.
 */

const { toSpeechPieces, toSpeechText } = require("./text");
const dotenv = require("dotenv");
dotenv.config();

const MODEL_ID =
  process.env.KOKORO_MODEL_ID || "onnx-community/Kokoro-82M-ONNX";
const DEFAULT_VOICE = process.env.KOKORO_VOICE || "af_bella";
const SAMPLE_RATE = 24000;

// The model window is 512 phoneme tokens (including the two special tokens its
// style vector is derived from), and `kokoro-js` tokenizes with
// `truncation: true`. Anything past the window is dropped without an error, so
// chunks must fit by token count — character count is not a proxy for it: 475
// characters of prose phonemize to ~587 tokens.
const MAX_TOKENS = 510;

const DTYPES = ["fp32", "fp16", "q8", "q4", "q4f16"];

function resolveDtype(value) {
  const dtype = (value || process.env.KOKORO_DTYPE || "q8").toLowerCase();
  return DTYPES.includes(dtype) ? dtype : "q8";
}

function positiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const config = {
  modelId: MODEL_ID,
  dtype: resolveDtype(),
  voice: DEFAULT_VOICE,
  // Phoneme tokens per chunk. Can be lowered, but never raised past the window.
  maxTokens: Math.min(positiveInt(process.env.KOKORO_MAX_TOKENS, MAX_TOKENS), MAX_TOKENS),
  // Sentences longer than this are split before the token packing happens.
  maxPieceChars: Math.min(
    positiveInt(process.env.KOKORO_MAX_PIECE_CHARS, 200),
    400,
  ),
  // Pause inserted between chunks so the joins do not sound clipped.
  gapSeconds: Number(process.env.KOKORO_GAP_SECONDS) || 0.15,
  maxTextChars: positiveInt(process.env.KOKORO_MAX_TEXT_CHARS, 20000),
  cacheDir: process.env.KOKORO_CACHE_DIR || undefined,
};

let modelPromise = null;
let model = null;
let loadError = null;

/** Serialize synthesis: ONNX CPU inference does not benefit from parallelism. */
let queue = Promise.resolve();

function withLock(task) {
  const run = queue.then(task, task);
  queue = run.catch(() => {});
  return run;
}

/**
 * Load (or reuse) the Kokoro model.
 *
 * @returns {Promise<any>}
 */
async function getModel() {
  if (model) return model;

  if (!modelPromise) {
    modelPromise = (async () => {
      const { KokoroTTS, env } = await import("kokoro-js");

      if (config.cacheDir) {
        env.cacheDir = config.cacheDir;
      }

      const instance = await KokoroTTS.from_pretrained(config.modelId, {
        dtype: config.dtype,
        device: "cpu",
      });

      model = instance;
      loadError = null;
      return instance;
    })().catch((error) => {
      // Let the next request retry instead of caching the failure forever.
      modelPromise = null;
      loadError = error;
      error.isModelLoadError = true;
      throw error;
    });
  }

  return modelPromise;
}

function isKnownVoice(tts, voice) {
  return Object.prototype.hasOwnProperty.call(tts.voices, voice);
}

/** `phonemizer` is ESM-only, like `kokoro-js`. */
let phonemizePromise = null;

function getPhonemize() {
  if (!phonemizePromise) {
    phonemizePromise = import("phonemizer")
      .then((mod) => mod.phonemize)
      .catch((error) => {
        phonemizePromise = null;
        throw error;
      });
  }
  return phonemizePromise;
}

/** Mirrors kokoro-js: the voice's first letter selects the phoneme language. */
function languageForVoice(voice) {
  return String(voice || "a").charAt(0) === "a" ? "en-us" : "en";
}

/**
 * Count the phoneme tokens Kokoro would feed the model for this text.
 *
 * @param {any} tts
 * @param {string} text
 * @param {string} language
 * @returns {Promise<number>}
 */
async function countTokens(tts, text, language) {
  const phonemize = await getPhonemize();
  const phones = (await phonemize(text, language)).join(" ").trim();
  if (!phones) return 0;

  const { input_ids } = tts.tokenizer(phones, { truncation: false });
  return input_ids.dims.at(-1);
}

/**
 * Break text until every piece fits the token window.
 *
 * @param {any} tts
 * @param {string} text
 * @param {string} language
 * @param {number} maxTokens
 * @returns {Promise<Array<{ text: string, tokens: number }>>}
 */
async function splitToFit(tts, text, language, maxTokens) {
  const tokens = await countTokens(tts, text, language);
  if (tokens <= maxTokens) return [{ text, tokens }];

  // Halve on a word boundary; a single unbroken "word" longer than the window
  // is sliced by characters as a last resort.
  const middle = Math.floor(text.length / 2);
  let cut = text.lastIndexOf(" ", middle);
  if (cut <= 0) cut = text.indexOf(" ", middle);
  if (cut <= 0) cut = middle;

  const head = text.slice(0, cut).trim();
  const tail = text.slice(cut).trim();
  if (!head || !tail) return [{ text, tokens }];

  return [
    ...(await splitToFit(tts, head, language, maxTokens)),
    ...(await splitToFit(tts, tail, language, maxTokens)),
  ];
}

/**
 * Group speech pieces into chunks that provably fit the model's token window.
 *
 * @param {any} tts
 * @param {string} text cleaned text
 * @param {{ voice: string, maxTokens: number, maxPieceChars: number }} options
 * @returns {Promise<string[]>}
 */
async function buildChunks(tts, text, { voice, maxTokens, maxPieceChars }) {
  const language = languageForVoice(voice);

  const atoms = [];
  for (const piece of toSpeechPieces(text, { maxPieceChars })) {
    atoms.push(...(await splitToFit(tts, piece, language, maxTokens)));
  }

  // Greedy packing on the measured sizes. The space between atoms can only
  // merge phonemes, never add tokens we did not count, so the sum is an upper
  // bound — but it is still verified below.
  const chunks = [];
  let current = null;

  for (const atom of atoms) {
    if (current && current.tokens + atom.tokens > maxTokens) {
      chunks.push(current.text);
      current = null;
    }

    current = current
      ? {
          text: `${current.text} ${atom.text}`,
          tokens: current.tokens + atom.tokens,
        }
      : { text: atom.text, tokens: atom.tokens };
  }

  if (current) chunks.push(current.text);

  const safe = [];
  for (const chunk of chunks) {
    if ((await countTokens(tts, chunk, language)) <= maxTokens) {
      safe.push(chunk);
      continue;
    }

    const parts = await splitToFit(tts, chunk, language, maxTokens);
    safe.push(...parts.map((part) => part.text));
  }

  return safe.map((chunk) => chunk.trim()).filter(Boolean);
}

/**
 * Describe the voices this model offers.
 *
 * @returns {Promise<Array<{id: string, name: string, language: string, gender: string}>>}
 */
async function listVoices() {
  const tts = await getModel();
  return Object.entries(tts.voices).map(([id, meta]) => ({
    id,
    name: meta.name,
    language: meta.language,
    gender: meta.gender,
  }));
}

function concatSamples(parts, gapSamples) {
  const total = parts.reduce(
    (sum, part) => sum + part.length,
    gapSamples * Math.max(parts.length - 1, 0),
  );

  const merged = new Float32Array(total);
  let offset = 0;

  parts.forEach((part, index) => {
    merged.set(part, offset);
    offset += part.length;
    if (index < parts.length - 1) offset += gapSamples;
  });

  return merged;
}

/**
 * Encode mono float samples as a 16-bit PCM WAV file.
 *
 * @param {Float32Array} samples
 * @param {number} sampleRate
 * @returns {Buffer}
 */
function encodeWav(samples, sampleRate) {
  const dataLength = samples.length * 2;
  const wav = Buffer.alloc(44 + dataLength);

  wav.write("RIFF", 0, "ascii");
  wav.writeUInt32LE(36 + dataLength, 4);
  wav.write("WAVE", 8, "ascii");
  wav.write("fmt ", 12, "ascii");
  wav.writeUInt32LE(16, 16); // PCM header size
  wav.writeUInt16LE(1, 20); // PCM format
  wav.writeUInt16LE(1, 22); // mono
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * 2, 28); // byte rate
  wav.writeUInt16LE(2, 32); // block align
  wav.writeUInt16LE(16, 34); // bits per sample
  wav.write("data", 36, "ascii");
  wav.writeUInt32LE(dataLength, 40);

  for (let i = 0; i < samples.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    wav.writeInt16LE(
      Math.round(sample < 0 ? sample * 0x8000 : sample * 0x7fff),
      44 + i * 2,
    );
  }

  return wav;
}

/**
 * Convert text to a single WAV buffer, chunking long input.
 *
 * @param {string} text
 * @param {{ voice?: string, speed?: number }} [options]
 * @returns {Promise<{
 *   wav: Buffer,
 *   voice: string,
 *   speed: number,
 *   chunks: string[],
 *   sampleRate: number,
 *   durationSeconds: number
 * }>}
 */
async function synthesize(text, { voice, speed = 1 } = {}) {
  const clean = toSpeechText(text);
  if (!clean) {
    throw Object.assign(new Error("No speakable text provided"), {
      statusCode: 400,
    });
  }

  if (clean.length > config.maxTextChars) {
    throw Object.assign(
      new Error(
        `Text is too long (${clean.length} characters). The limit is ${config.maxTextChars}.`,
      ),
      { statusCode: 413 },
    );
  }

  const tts = await getModel();
  const selectedVoice = voice || config.voice;

  if (!isKnownVoice(tts, selectedVoice)) {
    throw Object.assign(
      new Error(
        `Unknown voice "${selectedVoice}". Available voices: ${Object.keys(tts.voices).join(", ")}`,
      ),
      { statusCode: 400 },
    );
  }

  const chunks = await buildChunks(tts, clean, {
    voice: selectedVoice,
    maxTokens: config.maxTokens,
    maxPieceChars: config.maxPieceChars,
  });

  if (!chunks.length) {
    throw Object.assign(new Error("No speakable text provided"), {
      statusCode: 400,
    });
  }

  const parts = await withLock(async () => {
    const generated = [];
    for (const chunk of chunks) {
      const audio = await tts.generate(chunk, { voice: selectedVoice, speed });
      generated.push(audio.audio);
    }
    return generated;
  });

  const gapSamples = Math.round(config.gapSeconds * SAMPLE_RATE);
  const samples = concatSamples(parts, gapSamples);

  return {
    wav: encodeWav(samples, SAMPLE_RATE),
    voice: selectedVoice,
    speed,
    chunks,
    sampleRate: SAMPLE_RATE,
    durationSeconds: Number((samples.length / SAMPLE_RATE).toFixed(2)),
  };
}

/**
 * Cheap status for `/health` — never triggers a download.
 */
function getStatus() {
  return {
    modelId: config.modelId,
    dtype: config.dtype,
    defaultVoice: config.voice,
    maxTokensPerChunk: config.maxTokens,
    maxPieceChars: config.maxPieceChars,
    maxTextChars: config.maxTextChars,
    loaded: Boolean(model),
    loading: Boolean(modelPromise) && !model,
    lastError: loadError ? loadError.message : null,
  };
}

module.exports = {
  config,
  getModel,
  getStatus,
  listVoices,
  synthesize,
  encodeWav,
  buildChunks,
  countTokens,
  DTYPES,
  MAX_TOKENS,
};
