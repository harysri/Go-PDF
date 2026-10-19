"use strict";

require("dotenv").config();
const pdfParse = require("pdf-parse");
const { CohereClient } = require("cohere-ai");

// ---------------------------------------------------------------------------
// Models: the cheap 8B model does the bulk extraction (map stage), the larger
// model only ever sees already-compressed summaries (mid + final reduce).
// ---------------------------------------------------------------------------
const MAP_MODEL = "command-r7b-12-2024";
const REDUCE_MODEL = "command-a-03-2025";

const MAP_CONCURRENCY = 3;
const REDUCE_CONCURRENCY = 2;

// Cohere trial keys allow 20 calls/minute. Throttle below that so a long
// document finishes instead of failing halfway through with a 429.
const CALLS_PER_MINUTE =
  Number(process.env.COHERE_MAX_CALLS_PER_MINUTE) > 0
    ? Number(process.env.COHERE_MAX_CALLS_PER_MINUTE)
    : 18;
const CALL_WINDOW_MS = 60_000;

// Sizes are in characters; English text is roughly 4 chars per token.
const CHUNK_TARGET_CHARS = 4000; // ~1000 tokens per map call
const CHUNK_MAX_CHARS = 4800; // hard cap, ~1200 tokens
const MIN_CHUNK_CHARS = 250; // below this a chunk is merged into its neighbour
const PARAGRAPH_MAX_CHARS = 1400;
const REDUCE_BUDGET_CHARS = 6000; // notes above this get a mid-level reduce
const REDUCE_BUDGET_NOTES = 8; // ...or this many map notes
const MID_BATCH_CHARS = 9000; // source material per mid-level reduce call

const LENGTH_PRESETS = {
  short: {
    maxSections: 4,
    pointsPerSection: 3,
    overviewWords: 45,
    takeaways: 3,
    maxTokens: 900,
  },
  medium: {
    maxSections: 7,
    pointsPerSection: 4,
    overviewWords: 70,
    takeaways: 4,
    maxTokens: 1400,
  },
  detailed: {
    maxSections: 12,
    pointsPerSection: 6,
    overviewWords: 110,
    takeaways: 6,
    maxTokens: 2400,
  },
};

const SKIP_SECTIONS = {
  "table of contents": 2500,
  contents: 2500,
  references: Infinity,
  bibliography: Infinity,
  "works cited": Infinity,
  "literature cited": Infinity,
};

const HEADING_KEYWORDS =
  /^(abstract|introduction|background|related work|methodology|methods|materials and methods|results|findings|discussion|conclusions?|future work|limitations|acknowledge?ments|appendix|executive summary|summary|overview|table of contents|contents)$/i;

// ---------------------------------------------------------------------------
// Schemas. Cohere validates the model output against these, so every stage is
// guaranteed parseable JSON with the fields the next stage expects.
// ---------------------------------------------------------------------------
const MAP_SCHEMA = {
  type: "object",
  properties: {
    points: { type: "array", items: { type: "string" } },
  },
  required: ["points"],
};

const MID_SCHEMA = {
  type: "object",
  properties: {
    themes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          pages: { type: "string" },
          points: { type: "array", items: { type: "string" } },
        },
        required: ["title", "pages", "points"],
      },
    },
  },
  required: ["themes"],
};

const FINAL_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    overview: { type: "string" },
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          pages: { type: "string" },
          points: { type: "array", items: { type: "string" } },
        },
        required: ["heading", "pages", "points"],
      },
    },
    takeaways: { type: "array", items: { type: "string" } },
  },
  required: ["title", "overview", "sections", "takeaways"],
};

const MAP_PREAMBLE = `You extract factual notes from document sections for a larger summary.
Return JSON only, matching the schema exactly.
Rules:
- Use only what the text states. Never add outside knowledge or opinions.
- Preserve numbers, dates, names, units and technical terms exactly as written.
- Copy figures into the points instead of generalising them away (write "78 percent", "4.2 million USD", "48 staff").
- Each point is one self-contained sentence of at most 25 words.
- Never repeat the section title or page label as a point.
- Skip running headers, footers and reference-only lines.`;

