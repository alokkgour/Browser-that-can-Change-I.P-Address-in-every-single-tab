
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Robustly extracts JSON from a string that might contain Markdown blocks.
 */
const extractJSON = (text: string) => {
  try {
    // Attempt direct parse first
    return JSON.parse(text);
  } catch (e) {
    // Try to find JSON inside markdown code blocks
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (innerE) {
        console.warn("Failed to parse JSON from markdown block");
      }
    }
    // Fallback: search for first [ or { and last ] or }
    const startIdx = text.search(/[\[\{]/);
    const endIdx = text.lastIndexOf(text.charAt(startIdx) === '[' ? ']' : '}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      try {
        return JSON.parse(text.substring(startIdx, endIdx + 1));
      } catch (fallbackE) {
        console.warn("Failed to parse JSON using boundary fallback");
      }
    }
    throw new Error("Could not extract valid JSON from model response");
  }
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
  } catch (error: any) {
    console.warn("Gemini Advice Error:", error?.message || "Unknown error");
    return "Optimizing network routes for maximum throughput...";
  }
};

export const searchVideos = async (query: string) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for direct video stream URLs (mp4, webm) or high-quality video hosting pages related to: "${query}". 
                 Return a JSON array of objects with 'title' and 'url' properties. 
                 Try to find direct .mp4 links if possible, otherwise use source page links.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              url: { type: Type.STRING },
            },
            required: ["title", "url"],
          },
        },
      },
    });

    const results = extractJSON(response.text || "[]");
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { results, sources };
  } catch (error: any) {
    console.warn("Gemini Search Error:", error?.message || "Unknown error");
    return { results: [], sources: [] };
  }
};
