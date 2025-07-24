"use server";

import { generateChatSummary } from "@/lib/gemini";

export async function generateSummaryAction(
  messages: Array<{
    username: string;
    body: string;
    _creationTime: number;
  }>
) {
  try {
    if (!messages || messages.length === 0) {
      return null;
    }

    // Only generate summary if there are enough messages
    if (messages.length < 5) {
      return null;
    }

    const summary = await generateChatSummary(messages);
    return summary;
  } catch (error) {
    console.error("Error in generateSummaryAction:", error);
    return null;
  }
}
