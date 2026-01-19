
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getProxyAdvice = async (location: string, currentIp: string) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `I am simulating a high-security browser. My current tab is proxied to ${location} with IP ${currentIp}. 
                 Provide a brief, technical 2-sentence advice on how to improve streaming performance and anonymity for this specific route.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text || "Connection stable. Monitoring traffic for anomalies.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Optimizing network routes for maximum throughput...";
  }
};
