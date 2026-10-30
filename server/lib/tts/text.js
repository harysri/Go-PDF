/**
 * Text preparation for Kokoro TTS.
 *
 * The model is a StyleTTS2 checkpoint with a hard 512-*token* window, and its
 * `generate()` tokenizes with `truncation: true`, so long text does not error —
 * it silently loses the tail. Tokens are phonemes, not characters, so this
 * module only prepares text: Markdown is stripped and sentences are broken into
 * small pieces. Grouping those pieces into chunks has to be done against the
 * model's tokenizer (see `kokoro.js`), because a 475-character sentence can
 * phonemize to 587 tokens and be cut.
 */

// Pieces are deliberately small so the token-aware packer in `kokoro.js` can
// fill a chunk without ever splitting a sentence it did not have to.
const DEFAULT_MAX_PIECE_CHARS = 200;

// A chunk that only contains punctuation or emoji has nothing to phonemize.
const SPEAKABLE_RE = /[\p{L}\p{N}]/u;

/**
 * Turn Markdown prose into something worth hearing.
 *
 * @param {string} raw
 * @returns {string}
 */
function toSpeechText(raw) {
  if (typeof raw !== "string") return "";

  let text = raw.replace(/\r\n?/g, "\n");

  // Fenced code blocks and inline HTML carry symbols that would be spelled out.
  text = text.replace(/```[\s\S]*?```/g, " ");
  text = text.replace(/~~~[\s\S]*?~~~/g, " ");
  text = text.replace(/<[^>]+>/g, " ");

  // Links and images: keep the readable label, drop the URL.
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
  text = text.replace(/<https?:\/\/[^>]+>/g, " ");

  // Block-level markers.
  text = text.replace(/^[ \t]{0,3}#{1,6}[ \t]*/gm, "");
  text = text.replace(/^[ \t]{0,3}>[ \t]?/gm, "");
  text = text.replace(/^[ \t]{0,3}(?:[-*_])(?:[ \t]*[-*_]){2,}[ \t]*$/gm, " ");
  text = text.replace(/^[ \t]{0,3}(?:[-*+]|\d{1,3}[.)])[ \t]+/gm, "");
  text = text.replace(/^[ \t]*\|?[\s:|-]{3,}\|?[ \t]*$/gm, " ");

  // Inline emphasis, code spans and strikethrough.
  text = text.replace(/`+/g, "");
  text = text.replace(/(\*\*|__)([\s\S]*?)\1/g, "$2");
  text = text.replace(/(\*|_)([\s\S]*?)\1/g, "$2");
  text = text.replace(/~~([\s\S]*?)~~/g, "$1");

  // Table pipes and bullets become short pauses; clean up the punctuation
  // that leaves behind ("Value ,. , Accuracy").
  text = text.replace(/\|/g, ", ");
  text = text.replace(/[•●▪◦]/g, ", ");
  text = text.replace(/(?:\s*,\s*){2,}/g, ", ");
  text = text.replace(/\s*,\s*(?=[.!?…]|$)/g, "");

  // Give every line terminal punctuation so the sentence splitter keeps
  // headings and list items as separate, natural pauses.
  text = text
    .split("\n")
    .map((line) =>
      line
        .trim()
        .replace(/^[\s,;:]+/, "")
        .replace(/\s+,/g, ",")
        .replace(/\s*,\s*(?=[.!?…]|$)/g, "")
    )
    .filter(Boolean)
    .map((line) => (/[.!?…:;]$/.test(line) ? line : `${line}.`))
    .join(" ");

  return text.replace(/\s+/g, " ").trim();
}

/**
 * Greedily pack pieces into groups of at most `maxChars`.
 *
 * @param {string[]} pieces
 * @param {number} maxChars
 * @returns {string[]}
 */
function packPieces(pieces, maxChars) {
  const packed = [];
  let current = "";

  for (const piece of pieces) {
    const candidate = current ? `${current} ${piece}` : piece;

    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }

    if (current) packed.push(current);
    current = piece;
  }

  if (current) packed.push(current);
  return packed;
}

/**
 * Break a single sentence that is longer than the budget, preferring clause
 * boundaries, then words, and only slicing mid-word as a last resort.
 *
 * @param {string} text
 * @param {number} maxChars
 * @returns {string[]}
 */
function splitOversized(text, maxChars) {
  if (text.length <= maxChars) return [text];

  const clauses = text.split(/(?<=[,;:—–])\s+/);
  const pieces = [];

  for (const clause of clauses) {
    if (clause.length <= maxChars) {
      pieces.push(clause);
      continue;
    }

    for (const word of clause.split(/\s+/)) {
      if (word.length <= maxChars) {
        pieces.push(word);
        continue;
      }

      // A 600-character "word" (URL, base64 blob) still has to be spoken.
      for (let i = 0; i < word.length; i += maxChars) {
        pieces.push(word.slice(i, i + maxChars));
      }
    }
  }

  return packPieces(pieces, maxChars);
}

/**
 * Turn raw Markdown (or plain text) into speech-ready pieces: sentences, with
 * any sentence longer than `maxPieceChars` split at clause or word boundaries.
 *
 * Order is preserved and nothing is dropped, so the caller can concatenate the
 * result back into the original text.
 *
 * @param {string} raw
 * @param {{ maxPieceChars?: number }} [options]
 * @returns {string[]}
 */
function toSpeechPieces(raw, { maxPieceChars = DEFAULT_MAX_PIECE_CHARS } = {}) {
  const limit = Number.isFinite(maxPieceChars) && maxPieceChars > 0
    ? Math.floor(maxPieceChars)
    : DEFAULT_MAX_PIECE_CHARS;

  const text = toSpeechText(raw);
  if (!text) return [];

  const sentences = text.split(/(?<=[.!?…])\s+/).filter(Boolean);
  const pieces = [];

  for (const sentence of sentences) {
    pieces.push(...splitOversized(sentence, limit));
  }

  return pieces.filter((piece) => SPEAKABLE_RE.test(piece));
}

module.exports = { toSpeechPieces, toSpeechText, DEFAULT_MAX_PIECE_CHARS };
