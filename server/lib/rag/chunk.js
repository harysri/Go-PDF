const { rag } = require("./config");

/**
 * pdf-parse@1.1.1 bundles pdf.js 1.10, which rejects a lot of modern PDFs
 * ("Unknown compression method in flate stream"). pdfjs-dist ships a current
 * build and exposes per-page text, which is what citations need.
 */
let pdfjsPromise = null;
const loadPdfjs = () => {
  if (!pdfjsPromise) pdfjsPromise = import("pdfjs-dist/legacy/build/pdf.mjs");
  return pdfjsPromise;
};

const clean = (text) =>
  text
    .replace(/\u00ad/g, "")
    .replace(/\r\n?/g, "\n")
    // "informa-\ntion" -> "information" (only real lowercase compounds)
    .replace(/([A-Za-z])-\n\s*([a-z])/g, "$1$2")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

/** Rebuilds readable lines from pdf.js text items (each item is a run, not a line). */
function contentToText(content) {
  let text = "";
  let lastY;

  for (const item of content.items || []) {
    if (typeof item.str !== "string" || item.str.length === 0) continue;

    const y = item.transform ? item.transform[5] : undefined;
    const newLine = lastY !== undefined && y !== undefined && Math.abs(y - lastY) >= 0.5;

    if (newLine) text += "\n";
    text += item.str;
    if (item.hasEOL) text += "\n";

    lastY = y;
  }

  return text;
}

/**
 * @returns {Promise<{ pages: {page: number, text: string}[], numPages: number }>}
 */
async function extractPages(buffer) {
  const pdfjs = await loadPdfjs();

  let doc;
  try {
    doc = await pdfjs.getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      // No rendering happens here, so keep pdf.js from evaluating embedded JS.
      isEvalSupported: false,
      disableFontFace: true,
    }).promise;
  } catch (error) {
    if (error?.name === "PasswordException") {
      const passwordError = new Error("This PDF is password-protected and cannot be indexed.");
      passwordError.statusCode = 422;
      throw passwordError;
    }

    const invalid = new Error(`Could not read this PDF: ${error.message}`);
    invalid.statusCode = 422;
    throw invalid;
  }

  try {
    const pages = [];

    for (let number = 1; number <= doc.numPages; number += 1) {
      const page = await doc.getPage(number);
      const content = await page.getTextContent();
      const text = clean(contentToText(content));
      if (text.length > 0) pages.push({ page: number, text });
      page.cleanup();
    }

    return { numPages: doc.numPages, pages };
  } finally {
    await doc.destroy().catch(() => {});
  }
}

// Tried in priority order so a cut never lands mid-sentence if avoidable.
const BOUNDARIES = ["\n\n", ". ", "! ", "? ", ".\n", "\n", "; ", ", ", " "];

function findCut(text, idealEnd, minEnd) {
  for (const marker of BOUNDARIES) {
    const at = text.lastIndexOf(marker, idealEnd);
    if (at >= minEnd) return at + marker.length;
  }
  return idealEnd;
}

/**
 * Splits one page into overlapping windows. Chunks never span pages, so the
 * page number attached to a chunk is always exact.
 */
function chunkPage(text, { page, size, overlap, minChars }) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(start + size, text.length);

    if (end < text.length) {
      const minEnd = start + Math.floor(size * 0.6);
      end = Math.min(findCut(text, end, minEnd), text.length);
    }

    const body = text.slice(start, end).trim();
    if (body.length >= minChars) {
      chunks.push({ page, text: body });
    }

    if (end >= text.length) break;

    let next = Math.max(end - overlap, start + 1);
    // Don't start a chunk in the middle of a word.
    while (next < text.length && next > 0 && /\S/.test(text[next - 1]) && /\S/.test(text[next])) {
      next += 1;
    }
    start = next;
  }

  return chunks;
}

/**
 * @param {{page: number, text: string}[]} pages
 * @returns {{chunkIndex: number, page: number, text: string}[]}
 */
function chunkPages(pages, options = rag.chunk) {
  const chunks = [];

  for (const { page, text } of pages) {
    for (const chunk of chunkPage(text, { page, ...options })) {
      chunks.push({ chunkIndex: chunks.length, ...chunk });
      if (chunks.length >= options.maxChunks) return chunks;
    }
  }

  return chunks;
}

module.exports = { extractPages, chunkPages, clean };
