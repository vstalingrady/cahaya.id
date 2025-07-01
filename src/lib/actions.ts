'use server';

import { personalizedSavingSuggestions, PersonalizedSavingSuggestionsOutput } from "@/ai/flows/saving-opportunities";
import { type Transaction } from "./data";

export async function getSavingSuggestions(
  transactions: Transaction[]
): Promise<PersonalizedSavingSuggestionsOutput & { error?: string }> {
  try {
    const spendingData = transactions
        .filter(t => t.amount < 0) // Only consider expenses
        .map(t => `${t.date}: ${t.description} (${t.category}) - ${Math.abs(t.amount)}`)
        .join('\n');

    if (transactions.length === 0) {
        return { 
            error: "No transaction data available to analyze.",
            spenderType: "N/A",
            summary: "We need some transaction data to give you suggestions.",
            suggestions: [],
            investmentPlan: "",
            localDeals: [],
         };
    }
    
    // Estimate monthly income by finding the largest single income transaction.
    const monthlyIncome = transactions
        .filter(t => t.amount > 0)
        .reduce((max, t) => t.amount > max ? t.amount : max, 0);

    const result = await personalizedSavingSuggestions({ 
        spendingData,
        monthlyIncome: monthlyIncome || 0, // Pass 0 if no income found
        location: "Jakarta, Indonesia", // Hardcode location for prototype
    });
    return result;

  } catch (error) {
    console.error("Error getting saving suggestions:", error);
    return { 
        error: "Failed to get AI-powered suggestions. Please try again later.",
        spenderType: "Error",
        summary: "An unexpected error occurred while fetching suggestions.",
        suggestions: [],
        investmentPlan: "Could not generate an investment plan at this time.",
        localDeals: ["Could not fetch local deals."],
    };
  }
}