const MID_PREAMBLE = `You merge section notes from one long document.
Return JSON only, matching the schema exactly.
Rules:
- Combine notes that describe the same topic; do not drop a topic to save space.
- Keep the exact page ranges given in the source; never invent page numbers.
- Each point is one self-contained sentence of at most 20 words.
- Preserve numbers, dates, names and units exactly.`;

const FINAL_PREAMBLE = `You write the final summary of a document from section notes.
Return JSON only, matching the schema exactly.
Rules:
- Use only the supplied notes. Never invent facts, figures or page numbers.
- Cite each section's page range exactly as given in the notes.
- Keep every figure that appears in the notes: amounts, percentages, dates and counts.
- Group by topic, not by page order.
- No preamble, no markdown, no commentary outside the JSON fields.
- Every point must be a complete, factual sentence.`;

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

// ---------------------------------------------------------------------------
// PDF -> pages -> cleaned lines -> blocks -> chunks
// ---------------------------------------------------------------------------

// Mirrors pdf-parse's default renderer: same-y text items are joined, new lines
// start at a new Y. A form feed is appended so page boundaries stay known.
async function renderPage(pageData) {
  const textContent = await pageData.getTextContent({
    normalizeWhitespace: false,
    disableCombineTextItems: false,
  });

  let lastY;
  let text = "";
  for (const item of textContent.items) {
    if (lastY === item.transform[5] || !lastY) {
      text += item.str;
    } else {
      text += "\n" + item.str;
    }
    lastY = item.transform[5];
  }
  return text;
}

/**
 * Extract per-page text so every chunk can carry a real page reference.
 * @returns {Promise<{pages: string[], numpages: number}>}
 */
async function extractPages(buffer) {
  const data = await pdfParse(buffer, {
    pagerender: async (pageData) => `${await renderPage(pageData)}\f`,
  });

  const raw = data.text.split("\f");
  const pages = [];
  for (let i = 0; i < data.numpages; i += 1) {
    pages.push(raw[i] || "");
  }

  return { pages, numpages: data.numpages };
}

const normalizeText = (value) =>
  value
    .replace(/\u00ad/g, "") // soft hyphen
    .replace(/\ufb01/g, "fi")
    .replace(/\ufb02/g, "fl")
    .replace(/\u00a0/g, " ");

