import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getAstrologicalInsight(data: { name: string, score: number, doshas: string[], dob?: string, birthTime?: string, birthPlace?: string }) {
  const prompt = `You are an expert Vedic Astrologer providing insights for a matrimonial platform.
  User: ${data.name}
  Date of Birth: ${data.dob || 'Unknown'}
  Time of Birth: ${data.birthTime || 'Unknown'}
  Place of Birth: ${data.birthPlace || 'Unknown'}
  Guna Milan Score: ${data.score}/36
  Known Doshas: ${data.doshas.join(', ') || 'None identified'}
  
  Provide a brief, supportive, and respectful summary of how these birth details and planetary alignments translate to relationship dynamics and compatibility.
  Instead of technical jargon like "Mars in 7th house", use phrases like "Your birth star suggests a nurturing nature".
  Focus on Guna Milan compatibility if applicable.
  Keep it under 100 words. Focus on compatibility and personal growth. Use a respectful tone.`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return result.text || "Your planetary alignments suggest a balanced and harmonious approach to life. You value tradition while embracing modern growth, making you a supportive partner.";
  } catch (error) {
    console.error("Error fetching AI insight:", error);
    return "Your planetary alignments suggest a balanced and harmonious approach to life. You value tradition while embracing modern growth, making you a supportive partner.";
  }
}
