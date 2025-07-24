import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateChatSummary(
  messages: Array<{
    username: string;
    body: string;
    _creationTime: number;
  }>
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chatHistory = messages
      .map((msg) => `${msg.username}: ${msg.body}`)
      .join("\n");

    const prompt = `
    Please provide a concise summary of this chat conversation. Focus on:
    - Key topics discussed
    - Important decisions made
    - Action items or deadlines mentioned
    - Main participants and their contributions
    
    Chat history:
    ${chatHistory}
    
    Please keep the summary under 100 words and make it professional.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate summary");
  }
}
