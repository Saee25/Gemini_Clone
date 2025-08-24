import { GoogleGenAI } from "@google/genai";

async function main(prompt) {
  // ✅ Use Vite's import.meta.env instead of process.env
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  const model = "gemini-2.5-pro";

  const contents = [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  // No need for tools/config unless you specifically want them
  const response = await ai.models.generateContentStream({
    model,
    contents,
  });

  let fullText = "";
  for await (const chunk of response) {
    if (chunk.text) {
      fullText += chunk.text;
    }
  }

  // Return the complete response as a single string
  return fullText;
}

export default main;
