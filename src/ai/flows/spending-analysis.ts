// filename: src/ai/flows/spending-analysis.ts
// Temporarily disabled server actions for static export
// 'use server';

/**
 * @fileOverview AI-powered spending analysis and categorization flow.
 *
 * - analyzeSpending - A function that categorizes spending transactions.
 * - SpendingAnalysisInput - The input type for the analyzeSpending function.
 * - SpendingAnalysisOutput - The return type for the analyzeSpending function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpendingAnalysisInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe('The description of the transaction.'),
  transactionAmount: z.number().describe('The amount of the transaction.'),
});
export type SpendingAnalysisInput = z.infer<typeof SpendingAnalysisInputSchema>;

const SpendingAnalysisOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The category of the transaction (e.g., Food, Transportation, Entertainment).'
    ),
  subCategory: z
    .string()
    .optional()
    .describe(
      'A more specific sub-category of the transaction (e.g., Groceries, Gas, Movies).'
    ),
  savingOpportunity: z
    .string()
    .optional()
    .describe(
      'A suggestion for saving money on this type of transaction in the future.'
    ),
});
export type SpendingAnalysisOutput = z.infer<typeof SpendingAnalysisOutputSchema>;

export async function analyzeSpending(input: SpendingAnalysisInput): Promise<SpendingAnalysisOutput> {
  return spendingAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'spendingAnalysisPrompt',
  input: {schema: SpendingAnalysisInputSchema},
  output: {schema: SpendingAnalysisOutputSchema},
  prompt: `You are a personal finance expert. You will analyze spending transactions and categorize them to help users understand where their money is going.

  Analyze the following transaction and provide a category, a sub-category if applicable, and a saving opportunity if possible.

  Transaction Description: {{{transactionDescription}}}
  Transaction Amount: {{{transactionAmount}}}

  Ensure that the category is one of the following: Food, Transportation, Entertainment, Utilities, Housing, Healthcare, Shopping, Travel, Education, Personal Care, or Other.
  If a sub-category is applicable, provide a more specific description of the transaction. For example, if the category is Food, the sub-category could be Groceries or Restaurants.
  If you can think of a way the user could save money on this type of transaction in the future, provide a saving opportunity. For example, if the category is Entertainment, the saving opportunity could be to find discounts or coupons before going to the movies.
  `,
});

const spendingAnalysisFlow = ai.defineFlow(
  {
    name: 'spendingAnalysisFlow',
    inputSchema: SpendingAnalysisInputSchema,
    outputSchema: SpendingAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