const lineSignature = (line) =>
  line
    .toLowerCase()
    .replace(/\d+/g, "#")
    .replace(/[^a-z#]+/g, " ")
    .trim();

const isPageFurniture = (line) => {
  const t = line.trim();
  if (!t) return true;
  if (/^(?:page\s*)?\d{1,4}(?:\s*(?:of|\/)\s*\d{1,4})?$/i.test(t)) return true;
  if (/^[ivxlcdm]{1,5}$/i.test(t)) return true; // roman page number
  if (/(?:\.{3,}|…{2,}|·{3,})\s*\d{1,4}$/.test(t)) return true; // TOC dot leader
  if (/^[-–—_=*·•\s]+$/.test(t)) return true; // separator rule
  return false;
};

/**
 * Drop running headers/footers, page numbers, TOC leaders and repeated
 * boilerplate. Pure noise removal: it reduces tokens without losing content.
 */
function cleanPages(pages) {
  const pageLines = pages.map((page) =>
    normalizeText(page)
      .split(/\r?\n/)
      .map((line) => line.replace(/\s+$/, "").replace(/^\s+/, ""))
  );

  // Only margin lines (first/last three non-empty lines of a page) can be
  // running headers or footers. Counting every line would also flag section
  // headings that legitimately repeat across pages.
  const marginIndices = pageLines.map((lines) => {
    const nonEmpty = [];
    lines.forEach((line, index) => {
      if (line) nonEmpty.push(index);
    });

    const margin = new Set(nonEmpty.slice(0, 3));
    for (const index of nonEmpty.slice(-3)) margin.add(index);
    return margin;
  });

  const occurrence = new Map();
  pageLines.forEach((lines, pageIndex) => {
    const seen = new Set();
    lines.forEach((line, index) => {
      if (!line || line.length > 120) return;
      if (!marginIndices[pageIndex].has(index)) return;
      if (isProtectedHeading(line)) return;

      const signature = lineSignature(line);
      if (!signature || signature.length < 4 || seen.has(signature)) return;
      seen.add(signature);
      occurrence.set(signature, (occurrence.get(signature) || 0) + 1);
    });
  });

  // A margin line on >=30% of pages (and at least 3 pages) is boilerplate.
  const repeatThreshold = Math.max(3, Math.ceil(pages.length * 0.3));
  const boilerplate = new Set();
  for (const [signature, count] of occurrence) {
    if (count >= repeatThreshold) boilerplate.add(signature);
  }

  // One pass, so `index` still matches the margin indices computed above.
  return pageLines.map((lines, pageIndex) =>
    lines.filter((line, index) => {
      if (isPageFurniture(line)) return false;
      if (
        marginIndices[pageIndex].has(index) &&
        boilerplate.has(lineSignature(line))
      ) {
        return false;
      }
      return true;
    })
  );
}

const isHeading = (line) => {
  const t = line.trim();
  if (!t || t.length > 90) return false;

  if (HEADING_KEYWORDS.test(bareHeading(t))) return true;

  if (
    /^(chapter|section|part|appendix|annex)\s+([0-9]+|[ivxlc]+|[a-z])\b/i.test(
      t
    ) &&
    t.length <= 90
  ) {
    return true;
  }

  // "2.3 Evaluation Setup" / "4) Results"
  if (/^\d+(?:\.\d+)*[.)]?\s+[A-Z(]/.test(t) && !/[.;:]$/.test(t)) return true;

  // Short Title Case or ALL CAPS line: headings in unnumbered documents.
  const words = t.split(/\s+/);
  if (words.length >= 2 && words.length <= 10 && !/[.;:,]$/.test(t)) {
    const capitalized = words.filter((word) =>
      /^[A-Z0-9][\w'’()-]*$/.test(word)
    ).length;
    if (capitalized / words.length >= 0.75 && /^[A-Z0-9]/.test(t)) return true;
  }

  return false;
};

const cleanHeading = (line) =>
  line.replace(/\s+/g, " ").replace(/:$/, "").trim();

// "4. References" and "References:" both map to the skip list.
const bareHeading = (line) =>
  cleanHeading(line)
    .replace(/^[\d.\s]+/, "")
    .replace(/^(?:chapter|section|part|appendix|annex)\s+\S+\s+/i, "")
    .trim()
    .toLowerCase();

// Numbered headings and named sections survive boilerplate detection: they
// carry the structure the chunker needs. A running header is usually just the
// document title, which none of these patterns match, so it is still removed.
const isProtectedHeading = (line) =>
  /^\d+(?:\.\d+)*[.)]?\s+\S/.test(line.trim()) ||
  HEADING_KEYWORDS.test(bareHeading(line)) ||
  /^(?:chapter|section|part|appendix|annex)\s+/i.test(line.trim());

/**
 * Group cleaned lines into heading/paragraph blocks with a page and the section
 * each block belongs to.
 */
function buildBlocks(pageLines) {
  const blocks = [];
  let section = "Document";
  let skipSection = null;
  let skipRemaining = 0;

  for (let pageIndex = 0; pageIndex < pageLines.length; pageIndex += 1) {
    const page = pageIndex + 1;
    const lines = pageLines[pageIndex];
    let paragraph = [];
    let paragraphPage = page;

    const flushParagraph = () => {
      if (paragraph.length === 0) return;
      const text = paragraph.join(" ").replace(/\s+/g, " ").trim();
      paragraph = [];
      if (text.length < 20) return;
      if (skipRemaining > 0) {
        skipRemaining -= text.length;
        if (skipRemaining <= 0) {
          // Budget for this skipped section is used up: resume normal flow.
          skipRemaining = 0;
          skipSection = null;
        }
        return;
      }
      blocks.push({ type: "paragraph", text, page: paragraphPage, section });
    };

    for (const line of lines) {
      if (!line) {
        flushParagraph();
        continue;
      }

      if (isHeading(line)) {
        flushParagraph();
        const heading = cleanHeading(line);
        const skipKey = bareHeading(heading);
        const skipLimit = SKIP_SECTIONS[skipKey];

        if (skipLimit !== undefined) {
          skipSection = skipKey;
          skipRemaining = skipLimit;
          continue;
        }

        if (skipSection) {
          skipSection = null;
          skipRemaining = 0;
        }

        section = heading;
        blocks.push({ type: "heading", text: heading, page, section });
        continue;
      }

      if (paragraph.length === 0) paragraphPage = page;

      // Join hyphenated line breaks: "summa-\nrization" -> "summarization".
      const previous = paragraph[paragraph.length - 1];
      if (previous && /[a-z]-$/.test(previous) && /^[a-z]/.test(line)) {
        paragraph[paragraph.length - 1] = previous.slice(0, -1) + line;
      } else {
        paragraph.push(line);
      }

      if (paragraph.join(" ").length >= PARAGRAPH_MAX_CHARS) flushParagraph();
    }

    flushParagraph();
  }

  return blocks;
}

const estimateTokens = (text) => Math.ceil(text.length / 4);

const formatPageRange = (start, end) =>
  start === end ? String(start) : `${start}-${end}`;

/**
 * Pack blocks into ~1000-token chunks. Chunks break on section headings where
 * possible, never split a paragraph, and always carry page + section metadata.
 */
function chunkBlocks(blocks) {
  const chunks = [];
  let current = null;

  const start = (block) => {
    current = {
      text: "",
      sections: [],
      firstPage: block.page,
      lastPage: block.page,
    };
    addSection(block.section || "Document");
  };

  const addSection = (name) => {
    if (name && !current.sections.includes(name)) current.sections.push(name);
  };

  const append = (text, page) => {
    current.text += current.text ? `\n${text}` : text;
    if (page > current.lastPage) current.lastPage = page;
    if (page < current.firstPage) current.firstPage = page;
  };

  const flush = () => {
    if (!current) return;
    const text = current.text.trim();
    const section = current.sections.join(" / ") || "Document";
    if (text.length >= MIN_CHUNK_CHARS) {
      chunks.push({
        text,
        section,
        pages: [current.firstPage, current.lastPage],
      });
    } else if (
      chunks.length > 0 &&
      chunks[chunks.length - 1].text.length + text.length <=
        CHUNK_MAX_CHARS
    ) {
      // Too small to be worth a call: fold it into the previous chunk.
      const previous = chunks[chunks.length - 1];
      previous.text += `\n${text}`;
      previous.pages[1] = Math.max(previous.pages[1], current.lastPage);
    } else if (text.length > 0) {
      chunks.push({
        text,
        section,
        pages: [current.firstPage, current.lastPage],
      });
    }
    current = null;
  };

  for (const block of blocks) {
    if (block.type === "heading") {
      if (current && current.text.length >= CHUNK_TARGET_CHARS * 0.35) {
        flush();
      }
      if (!current) start(block);
      addSection(block.section || block.text);
      append(block.text, block.page);
      continue;
    }

    if (!current) start(block);

    if (
      current.text.length >= CHUNK_MAX_CHARS ||
      current.text.length + block.text.length + 1 > CHUNK_MAX_CHARS
    ) {
      flush();
      start(block);
    }

    append(block.text, block.page);
  }

  flush();
  return chunks;
}

// ---------------------------------------------------------------------------
// LLM stages
// ---------------------------------------------------------------------------

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let callWindow = [];

/** Wait until this process may start another Cohere call. */
async function waitForCallSlot() {
  for (;;) {
    const now = Date.now();
    callWindow = callWindow.filter((time) => now - time < CALL_WINDOW_MS);

    if (callWindow.length < CALLS_PER_MINUTE) {
      callWindow.push(now);
      return;
    }

    const waitMs = CALL_WINDOW_MS - (now - callWindow[0]) + 250;
    await sleep(Math.min(Math.max(waitMs, 250), 10_000));
  }
}

const isRetryable = (error) =>
  !error.statusCode || error.statusCode === 429 || error.statusCode >= 500;

const isRateLimited = (error) => error?.statusCode === 429;

async function chatJson({ model, preamble, message, schema, maxTokens, stats }) {
  if (!process.env.COHERE_API_KEY) {
    throw new Error("COHERE_API_KEY is not configured on the server");
  }

  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      await waitForCallSlot();

      // Cap each call so a stalled request cannot hang the whole job.
      const response = await cohere.chat(
        {
          model,
          preamble,
          message,
          temperature: 0.2,
          maxTokens,
          responseFormat: { type: "json_object", schema },
        },
        { timeoutInSeconds: 90, maxRetries: 0 }
      );

      stats.calls += 1;
      const usage = response.meta?.billedUnits || response.meta?.tokens || {};
      stats.inputTokens += usage.inputTokens || 0;
      stats.outputTokens += usage.outputTokens || 0;

      try {
        return JSON.parse(response.text);
      } catch {
        lastError = new Error("model returned invalid JSON");
      }
    } catch (error) {
      lastError = error;
      if (!isRetryable(error)) break;
    }

    // 429s are the common case here; wait long enough for the per-minute
    // window to roll over before trying again.
    const backoff = isRateLimited(lastError)
      ? 20_000
      : Math.min(2000 * 2 ** attempt, 15_000);
    await sleep(backoff);
  }

  throw new Error(`LLM stage failed (${model}): ${lastError?.message}`);
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;

  const run = async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, run)
  );
  return results;
}

