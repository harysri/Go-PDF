const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

// Initialize Gemini (NEW SDK)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { text, target_lang = "Spanish (es)" } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Valid text is required" });
    }

    // Prompt
    const prompt = `
You are a professional translation engine.

Translate the text below into ${target_lang}.

STRICT RULES:
- Output ONLY the translated text
- No explanations
- No quotes
- Preserve formatting

TEXT:
<<<${text}>>>
`;

    // Generate translation
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
      },
    });

    let translatedText = response.text.trim();

    // Clean common artifacts
    translatedText = translatedText.replace(/^["'`]+|["'`]+$/g, "");

    res.json({
      translated_text: translatedText,
      source_lang: "auto",
      target_lang,
    });
  } catch (error) {
    console.error("Translation error:", error);

    res.status(500).json({
      error: "Failed to translate text",
      details: error.message || "Gemini API error",
    });
  }
});

module.exports = router;
