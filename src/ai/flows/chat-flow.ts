'use server';
/**
 * @fileOverview A conversational AI agent for personal finance.
 *
 * - getAiChatResponse - A function that handles the AI chat completions.
 * - ChatMessage - The type for a single message in the chat history.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.string();
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function getAiChatResponse(
  history: ChatMessage[]
): Promise<string> {
  const response = await financialChatFlow({history});
  return response;
}

const prompt = ai.definePrompt({
  name: 'financialChatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are Cuan, a friendly, witty, and knowledgeable AI financial assistant for a personal finance app in Indonesia. Your goal is to help users with their financial questions.

You must be encouraging and provide clear, actionable advice. If you don't know the answer, say so. Do not provide financial advice that could be construed as professional investment counseling. You can give general financial knowledge and tips.

Keep your answers concise and easy to understand.

Use the provided chat history to maintain context of the conversation.

Chat History:
{{#each history}}
**{{this.role}}**: {{{this.content}}}
{{/each}}
**model**:`,
});

const financialChatFlow = ai.defineFlow(
  {
    name: 'financialChatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