const mapPrompt = (chunk, maxPoints) =>
  `SECTION: ${chunk.section}\nPAGES: ${formatPageRange(
    chunk.pages[0],
    chunk.pages[1]
  )}\n\nExtract up to ${maxPoints} key points from this section.\n\n"""\n${
    chunk.text
  }\n"""`;

const itemBlock = (item) =>
  `### ${item.section} (pages ${item.pages})\n${item.points
    .map((point) => `- ${point}`)
    .join("\n")}`;

const serializeItems = (items) => items.map(itemBlock).join("\n\n");

const batchByChars = (items, maxChars) => {
  const batches = [];
  let batch = [];
  let length = 0;

  for (const item of items) {
    const size = itemBlock(item).length;
    if (batch.length > 0 && length + size > maxChars) {
      batches.push(batch);
      batch = [];
      length = 0;
    }
    batch.push(item);
    length += size;
  }

  if (batch.length > 0) batches.push(batch);
  return batches;
};

/**
 * Reduce any page reference the model returns ("pp. 3-5", "2,3,4", "p. 11")
 * to the compact "3-5" / "11" form, so labels stay short and parseable.
 */
const normalizePages = (value, fallback) => {
  const numbers = String(value || "").match(/\d+/g);
  if (!numbers || numbers.length === 0) return fallback || "";

  const parsed = numbers.map(Number);
  const min = Math.min(...parsed);
  const max = Math.max(...parsed);
  return min === max ? String(min) : `${min}-${max}`;
};

