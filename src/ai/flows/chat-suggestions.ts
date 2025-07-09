'use server';

/**
 * @fileOverview An AI flow for generating contextual chat suggestions.
 *
 * - getChatSuggestions - A function that generates starter questions for the chat AI.
 * - ChatSuggestionInput - The input type for the getChatSuggestions function.
 * - ChatSuggestionOutput - The return type for the getChatSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatSuggestionInputSchema = z.object({
  transactionHistory: z
    .string()
    .optional()
    .describe('A summary of the user\'s recent transaction history.'),
});
export type ChatSuggestionInput = z.infer<typeof ChatSuggestionInputSchema>;

const ChatSuggestionOutputSchema = z.object({
  suggestions: z.array(z.string()).length(3).describe('An array of exactly three suggestion strings.'),
});
export type ChatSuggestionOutput = z.infer<
  typeof ChatSuggestionOutputSchema
>;

export async function getChatSuggestions(
  input: ChatSuggestionInput
): Promise<ChatSuggestionOutput> {
  return chatSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatSuggestionPrompt',
  input: {schema: ChatSuggestionInputSchema},
  output: {schema: ChatSuggestionOutputSchema},
  prompt: `You are a helpful AI assistant for a personal finance app called Cahaya. Your task is to generate three engaging and relevant starter questions for the user to ask you.

{{#if transactionHistory}}
**Context: User's Recent Spending**
Here is a summary of the user's recent transaction history:
{{{transactionHistory}}}

**Your Task:**
Based on the user's spending, generate three insightful and personalized questions they might have. The questions should be directly related to their transactions. For example, if they spent a lot on "GoFood", a good question would be "How can I reduce my spending on food delivery?". If they have travel expenses, suggest budgeting for another trip. Keep the questions concise, engaging, and directly actionable for the user.
{{else}}
**Context: New User**
The user has no transaction history yet.

**Your Task:**
Generate three interesting and general financial questions that a new user might find helpful. The questions should cover diverse topics like budgeting, saving, or understanding financial concepts. Keep them concise and engaging. For example: "Explain compound interest like I'm 5" or "What's a good way to start a savings plan?".
{{/if}}

Return exactly three questions in the output format.
`,
});

const chatSuggestionFlow = ai.defineFlow(
  {
    name: 'chatSuggestionFlow',
    inputSchema: ChatSuggestionInputSchema,
    outputSchema: ChatSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
