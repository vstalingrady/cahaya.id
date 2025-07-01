'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized saving suggestions based on user spending patterns.
 *
 * - personalizedSavingSuggestions - A function that generates personalized saving suggestions.
 * - PersonalizedSavingSuggestionsInput - The input type for the personalizedSavingSuggestions function.
 * - PersonalizedSavingSuggestionsOutput - The return type for the personalizedSavingSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedSavingSuggestionsInputSchema = z.object({
  spendingData: z
    .string()
    .describe(
      'A detailed breakdown of the user spending habits, including categories and amounts spent.'
    ),
});
export type PersonalizedSavingSuggestionsInput = z.infer<
  typeof PersonalizedSavingSuggestionsInputSchema
>;

const PersonalizedSavingSuggestionsOutputSchema = z.object({
  spenderType: z.string().describe("A concise, creative title for the user's spending profile (e.g., 'The Weekend Warrior', 'The Foodie Explorer')."),
  summary: z.string().describe("A brief, engaging summary of the user's spending habits, personality, and key areas for improvement."),
  suggestions: z
    .array(z.string())
    .describe('A list of personalized, quantitative saving suggestions for the user.'),
});
export type PersonalizedSavingSuggestionsOutput = z.infer<
  typeof PersonalizedSavingSuggestionsOutputSchema
>;

export async function personalizedSavingSuggestions(
  input: PersonalizedSavingSuggestionsInput
): Promise<PersonalizedSavingSuggestionsOutput> {
  return personalizedSavingSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedSavingSuggestionsPrompt',
  input: {schema: PersonalizedSavingSuggestionsInputSchema},
  output: {schema: PersonalizedSavingSuggestionsOutputSchema},
  prompt: `You are a witty and insightful personal finance advisor with a knack for making financial advice engaging. Your goal is to analyze a user's spending data, give them a fun but accurate "spender personality" profile, and provide practical, quantitative saving tips.

**Analysis & Profiling:**
1.  **Analyze Spending Data:** Deeply analyze the user's spending data to understand their habits.
2.  **Create a Spender Profile:** Based on the analysis, create a profile for the user.
    *   **spenderType:** A catchy, creative title for their spending personality (e.g., 'The Comfort Connoisseur', 'The Social Butterfly', 'The Homebody Hero').
    *   **summary:** A short, engaging paragraph that describes their spending style and highlights their main spending categories in a friendly tone.

**Quantitative Suggestions:**
*   Provide a list of practical ways the user can save money.
*   Your suggestions **must be specific and include numbers**.
*   For example, instead of saying "spend less on coffee", say "You spent IDR 250,000 on coffee this month. By reducing this by 50%, you could save IDR 125,000."
*   Focus on the largest areas of spending to maximize potential savings.

**User's Spending Data:**
{{{spendingData}}}

**Your Task:**
Fill out the \`spenderType\`, \`summary\`, and \`suggestions\` fields based on the data provided.
`,
});

const personalizedSavingSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizedSavingSuggestionsFlow',
    inputSchema: PersonalizedSavingSuggestionsInputSchema,
    outputSchema: PersonalizedSavingSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