/**
 * Extractive safety net for the map stage: small models paraphrase figures
 * away, so sentences that carry numbers are appended verbatim.
 */
// Naive sentence splitting breaks decimals ("4.2") into two sentences, which
// would copy fragments like "The budget was approved at 4." into the notes.
const splitSentences = (text) =>
  text
    .replace(/(\d)\.(\d)/g, "$1\u0000$2")
    // Split on sentence ends and on line breaks, so a heading is never glued
    // onto the paragraph that follows it.
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.replace(/\u0000/g, "."));

const keyFigurePoints = (text, alreadyCovered = new Set(), limit = null) => {
  const numberPattern = /\d+(?:\.\d+)?/g;
  const candidates = splitSentences(text)
    .map((sentence) => sentence.replace(/\s+/g, " ").trim())
    .filter(
      (sentence) =>
        sentence.length >= 25 &&
        sentence.length <= 240 &&
        /\d/.test(sentence)
    )
    .map((sentence) => ({
      sentence,
      numbers: sentence.match(numberPattern) || [],
    }));

  // Verbatim figure-bearing sentences per chunk: enough that unique counts and
  // percentages survive the map stage, small enough to stay cheap.
  const cap = text.length > 1500 ? 12 : 6;
  const target = limit ?? Math.min(cap, candidates.length);

  // Greedy cover: each slot goes to the sentence carrying the most numbers
  // the model has not mentioned yet, so unique counts are not crowded out.
  const covered = new Set(alreadyCovered);
  const chosen = [];

  while (chosen.length < target) {
    let best = null;
    let bestScore = 0;

    for (const candidate of candidates) {
      if (chosen.includes(candidate)) continue;
      const score = candidate.numbers.filter(
        (number) => !covered.has(number)
      ).length;
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }

    if (!best) break;
    chosen.push(best);
    for (const number of best.numbers) covered.add(number);
  }

  return chosen.map((item) => item.sentence);
};

