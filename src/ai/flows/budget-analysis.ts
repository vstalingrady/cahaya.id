// Temporarily disabled for standalone APK build
// 'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing AI-powered analysis of user budgets.
 *
 * - budgetAnalysis - A function that generates personalized saving suggestions.
 * - BudgetAnalysisInput - The input type for the budgetAnalysis function.
 * - BudgetAnalysisOutput - The return type for the budgetAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetAnalysisInputSchema = z.object({
  budgetData: z
    .string()
    .describe(
      'A summary of all active budgets, including name, category, amount, and spending so far.'
    ),
});
export type BudgetAnalysisInput = z.infer<
  typeof BudgetAnalysisInputSchema
>;

const BudgetAnalysisOutputSchema = z.object({
  coachTitle: z.string().describe("A concise, creative title for the AI budget coach persona (e.g., 'The Budget Sensei', 'The Savings Strategist')."),
  summary: z.string().describe("A brief, engaging summary of the user's overall budget performance, highlighting successes and areas for improvement."),
  suggestions: z
    .array(z.string())
    .describe('A list of actionable, quantitative suggestions focused on the most overspent or at-risk budgets.'),
  proTip: z.string().describe("A single, powerful, and general tip for better budgeting or financial management."),
});
export type BudgetAnalysisOutput = z.infer<
  typeof BudgetAnalysisOutputSchema
>;

export async function budgetAnalysis(
  input: BudgetAnalysisInput
): Promise<BudgetAnalysisOutput> {
  return budgetAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetAnalysisPrompt',
  input: {schema: BudgetAnalysisInputSchema},
  output: {schema: BudgetAnalysisOutputSchema},
  prompt: `You are an expert, friendly, and encouraging budget coach. Your goal is to analyze a user's performance against their set budgets and provide clear, actionable advice.

**User's Budget Performance:**
{{{budgetData}}}

**Your Task:**
1.  **Analyze & Profile:**
    *   **Analyze Budgets:** Deeply analyze the user's budget data. Identify which budgets are on track and which are overspent or close to the limit.
    *   **Create Profile:** Come up with a fun, encouraging persona for yourself.
        *   **coachTitle:** A catchy, creative title (e.g., 'The Penny Pincher Pro', 'The Goal Getter Guide').
        *   **summary:** A short, engaging paragraph summarizing their budget performance. Start by praising what they're doing well, then gently point out the challenges.

2.  **Create an Action Plan:**
    *   **Targeted Suggestions:** Provide a list of practical saving tips focused **specifically on the budgets that are overspent or at risk**. The suggestions **must be specific and include numbers**. For example, "Your 'Food & Drink' budget is IDR 200,000 over. Try meal prepping for lunches to save at least IDR 150,000 next week."
    *   **Pro Tip:** Give one general, impactful pro-tip about budgeting that they can apply universally.

Fill out all fields in the output schema: \`coachTitle\`, \`summary\`, \`suggestions\`, and \`proTip\`.
`,
});

const budgetAnalysisFlow = ai.defineFlow(
  {
    name: 'budgetAnalysisFlow',
    inputSchema: BudgetAnalysisInputSchema,
    outputSchema: BudgetAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
