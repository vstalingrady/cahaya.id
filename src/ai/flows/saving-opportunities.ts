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
  suggestions: z
    .array(z.string())
    .describe('A list of personalized saving suggestions for the user.'),
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
  prompt: `You are a personal finance advisor. Analyze the user's spending data and provide personalized saving suggestions.

Spending Data: {{{spendingData}}}

Based on this data, suggest practical ways the user can save money. Focus on specific areas where they are overspending and suggest alternatives.

Format your output as a list of concise and actionable suggestions.
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
