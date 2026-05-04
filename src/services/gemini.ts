import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getHydrationTip(intakeMl: number, goalMl: number) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `I have drunk ${intakeMl}ml of water today. My goal is ${goalMl}ml. Give me a very short (max 20 words), encouraging, and scientifically sound hydration tip. Format it as a simple string.`,
      config: {
        temperature: 0.8,
      }
    });

    return response.text || "Keep sipping! Your body will thank you.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Don't forget to drink some water!";
  }
}
