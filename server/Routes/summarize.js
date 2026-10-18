require("dotenv").config();
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.log("No file received");
      return res.status(400).json({ error: "No PDF uploaded" });
    }

    // Get options from request body
    const { summaryLength = "medium", summaryType = "general" } = req.body;

    // Extract text from PDF
    const pdfPath = path.join(__dirname, "../", req.file.path);
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(pdfBuffer);

    // Clean and limit text
    let text = pdfData.text
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 4000);
    // console.log("Extracted text:", text);

    // Create prompt based on options
    let prompt = `Create a ${summaryLength} ${summaryType} summary of the following text:\n\n${text}`;

    if (summaryType === "bullet") {
      prompt = `Extract key bullet points from the following text. Keep it ${summaryLength}:\n\n${text}`;
    } else if (summaryType === "general") {
      prompt = `Create a general summary of the following text. Keep it ${summaryLength} and focus on general details:\n\n${text}`;
    }
    // Call Hugging Face API
    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/Falconsai/text_summarization",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    // Delete uploaded file
    fs.unlinkSync(pdfPath);

    res.json({
      summary: response.data[0]?.summary_text || "No summary returned.",
      originalLength: pdfData.text.length,
      summaryLength: response.data[0]?.summary_text?.length || 0,
    });
  } catch (error) {
    console.error("Error:", error);

    // Clean up file if error occurred
    if (req.file) {
      const pdfPath = path.join(__dirname, "../", req.file.path);
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }

    res.status(500).json({
      error: "Failed to summarize PDF",
      details: error.message,
    });
  }
});

module.exports = router;
