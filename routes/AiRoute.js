const express = require("express");
const axios = require("axios");
const { jwtAuthMiddleware } = require("../jwt");
require("dotenv").config();

const router = express.Router();

router.post("/generate-description", jwtAuthMiddleware, async (req, res) => {
  const { inputText, type } = req.body;

  //   if (!inputText || inputText.length < 10) {
  //     return res.status(400).json({ error: 'Input text is too short or missing' });
  //   }
  const prompt = `Write a short and appetizing 1-2 sentence description for the Indian dish "${inputText}". Keep it simple, culturally relevant, and easy to understand.`;

  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        model: "command",
        prompt,
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText = response.data.generations[0]?.text?.trim();

    if (!generatedText) {
      return res.status(500).json({ error: "No response from AI" });
    }

    return res.status(200).json({ description: generatedText });
  } catch (err) {
    console.error("AI error:", err?.response?.data || err.message);
    return res.status(500).json({ error: "AI description generation failed" });
  }
});

module.exports = router;
