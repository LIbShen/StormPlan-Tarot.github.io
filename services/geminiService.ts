import { GoogleGenAI } from "@google/genai";
import { DeckCard } from "../types";

const apiKey = process.env.API_KEY || '';

export const getTarotReading = async (past: DeckCard, present: DeckCard, future: DeckCard) => {
  if (!apiKey) {
    console.warn("API Key missing");
    return "The stars are cloudy... (Please configure API_KEY)";
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are a mystical, wise, and empathetic Tarot Reader. 
    Perform a "Past, Present, Future" reading based on these three cards.
    
    1. Past: ${past.nameEn} ${past.isReversed ? '(Reversed)' : '(Upright)'}
    2. Present: ${present.nameEn} ${present.isReversed ? '(Reversed)' : '(Upright)'}
    3. Future: ${future.nameEn} ${future.isReversed ? '(Reversed)' : '(Upright)'}

    Provide a cohesive narrative that weaves these three cards together. 
    Focus on the journey from the past, the current energy, and the potential outcome.
    Keep the tone mysterious but helpful. Use markdown formatting.
    Limit response to 250 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Flash doesn't need thinking budget for this
      }
    });

    return response.text || "The spirits are silent.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The connection to the ether is disrupted. Please try again later.";
  }
};