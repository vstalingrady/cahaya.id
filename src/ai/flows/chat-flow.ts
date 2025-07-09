
'use server';
/**
 * @fileOverview A conversational AI agent for personal finance.
 *
 * - runFinancialChatFlow - A function that handles the AI chat completions for the first turn.
 * - continueFinancialChat - A function that handles subsequent chat messages.
 * - ChatMessage - The type for a single message in the chat history.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

// --- Flow for the FIRST message of a conversation ---

// The output for the first turn needs a `title` for the conversation.
const InitialChatOutputSchema = z.object({
  response: z.string().describe("The AI's response to the user."),
  title: z
    .string()
    .describe(
      "A short, 3-5 word title for the conversation. You MUST generate this."
    ),
});
export type InitialChatOutput = z.infer<typeof InitialChatOutputSchema>;


/**
 * This flow is for the first message in a conversation. It generates a response AND a title.
 */
export async function runFinancialChatFlow(
  input: ChatInput
): Promise<InitialChatOutput> {
  return financialChatFlow(input);
}

const firstTurnPrompt = ai.definePrompt({
  name: 'financialChatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: InitialChatOutputSchema}, // Uses the schema that includes the title
  prompt: `You are Cahaya, a friendly, witty, and knowledgeable AI financial assistant for a personal finance app in Indonesia. Your goal is to help users with their financial questions.

You must be encouraging and provide clear, actionable advice. If you don't know the answer, say so. Do not provide financial advice that could be construed as professional investment counseling. You can give general financial knowledge and tips.

Keep your answers concise and easy to understand.

IMPORTANT: This is the first message in a new conversation. Based on the user's message, you MUST generate a short, descriptive title (3-5 words) for this chat and include it in the 'title' field of the output. For example, if the user asks "how do I save for a trip to Japan?", a good title would be "Saving for Japan Trip". If the user just says "hello", a good title is "Friendly Chat".

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
    outputSchema: InitialChatOutputSchema,
  },
  async input => {
    const {output} = await firstTurnPrompt(input);
    return output!;
  }
);


// --- Flow for CONTINUING an existing conversation ---

// This prompt is simpler and outputs only a string, which is faster.
const continueChatPrompt = ai.definePrompt({
  name: 'continueFinancialChatPrompt',
  input: { schema: ChatInputSchema }, // Still takes the history
  output: { schema: z.string() },      // Outputs a plain string, which is faster
  prompt: `You are Cahaya, a friendly, witty, and knowledgeable AI financial assistant. Continue the following conversation, responding to the last user message. Keep your answers concise and easy to understand. Do not provide professional investment advice.

Chat History:
{{#each history}}
**{{this.role}}**: {{{this.content}}}
{{/each}}
**model**:`,
});

const continueFinancialChatFlow = ai.defineFlow({
    name: 'continueFinancialChatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
}, async (input) => {
    const { output } = await continueChatPrompt(input);
    return output!;
});

/**
 * This flow is for subsequent messages in a conversation. It only generates a text response.
 */
export async function continueFinancialChat(input: ChatInput): Promise<string> {
    return continueFinancialChatFlow(input);
}
