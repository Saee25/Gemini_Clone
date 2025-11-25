import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, conversationHistory = [] } = req.body;

    console.log("Received request - prompt:", prompt);
    console.log("Received conversationHistory length:", conversationHistory.length);
    console.log("ConversationHistory:", JSON.stringify(conversationHistory, null, 2));

    // Build contents array from conversation history
    // If conversationHistory exists, use it; otherwise, just use the current prompt
    let contents = [];
    
    if (conversationHistory && conversationHistory.length > 0) {
      // Use the full conversation history (it already includes the current user message)
      // Ensure proper format for Gemini API
      contents = conversationHistory.map(msg => ({
        role: msg.role,
        parts: Array.isArray(msg.parts) ? msg.parts : [{ text: typeof msg.parts === 'string' ? msg.parts : msg.text || '' }]
      }));
      console.log("Using conversation history with", contents.length, "messages");
      console.log("Contents format:", JSON.stringify(contents, null, 2));
    } else {
      // First message in conversation
      contents = [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ];
      console.log("Starting new conversation");
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: contents,
    });

    // Handle different possible response structures
    let text = '';
    if (result.text) {
      text = result.text;
    } else if (result.response?.text) {
      text = typeof result.response.text === 'function' ? result.response.text() : result.response.text;
    } else if (result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = result.response.candidates[0].content.parts[0].text;
    } else if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = result.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected response structure:", JSON.stringify(result, null, 2));
      throw new Error("Unexpected response structure from API");
    }

    // IMPORTANT: Return JSON with a "text" field
    res.json({ text: text });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => console.log("Server running on 3000"));
