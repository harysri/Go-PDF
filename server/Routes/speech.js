require("dotenv").config();
const express = require("express");
const {
  config,
  getStatus,
  listVoices,
  synthesize,
} = require("../lib/tts/kokoro");

const router = express.Router();

const MIN_SPEED = 0.5;
const MAX_SPEED = 2;

function parseSpeed(value) {
  if (value === undefined || value === null || value === "") return 1;

  const speed = Number(value);
  if (!Number.isFinite(speed) || speed < MIN_SPEED || speed > MAX_SPEED) {
    return null;
  }

  return speed;
}

/**
 * GET /api/speech/health
 * Reports readiness without triggering a model download.
 */
router.get("/health", (req, res) => {
  res.json({ ok: true, ...getStatus() });
});

/**
 * GET /api/speech/voices
 * Lists the available Kokoro voices. Loads the model on first call.
 */
router.get("/voices", async (req, res) => {
  try {
    const voices = await listVoices();
    res.json({ voices, defaultVoice: config.voice });
  } catch (error) {
    console.error("Speech voices error:", error.message);
    res.status(503).json({
      error: "Speech model is unavailable",
      details: error.message,
    });
  }
});

/**
 * POST /api/speech
 * Body: { text: string, voice?: string, speed?: number }
 * Returns: audio/wav (16-bit PCM, mono, 24 kHz)
 */
router.post("/", async (req, res) => {
  const { text, voice, speed } = req.body || {};

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "text is required" });
  }

  if (text.length > config.maxTextChars) {
    return res.status(413).json({
      error: `Text is too long. Maximum is ${config.maxTextChars} characters.`,
    });
  }

  const parsedSpeed = parseSpeed(speed);
  if (parsedSpeed === null) {
    return res.status(400).json({
      error: `speed must be a number between ${MIN_SPEED} and ${MAX_SPEED}`,
    });
  }

  if (voice !== undefined && typeof voice !== "string") {
    return res.status(400).json({ error: "voice must be a string" });
  }

  try {
    const result = await synthesize(text, { voice, speed: parsedSpeed });

    res.set({
      "Content-Type": "audio/wav",
      "Content-Length": String(result.wav.length),
      "Content-Disposition": 'inline; filename="summary.wav"',
      "Cache-Control": "no-store",
      "X-Audio-Chunks": String(result.chunks.length),
      "X-Audio-Duration-Seconds": String(result.durationSeconds),
      "X-Audio-Voice": result.voice,
      "X-Audio-Sample-Rate": String(result.sampleRate),
      "Access-Control-Expose-Headers":
        "X-Audio-Chunks, X-Audio-Duration-Seconds, X-Audio-Voice, X-Audio-Sample-Rate",
    });

    return res.send(result.wav);
  } catch (error) {
    console.error("Speech generation error:", error.message);

    const status = error.statusCode || (error.isModelLoadError ? 503 : 500);

    return res.status(status).json({
      error:
        status === 503
          ? "Speech model is unavailable. Check the server logs and network access to huggingface.co."
          : status === 400
          ? error.message
          : "Failed to generate speech",
      details: error.message,
    });
  }
});

module.exports = router;