async function mapChunks(chunks, stats) {
  return mapLimit(chunks, MAP_CONCURRENCY, async (chunk) => {
    // One point per ~125 words keeps the map stage lossless enough for the
    // final summary without letting a single chunk flood the notes.
    const maxPoints = Math.max(
      3,
      Math.min(6, Math.round(chunk.text.length / 500))
    );

    const result = await chatJson({
      model: MAP_MODEL,
      preamble: MAP_PREAMBLE,
      message: mapPrompt(chunk, maxPoints),
      schema: MAP_SCHEMA,
      maxTokens: 400,
      stats,
    });

    const points = Array.isArray(result.points)
      ? result.points.map((point) => String(point).trim()).filter(Boolean)
      : [];

    if (points.length === 0) return null;

    const coveredNumbers = new Set(
      points.join(" ").match(/\d+(?:\.\d+)?/g) || []
    );
    const figurePoints = keyFigurePoints(chunk.text, coveredNumbers);

    return {
      section: chunk.section,
      pages: formatPageRange(chunk.pages[0], chunk.pages[1]),
      // Model points plus the verbatim figure sentences. Slicing this list to
      // maxPoints would drop the figures the safety net just recovered.
      points: [...points.slice(0, maxPoints), ...figurePoints],
    };
  });
}

async function midReduce(items, stats) {
  const source = serializeItems(items);

  const result = await chatJson({
    model: REDUCE_MODEL,
    preamble: MID_PREAMBLE,
    message: `Merge these section notes into at most ${Math.max(
      2,
      Math.floor(items.length / 2)
    )} topic groups.\n\n${source}`,
    schema: MID_SCHEMA,
    maxTokens: 900,
    stats,
  });

  const themes = Array.isArray(result.themes) ? result.themes : [];

  return themes
    .map((theme) => {
      const pageList = items.map((item) => item.pages).join(",");
      return {
        section: String(theme.title || "Themes").trim(),
        pages: normalizePages(theme.pages, pageList),
        points: Array.isArray(theme.points)
          ? theme.points.map((point) => String(point).trim()).filter(Boolean)
          : [],
      };
    })
    .filter((theme) => theme.points.length > 0);
}

/**
 * Collapse map notes until they fit in one final call. Short documents go
 * straight to the final reduce; long ones pass through an intermediate level.
 */
const MAX_REDUCE_LEVELS = 4;

