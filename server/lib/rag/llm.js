const { GoogleGenAI } = require("@google/genai");
const { rag, requireGemini } = require("./config");
const { SYSTEM_PROMPT, buildContents } = require("./prompt");

let ai = null;
function getClient() {
  requireGemini();
  if (!ai) ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return ai;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Flash-Lite regularly returns 503 "high demand" during spikes; one retry
// usually succeeds and costs the user seconds instead of an error card.
const isTransient = (error) => {
  const status = error?.status ?? error?.statusCode ?? error?.code;
  return status === 429 || status === 500 || status === 503;
};

async function withRetry(run, attempts = 3) {
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await run();
    } catch (error) {
      lastError = error;
      if (!isTransient(error)) break;
      await sleep(1200 * 2 ** attempt);
    }
  }

  throw lastError;
}

/**
 * Turns "and the second one?" into a query that retrieves well.
 *
 * Without this, follow-up questions are embedded verbatim and hybrid search
 * returns chunks about whatever "the second one" happened to match — the
 * history in the answer prompt cannot repair retrieval that already failed.
 */
async function condenseQuestion({ history, question }) {
  const turns = (history || [])
    .filter((message) => typeof message?.content === "string" && message.content.trim())
    .slice(-rag.history.maxMessages)
    .map((message) => `${message.role === "assistant" ? "Assistant" : "User"}: ${message.content.trim()}`);

  if (turns.length === 0) return question;

  const prompt = `Rewrite the follow-up question into a standalone search query for a document retrieval system.

Rules:
- Resolve pronouns and references ("it", "the second one", "that table") using the conversation.
- Keep the user's language and domain terms. Do not answer the question.
- Output one line: the query only, no quotes, no prefix.

CONVERSATION
${turns.join("\n")}

FOLLOW-UP QUESTION
${question}`;

  try {
    const response = await withRetry(() =>
      getClient().models.generateContent({
        model: rag.chat.model,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { temperature: 0, maxOutputTokens: 128 },
      })
    );

    const rewritten = (response.text || "").trim().replace(/^["'`]+|["'`]+$/g, "");
    return rewritten || question;
  } catch (error) {
    // A failed rewrite should never block the answer; fall back to the raw question.
    console.warn(`[rag] query condensation failed: ${error.message}`);
    return question;
  }
}

/** Generates the grounded answer from the four-block prompt. */
async function answerQuestion({ history, chunks, question }) {
  const response = await withRetry(() =>
    getClient().models.generateContent({
      model: rag.chat.model,
      contents: buildContents({ history, chunks, question }),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: rag.chat.temperature,
        maxOutputTokens: rag.chat.maxOutputTokens,
      },
    })
  );

  const text = (response.text || "").trim();

  if (!text) {
    const reason = response.candidates?.[0]?.finishReason || "empty response";
    throw new Error(`Gemini returned no answer (${reason})`);
  }

  return text;
}

module.exports = { condenseQuestion, answerQuestion };
