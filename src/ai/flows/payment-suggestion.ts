'use server';

/**
 * @fileOverview An AI flow for suggesting a payment plan across multiple accounts.
 *
 * - suggestPayment - A function that creates a split-payment recommendation.
 * - PaymentSuggestionInput - The input type for the suggestPayment function.
 * - PaymentSuggestionOutput - The return type for the suggestPayment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AccountInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  balance: z.number(),
  type: z.enum(['bank', 'e-wallet', 'investment', 'loan']),
});

const PaymentSuggestionInputSchema = z.object({
  paymentAmount: z.number().describe('The total amount of the payment to be made in IDR.'),
  availableAccounts: z.array(AccountInfoSchema).describe('A list of the user\'s available accounts with their current balances.'),
});
export type PaymentSuggestionInput = z.infer<typeof PaymentSuggestionInputSchema>;

const PaymentStepSchema = z.object({
    accountId: z.string().describe("The ID of the account to use."),
    accountName: z.string().describe("The name of the account to use."),
    amountToUse: z.number().describe("The amount in IDR to be paid from this account."),
});

const PaymentSuggestionOutputSchema = z.object({
    isSufficient: z.boolean().describe("Whether the user has enough total funds across all accounts to make the payment."),
    suggestion: z.string().describe("A concise, friendly, and clear explanation of the suggested payment plan. Explain WHY this plan is smart (e.g., 'Let's use your e-wallet for the small part and your main bank account for the rest to keep your daily cash flexible.')"),
    paymentPlan: z.array(PaymentStepSchema).describe("A step-by-step plan detailing how much to pay from each account. This should be empty if funds are insufficient."),
});
export type PaymentSuggestionOutput = z.infer<typeof PaymentSuggestionOutputSchema>;

export async function suggestPayment(
  input: PaymentSuggestionInput
): Promise<PaymentSuggestionOutput> {
  return paymentSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'paymentSuggestionPrompt',
  input: {schema: PaymentSuggestionInputSchema},
  output: {schema: PaymentSuggestionOutputSchema},
  prompt: `You are a savvy financial assistant for CuanFlex. Your task is to create a smart payment plan for a user who wants to make a purchase, potentially by splitting the payment across their linked accounts.

**User's Goal:**
- Make a payment of: **IDR {{paymentAmount}}**

**Available Accounts & Balances:**
{{#each availableAccounts}}
- {{name}} ({{type}}): IDR {{balance}}
{{/each}}

**Your Strategy:**
1.  **Check Sufficiency:** First, determine if the total balance across all non-loan accounts is enough to cover the payment. Set \`isSufficient\` accordingly. If not, the \`suggestion\` should gently inform the user, and the \`paymentPlan\` array must be empty.
2.  **Create a Smart Plan (if sufficient):**
    *   Prioritize using e-wallet balances for smaller portions of the payment to preserve liquidity in main bank accounts, unless the e-wallet is the only sufficient source.
    *   Avoid completely draining any single account if possible, leaving a small buffer (e.g., IDR 50,000) for bank accounts and (e.g., IDR 10,000) for e-wallets.
    *   Do not use accounts with a 'loan' type for payments.
    *   Construct a clear, step-by-step \`paymentPlan\` array.
3.  **Write the Suggestion Narrative:**
    *   Create a friendly and encouraging \`suggestion\` text. Explain the logic of your plan in simple terms. For example: "You've got this! Let's split it up. We'll use your GoPay for the smaller part to keep your main BCA account ready for other things."

**Important:** Generate the output in the specified JSON format, filling all fields.
`,
});

const paymentSuggestionFlow = ai.defineFlow(
  {
    name: 'paymentSuggestionFlow',
    inputSchema: PaymentSuggestionInputSchema,
    outputSchema: PaymentSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
