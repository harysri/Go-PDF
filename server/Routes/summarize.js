require("dotenv").config();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { summarizePdf } = require("../lib/pdfSummarizer");

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// POST /api/summarize
router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    console.log("No file received");
    return res.status(400).json({ error: "No PDF uploaded" });
  }

  const filePath = path.resolve(req.file.path);

  try {
    const { summaryLength = "medium", summaryType = "general" } = req.body;
    const buffer = await fs.promises.readFile(filePath);

    const result = await summarizePdf(buffer, {
      length: summaryLength,
      type: summaryType,
    });

    res.json({
      summary: result.summary,
      sections: result.sections,
      figures: result.figures,
      title: result.title,
      originalLength: result.meta.documentChars,
      summaryLength: result.summary.length,
      meta: result.meta,
    });
  } catch (error) {
    const status = error.statusCode === 422 ? 422 : 500;
    console.error("Summarization error:", error.message);

    res.status(status).json({
      error:
        status === 422 ? error.message : "Failed to summarize PDF",
      details: error.message,
    });
  } finally {
    // Always remove the uploaded file, on success and on failure.
    await fs.promises.unlink(filePath).catch(() => {});
  }
});

module.exports = router;
