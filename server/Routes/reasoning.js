// require("dotenv").config();
// const express = require("express");
// const router = express.Router();
// const axios = require("axios");
// // Hugging Face model and token
// const HF_MODEL = "AI-MO/NuminaMath-7B-TIR";

// // POST /api/reasoning
// router.post("/", async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res.status(400).json({ error: "Prompt is required" });
//     }

//     // Call Hugging Face Inference API
//     const response = await axios.post(
//       `https://api-inference.huggingface.co/models/${HF_MODEL}`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           inputs: prompt,
//           parameters: {
//             max_new_tokens: 512,
//             temperature: 0.2,
//           },
//         }),
//       }
//     );

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`HF API error: ${errorText}`);
//     }

//     const result = await response.json();

//     // Hugging Face sometimes returns nested arrays
//     const answer =
//       result[0]?.generated_text ||
//       result.generated_text ||
//       JSON.stringify(result);

//     res.json({ query: prompt, answer });
//   } catch (error) {
//     console.error("Error in reasoning API:", error);
//     res.status(500).json({
//       error: "Failed to generate reasoning",
//       details: error.message,
//     });
//   }
// });

// module.exports = router;

//new payed version below

// require("dotenv").config();
// const express = require("express");
// const router = express.Router();

// // Async helper to call HF Chat Completions API
// async function query(data) {
//   const response = await fetch(
//     "https://router.huggingface.co/v1/chat/completions",
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       method: "POST",
//       body: JSON.stringify(data),
//     }
//   );

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`HF API error: ${errorText}`);
//   }

//   return await response.json();
// }

// // POST /api/reasoning
// router.post("/", async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res.status(400).json({ error: "Prompt is required" });
//     }

//     const result = await query({
//       model: "deepseek-ai/DeepSeek-V3.1:together", // or another available model
//       messages: [
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       max_tokens: 512,
//       temperature: 0.2,
//     });

//     // Extract the chatbot reply
//     const answer = result?.choices?.[0]?.message?.content || "No response";

//     res.json({ query: prompt, answer });
//   } catch (error) {
//     console.error("Error in reasoning API:", error);
//     res.status(500).json({
//       error: "Failed to generate reasoning",
//       details: error.message,
//     });
//   }
// });

// module.exports = router;

// new

require("dotenv").config();
const express = require("express");
const router = express.Router();
const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// POST /api/reasoning
router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Call Cohere Chat API
    const response = await cohere.chat({
      model: "command-r-plus-08-2024", // reasoning model
      message: prompt,
      temperature: 0.2,
    });

    res.json({
      query: prompt,
      answer: response.text,
    });
  } catch (error) {
    console.error("Error in reasoning API:", error);
    res.status(500).json({
      error: "Failed to generate reasoning",
      details: error.message,
    });
  }
});

module.exports = router;
