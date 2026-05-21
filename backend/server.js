const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

// Generate Route
app.post("/generate", async (req, res) => {

  try {

    const { prompt, type, tone, wordCount } =
      req.body;

    // Validation
    if (!prompt || prompt.trim() === "") {

      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    // Content Type Prompts
    const contentTypePrompts = {
      email: "Write a professional email.",
      linkedin: "Write a professional LinkedIn post.",
      caption: "Write a social media caption.",
      blog: "Generate 5 blog ideas.",
    };

    const baseInstruction =
      contentTypePrompts[type] ||
      "Generate high-quality content.";

    // Final Prompt
    const finalPrompt = `
${baseInstruction}

Tone: ${tone || "Professional"}

Word Count: ${wordCount || 120}

User Prompt:
${prompt}
`;

    console.log("Sending request to OpenRouter...");

    // OpenRouter API Request
    const aiResponse = await axios.post(

      "https://openrouter.ai/api/v1/chat/completions",

      {
        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "user",
            content: finalPrompt,
          },
        ],
      },

      {
        headers: {

          Authorization:
            `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "HTTP-Referer":
            "http://localhost:5500",

          "X-Title":
            "AI Content Assistant",

          "Content-Type":
            "application/json",
        },
      }
    );

    console.log(aiResponse.data);

    const response =
      aiResponse.data.choices[0].message.content;

    res.status(200).json({
      success: true,
      response,
    });

  } catch (error) {

    console.log(
      "FULL ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to generate content",
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});