async function reduceNotes(
  notes,
  stats,
  budgetChars = REDUCE_BUDGET_CHARS,
  budgetNotes = REDUCE_BUDGET_NOTES
) {
  let level = notes;
  let previousCount = level.length;

  for (let pass = 0; pass < MAX_REDUCE_LEVELS; pass += 1) {
    if (level.length <= 2) break;
    if (
      serializeItems(level).length <= budgetChars &&
      level.length <= budgetNotes
    ) {
      break; // small enough for one final call
    }

    const batches = batchByChars(level, MID_BATCH_CHARS);

    if (batches.length >= level.length) break; // cannot compress any further

    const merged = (
      await mapLimit(batches, REDUCE_CONCURRENCY, (batch) =>
        midReduce(batch, stats)
      )
    ).flat();

    if (merged.length === 0) {
      throw new Error("The mid-level reduce stage returned no content");
    }

    // Stop if this level did not actually collapse anything; otherwise the
    // loop would keep paying for calls that make no progress.
    if (merged.length >= previousCount) break;

    level = merged;
    previousCount = level.length;
    stats.reduceLevels += 1;
  }

  return level;
}

async function finalReduce(items, options, stats) {
  const preset = LENGTH_PRESETS[options.length];
  const focus =
    options.type === "bullet"
      ? "Bullet-point summary: every section is a list of points."
      : "Narrative summary: the overview carries the main story, the sections add detail.";

  const message = `DOCUMENT NOTES\n\n${serializeItems(
    items
  )}\n\nWrite a ${options.length} summary of the whole document.\n${focus}\nConstraints:\n- overview: at most ${
    preset.overviewWords
  } words.\n- at most ${preset.maxSections} sections, at most ${
    preset.pointsPerSection
  } points each.\n- each section cites the page range from these notes, exactly as written.\n- takeaways: at most ${preset.takeaways} items.`;

  return chatJson({
    model: REDUCE_MODEL,
    preamble: FINAL_PREAMBLE,
    message,
    schema: FINAL_SCHEMA,
    maxTokens: preset.maxTokens,
    stats,
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const asText = (value) => (typeof value === "string" ? value.trim() : "");

const pageLabel = (pages) => {
  const normalized = normalizePages(pages, "");
  if (!normalized) return "";
  return normalized.includes("-") ? `pp. ${normalized}` : `p. ${normalized}`;
};

const renderMarkdown = (result) => {
  const lines = [`## ${asText(result.title) || "Document summary"}`, ""];

  const overview = asText(result.overview);
  if (overview) lines.push(overview, "");

  for (const section of result.sections || []) {
    const points = (section.points || []).map(asText).filter(Boolean);
    if (points.length === 0) continue;
    const label = pageLabel(section.pages);
    lines.push(
      `### ${asText(section.heading) || "Section"}${label ? ` (${label})` : ""}`,
      "",
      ...points.map((point) => `- ${point}`),
      ""
    );
  }

  const takeaways = (result.takeaways || []).map(asText).filter(Boolean);
  if (takeaways.length > 0) {
    lines.push("### Key takeaways", "", ...takeaways.map((item) => `- ${item}`), "");
  }

  return lines.join("\n").trim();
};

const numberTokens = (text) =>
  (text.match(/\d+(?:[.,]\d+)*/g) || []).map((value) =>
    value.replace(/,/g, "")
  );

/**
 * Figures the final summary left out. Small models tend to generalise numbers
 * away, so these are re-attached verbatim with their page reference.
 */
const collectMissingFigures = (markdown, notes, limit = 6) => {
  const present = new Set(numberTokens(markdown));
  const seen = new Set();
  const figures = [];

  for (const note of notes) {
    for (const point of note.points) {
      const numbers = numberTokens(point);
      if (numbers.length === 0) continue;
      if (numbers.every((number) => present.has(number))) continue;

      const key = point.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      if (seen.has(key)) continue;

      seen.add(key);
      figures.push({ text: point, pages: note.pages });
    }
  }

  return figures.slice(0, limit);
};

const appendFigures = (markdown, figures) => {
  if (figures.length === 0) return markdown;

  return [
    markdown,
    "",
    "### Key figures (verbatim from the document)",
    "",
    ...figures.map(
      (figure) => `- ${figure.text} *(${pageLabel(figure.pages)})*`
    ),
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const sanitizeSections = (sections) =>
  (Array.isArray(sections) ? sections : [])
    .map((section) => ({
      heading: asText(section.heading),
      pages: normalizePages(section.pages, ""),
      points: (Array.isArray(section.points) ? section.points : [])
        .map(asText)
        .filter(Boolean),
    }))
    .filter((section) => section.heading && section.points.length > 0);

/**
 * Hierarchical map-reduce summarization.
 *
 * map    -> one JSON note per structure-aware chunk (cheap model)
 * mid    -> only when the combined notes exceed the reduce budget
 * final  -> one JSON summary, rendered to markdown
 */
async function summarizePages(pages, options = {}) {
  const length = LENGTH_PRESETS[options.length] ? options.length : "medium";
  const type = options.type === "bullet" ? "bullet" : "general";
  const startedAt = Date.now();

  const stats = {
    calls: 0,
    inputTokens: 0,
    outputTokens: 0,
    documentChars: 0,
    documentTokens: 0,
    chunks: 0,
    reduceLevels: 0,
  };

  const cleaned = cleanPages(pages);
  const text = cleaned.flat().join(" ").trim();
  stats.documentChars = text.length;
  stats.documentTokens = estimateTokens(text);

  if (text.length < 200) {
    throw Object.assign(new Error("No extractable text found in this PDF"), {
      statusCode: 422,
    });
  }

  const chunks = chunkBlocks(buildBlocks(cleaned));
  if (chunks.length === 0) {
    throw Object.assign(new Error("No summarizable content found in this PDF"), {
      statusCode: 422,
    });
  }
  stats.chunks = chunks.length;

  const mapped = (await mapChunks(chunks, stats)).filter(Boolean);
  if (mapped.length === 0) {
    throw new Error("The summarization model returned no content");
  }

  const level = await reduceNotes(mapped, stats);
  const final = await finalReduce(level, { length, type }, stats);
  const sections = sanitizeSections(final.sections);

  // Scan every map note, not just the reduced ones, so long documents keep
  // the figures that survived the intermediate level.
  const body = renderMarkdown({ ...final, sections });
  const figures = collectMissingFigures(body, mapped);
  const summary = appendFigures(body, figures);

  return {
    summary,
    sections,
    figures,
    title: asText(final.title),
    meta: {
      pages: pages.length,
      chunks: chunks.length,
      notes: mapped.length,
      reduceLevels: stats.reduceLevels,
      stages: 2 + stats.reduceLevels,
      calls: stats.calls,
      inputTokens: stats.inputTokens,
      outputTokens: stats.outputTokens,
      documentChars: stats.documentChars,
      documentTokens: stats.documentTokens,
      compressionRatio:
        stats.documentTokens > 0
          ? Number(
              (stats.documentTokens / (stats.inputTokens || 1)).toFixed(2)
            )
          : 0,
      durationMs: Date.now() - startedAt,
      models: { map: MAP_MODEL, reduce: REDUCE_MODEL },
    },
  };
}

async function summarizePdf(buffer, options = {}) {
  const { pages } = await extractPages(buffer);
  return summarizePages(pages, options);
}

module.exports = {
  extractPages,
  cleanPages,
  buildBlocks,
  chunkBlocks,
  summarizePages,
  summarizePdf,
  renderMarkdown,
  reduceNotes,
  __test__: {
    mapChunks,
    keyFigurePoints,
    splitSentences,
    collectMissingFigures,
    appendFigures,
    isHeading,
    formatPageRange,
    estimateTokens,
    batchByChars,
    LENGTH_PRESETS,
    CHUNK_MAX_CHARS,
    CHUNK_TARGET_CHARS,
    MIN_CHUNK_CHARS,
    REDUCE_BUDGET_CHARS,
  },
};
