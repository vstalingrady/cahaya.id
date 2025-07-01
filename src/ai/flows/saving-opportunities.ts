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
import {findFinancialPromos} from '../tools/promo-finder';

const PersonalizedSavingSuggestionsInputSchema = z.object({
  spendingData: z
    .string()
    .describe(
      'A detailed breakdown of the user spending habits, including categories and amounts spent.'
    ),
  monthlyIncome: z.number().describe("The user's estimated monthly income in IDR."),
  location: z.string().describe("The user's current city for finding local deals, e.g., 'Jakarta'."),
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
  investmentPlan: z.string().describe("A simple, actionable investment suggestion based on the user's income."),
  localDeals: z.array(z.string()).describe("A list of relevant local deals and promotions that can help the user save money."),
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
  tools: [findFinancialPromos],
  prompt: `You are a witty, insightful, and hyperlocal personal finance advisor in Indonesia. Your goal is to analyze a user's spending data and income, give them a fun "spender personality" profile, and provide a comprehensive, actionable financial plan.

**User Information:**
*   **Monthly Income:** IDR {{{monthlyIncome}}}
*   **Location:** {{{location}}}
*   **Spending Data:**
    {{{spendingData}}}

**Your Task:**
1.  **Analyze & Profile:**
    *   **Analyze Spending:** Deeply analyze the user's spending data in relation to their income.
    *   **Create Profile:** Based on the analysis, create a profile.
        *   **spenderType:** A catchy, creative title (e.g., 'The Comfort Connoisseur', 'The Social Butterfly').
        *   **summary:** A short, engaging paragraph describing their spending style and highlighting key spending categories.

2.  **Create an Action Plan:**
    *   **Quantitative Suggestions:** Provide a list of practical saving tips. They **must be specific and include numbers**. For example, instead of "spend less on coffee", say "You spent IDR 250,000 on coffee. By reducing this by 50%, you could save IDR 125,000." Focus on the largest spending areas.
    *   **Investment Plan:** Based on their income, provide a simple, actionable investment suggestion. For example: "With an income of IDR 15,000,000, you could start investing IDR 500,000/month in a low-cost index fund to build wealth."
    *   **Local Deals:** Use the \`findFinancialPromos\` tool to find relevant deals in the user's location. Present these deals clearly to the user in the \`localDeals\` output field.

Fill out all fields in the output schema: \`spenderType\`, \`summary\`, \`suggestions\`, \`investmentPlan\`, and \`localDeals\`.
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
