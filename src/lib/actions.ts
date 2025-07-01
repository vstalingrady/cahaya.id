'use server';

import { personalizedSavingSuggestions, PersonalizedSavingSuggestionsOutput } from "@/ai/flows/saving-opportunities";
import { budgetAnalysis, BudgetAnalysisOutput } from "@/ai/flows/budget-analysis";
import { discoverRecurringBills, BillDiscoveryOutput } from "@/ai/flows/bill-discovery";
import { type Transaction, type Budget } from "./data";
import { isWithinInterval } from 'date-fns';

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

export async function getBudgetAnalysis(
    budgets: Budget[],
    transactions: Transaction[]
): Promise<BudgetAnalysisOutput & { error?: string }> {
    try {
        if (budgets.length === 0) {
            return {
                error: "No budgets created. Please create a budget to get an analysis.",
                coachTitle: "N/A",
                summary: "You haven't set any budgets yet. Create one to get started!",
                suggestions: [],
                proTip: "",
            };
        }

        // Calculate spending for each budget
        const budgetData = budgets.map(budget => {
            const budgetInterval = { start: new Date(budget.startDate), end: new Date(budget.endDate) };
            const spent = transactions
                .filter(t =>
                    t.category === budget.category &&
                    t.amount < 0 &&
                    isWithinInterval(new Date(t.date), budgetInterval)
                )
                .reduce((acc, t) => acc + Math.abs(t.amount), 0);
            
            return `${budget.name} (${budget.category}): Budget is ${formatCurrency(budget.amount)}, Spent ${formatCurrency(spent)}.`;
        }).join('\n');

        const result = await budgetAnalysis({ budgetData });
        return result;

    } catch (error) {
        console.error("Error getting budget analysis:", error);
        return {
            error: "Failed to get AI-powered analysis. Please try again later.",
            coachTitle: "Error",
            summary: "An unexpected error occurred while fetching analysis.",
            suggestions: [],
            proTip: "Could not generate a tip at this time.",
        };
    }
}

export async function getBillSuggestions(
  transactions: Transaction[]
): Promise<BillDiscoveryOutput & { error?: string }> {
  try {
    const transactionHistory = transactions
      .filter(t => t.amount < 0) // Only consider expenses
      .map(t => `${t.date}: ${t.description} - ${Math.abs(t.amount)}`)
      .join('\n');

    if (transactions.length === 0) {
      return {
        potentialBills: [],
      };
    }

    const result = await discoverRecurringBills({ transactionHistory });
    return result;

  } catch (error) {
    console.error("Error getting bill suggestions:", error);
    return {
      error: "Failed to get AI-powered bill suggestions. Please try again later.",
      potentialBills: [],
    };
  }
}

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
}).format(value);
