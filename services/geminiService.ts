import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AiAnalysisResult } from "../types";

// Note: In a real production app, never send real passwords to an LLM. 
// This is a demo/tool for educational purposes or non-sensitive password brainstorming.

const createClient = () => {
  // This value is replaced at build time by Vite
  const apiKey = process.env.API_KEY;
  
  // Debug log for production troubleshooting (safely masked)
  if (!apiKey) {
    console.error("GeminiService: API Key is MISSING or EMPTY.");
  } else {
    console.log(`GeminiService: API Key present (Starts with: ${apiKey.substring(0, 4)}...)`);
  }

  if (!apiKey) {
    throw new Error("API Key is missing. Please check your Netlify Environment Variables and trigger a Re-deploy.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzePasswordStrength = async (password: string): Promise<AiAnalysisResult> => {
  try {
    const ai = createClient();
    
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER, description: "Security score from 0 to 100" },
        critique: { type: Type.STRING, description: "Brief critique of the password's patterns or weaknesses" },
        timeToCrackEstimate: { type: Type.STRING, description: "Human readable estimate (e.g., '3 centuries', '5 seconds')" },
        improvements: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "List of 2-3 specific suggestions to improve this specific password"
        }
      },
      required: ["score", "critique", "timeToCrackEstimate", "improvements"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the strength of the following password string from a security perspective. 
      Password: "${password}"
      Consider entropy, dictionary attacks, common substitutions (like @ for a), and keyboard patterns.
      Be strict. Return the result in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.3, // Low temperature for consistent analysis
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text from AI");
    
    return JSON.parse(text) as AiAnalysisResult;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    
    // Create a user-friendly error message to display in the critique box
    const msg = error instanceof Error ? error.message : String(error);
    let userMessage = `Analysis failed: ${msg}`;
    
    // Catch the specific missing key error
    if (msg.includes("API Key is missing") || msg.includes("API_KEY")) {
        userMessage = "SYSTEM ERROR: API Key not found. If you just added it to Netlify, please go to 'Deploys' -> 'Trigger Deploy' -> 'Clear cache and deploy site' to apply the changes.";
    }

    return {
      score: 0,
      critique: userMessage,
      timeToCrackEstimate: "Unknown",
      improvements: ["Check Netlify Settings", "Re-deploy Site", "Check Browser Console"]
    };
  }
};

export const generateMemorablePassphrases = async (context: string): Promise<string[]> => {
  try {
    const ai = createClient();

    const schema: Schema = {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 5 generated passphrases"
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 5 unique, high-entropy "correct horse battery staple" style passphrases.
      Context/Theme: ${context || 'General Randomness'}
      Requirements:
      - 4 to 6 random but common English words.
      - Separated by spaces, hyphens, or random special characters.
      - Must be easy to visualize but hard to guess by machine.
      - Do not use common idioms (e.g., "raining cats and dogs").
      - Optionally capitalize random words.
      Return strictly a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.9, // Higher temp for creativity
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as string[];
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return [];
  }
};