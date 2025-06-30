'use server';

import { personalizedSavingSuggestions, PersonalizedSavingSuggestionsOutput } from "@/ai/flows/saving-opportunities";
import { type Transaction } from "./data";

export async function getSavingSuggestions(
  transactions: Transaction[]
): Promise<PersonalizedSavingSuggestionsOutput | { error: string }> {
  try {
    const spendingData = transactions
        .filter(t => t.amount < 0) // Only consider expenses
        .map(t => `${t.date}: ${t.description} (${t.category}) - ${Math.abs(t.amount)}`)
        .join('\n');

    if (!spendingData) {
        return { suggestions: ["No spending data available to analyze."] };
    }
    
    const result = await personalizedSavingSuggestions({ spendingData });
    return result;

  } catch (error) {
    console.error("Error getting saving suggestions:", error);
    return { error: "Failed to get AI-powered suggestions. Please try again later." };
  }
}
