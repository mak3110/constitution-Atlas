'use server';

import { chatWithAI } from '@/lib/ai';

export async function sendMessageAction(message: string, history: { role: string; content: string }[]) {
  try {
    const response = await chatWithAI(message, history);
    return response;
  } catch (error: any) {
    return {
      response: `Failed to connect to the assistant: ${error.message}`,
      sources: []
    };
  }
}
