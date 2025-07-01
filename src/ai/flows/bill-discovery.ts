'use server';

/**
 * @fileOverview An AI flow for discovering recurring bills from transaction history.
 *
 * - discoverRecurringBills - A function that identifies potential monthly bills.
 * - BillDiscoveryInput - The input type for the discoverRecurringBills function.
 * - BillDiscoveryOutput - The return type for the discoverRecurringBills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BillDiscoveryInputSchema = z.object({
  transactionHistory: z
    .string()
    .describe('A list of transaction descriptions, amounts, and dates.'),
});
export type BillDiscoveryInput = z.infer<typeof BillDiscoveryInputSchema>;

const PotentialBillSchema = z.object({
    name: z.string().describe("The name of the merchant or service for the recurring bill (e.g., 'Netflix', 'Spotify')."),
    estimatedAmount: z.number().describe("The estimated monthly amount of the bill in IDR."),
    firstDetectedDate: z.string().describe("The date of the first detected transaction for this bill in 'YYYY-MM-DD' format."),
});

const BillDiscoveryOutputSchema = z.object({
  potentialBills: z
    .array(PotentialBillSchema)
    .describe('A list of potential recurring bills detected from the transaction history.'),
});
export type BillDiscoveryOutput = z.infer<typeof BillDiscoveryOutputSchema>;

export async function discoverRecurringBills(
  input: BillDiscoveryInput
): Promise<BillDiscoveryOutput> {
  return billDiscoveryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'billDiscoveryPrompt',
  input: {schema: BillDiscoveryInputSchema},
  output: {schema: BillDiscoveryOutputSchema},
  prompt: `You are an intelligent financial assistant. Your task is to analyze a user's transaction history to identify potential recurring monthly bills and subscriptions.

**Analysis Criteria:**
- Look for payments that occur on a regular basis (roughly monthly).
- The merchant name should be consistent (e.g., "Netflix", "Spotify", "BPJS", "PLN Postpaid").
- The amount should be relatively stable from month to month.
- Ignore income transactions, transfers between user's own accounts, and one-off large purchases.

**User's Transaction History:**
{{{transactionHistory}}}

**Your Task:**
Based on the criteria above, identify all potential recurring bills from the transaction history provided. For each potential bill, extract the merchant name, the typical transaction amount, and the date of the first time you see it.

Return the results in the specified JSON format. If no recurring bills are found, return an empty array.
`,
});

const billDiscoveryFlow = ai.defineFlow(
  {
    name: 'billDiscoveryFlow',
    inputSchema: BillDiscoveryInputSchema,
    outputSchema: BillDiscoveryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
