'use server';

import { personalizedSavingSuggestions, PersonalizedSavingSuggestionsOutput } from "@/ai/flows/saving-opportunities";
import { budgetAnalysis, BudgetAnalysisOutput } from "@/ai/flows/budget-analysis";
import { discoverRecurringBills, BillDiscoveryOutput } from "@/ai/flows/bill-discovery";
import {
  type Transaction,
  type Account,
  type Budget,
  type FinancialInstitution,
  accounts as seedAccounts,
  transactions as seedTransactions,
} from "./data";
import { isWithinInterval } from 'date-fns';
import { z } from 'zod';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, db } from './firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc, collection, writeBatch, getDocs } from "firebase/firestore";
import { headers } from 'next/headers';
import { db as mockApiDb } from './mock-api-db';
import { type MockAccount, type MockTransaction } from './mock-api-db';


/**
 * Seeds initial data (accounts, transactions) for a new user in Firestore.
 * This is for demonstration purposes to give new users sample data to explore.
 */
async function seedInitialDataForUser(uid: string) {
  try {
    const batch = writeBatch(db);

    // Seed Accounts
    seedAccounts.forEach(account => {
      const accountDocRef = doc(db, 'users', uid, 'accounts', account.id);
      batch.set(accountDocRef, account);
    });

    // Seed Transactions
    seedTransactions.forEach(transaction => {
      const transactionDocRef = doc(db, 'users', uid, 'transactions', transaction.id);
      batch.set(transactionDocRef, transaction);
    });

    await batch.commit();
    console.log(`Successfully seeded initial data for user ${uid}`);
  } catch (error) {
    console.error('Error seeding initial data for user:', error);
    // Non-critical error, so we don't throw.
  }
}

/**
 * This action is called after a user has authenticated and linked their credentials.
 * Its purpose is to create the user's profile document in Firestore.
 */
export async function completeUserProfile(uid: string, fullName: string, email: string, phone: string) {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    
    // Only seed data if the user document doesn't exist yet.
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: uid,
        fullName: fullName,
        email: email,
        phone: phone,
        createdAt: new Date(),
      });
      // Seed the new user with sample data
      await seedInitialDataForUser(uid);
    } else {
      console.log(`User ${uid} already exists. Skipping data seeding.`);
    }
  } catch (error: any) {
    console.error("Error creating user document in Firestore:", error);
    // Check for the specific Firestore API disabled error
    if (error.code === 'permission-denied' || (error.message && error.message.includes('Cloud Firestore API has not been used'))) {
      throw new Error("Account creation failed: The Firestore database isn't enabled for this project. Please visit the Firebase console, go to the Firestore Database section, and enable it.");
    }
    throw new Error(error.message || "Failed to create user profile in database.");
  }
}

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function login(prevState: any, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Log login history
    const ip = headers().get('x-forwarded-for') ?? 'Unknown';
    const userAgent = headers().get('user-agent') ?? 'Unknown';

    await setDoc(doc(db, "users", user.uid, "login_history", new Date().toISOString()), {
      timestamp: new Date(),
      ipAddress: ip,
      userAgent: userAgent,
    });

  } catch (err: any) {
    if (err.code === 'permission-denied' || (err.message && err.message.includes('Cloud Firestore API has not been used'))) {
      return { message: "Login failed: The Firestore database isn't enabled for this project. Please enable it in the Firebase console." };
    }
    if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
      return { message: 'Invalid email or password.' };
    } else if (err.code && err.code.includes('app-check')) {
      console.error("App Check validation failed during login.");
      return { message: 'App Check validation failed. Ensure your debug token is configured correctly.' };
    }
    return { message: 'An unknown error occurred. Please try again.' };
  }

  redirect('/dashboard');
}


// Placeholder for a database or session update
const addNewAccountToDB = async (institution: FinancialInstitution) => {
  console.log('Adding new account to the database:', institution);
  // In a real app, you would save this to Firestore or your database
  // For this prototype, we'll just log it.
  // You might also fetch the real balance here.
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  return { success: true, accountId: `${institution.slug}-${Math.random().toString(36).substring(7)}` };
}

const LinkAccountSchema = z.object({
  institutionSlug: z.string().min(1, "Institution is required."),
  // In a real app, you'd have more robust validation
  userId: z.string().optional(),
  password: z.string().optional(),
  phone: z.string().optional(),
});

export async function linkAccount(prevState: any, formData: FormData) {
  const validatedFields = LinkAccountSchema.safeParse({
    institutionSlug: formData.get('institutionSlug'),
    userId: formData.get('userId'),
    password: formData.get('password'),
    phone: formData.get('phone'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { institutionSlug } = validatedFields.data;
  // Find institution details from our data file
  // In a real app, you might fetch this from a database
  const { financialInstitutions } = await import('./data');
  const institution = financialInstitutions.find(inst => inst.slug === institutionSlug);

  if (!institution) {
    return { message: 'Institution not found.' };
  }

  console.log('Simulating linking account with:', validatedFields.data);
  
  // Here you would typically call a financial data aggregator API (e.g., Plaid, Brick)
  // with the user's credentials to securely link the account.
  // For this prototype, we'll just simulate a successful link.
  
  const result = await addNewAccountToDB(institution);

  if (result.success) {
    // Revalidate the dashboard path to show the new account
    revalidatePath('/dashboard');
    // Redirect to the dashboard
    redirect('/dashboard?new_account=true');
  } else {
    return { message: 'Failed to link account. Please try again.' };
  }
}


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
            financialHealthScore: 0,
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
        financialHealthScore: 0,
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

export async function exchangePublicToken(publicToken: string | null) {
  if (!publicToken) {
    return { error: 'Invalid public token provided.' };
  }

  try {
    const tokenInfo = mockApiDb.exchangePublicToken(publicToken);

    if (tokenInfo.error) {
      return { error: 'The public token is invalid or expired.' };
    }

    // Success
    return { accessToken: tokenInfo.access_token };

  } catch (error) {
    console.error("[Server Action exchangePublicToken] Error:", error);
    return { error: 'An internal server error occurred.' };
  }
}

// ---- Live Data Fetching Actions ----

export async function getDashboardData(
  userId: string
): Promise<{ accounts: Account[]; transactions: Transaction[] }> {
  if (!userId) {
    console.error('getDashboardData called without a userId.');
    return { accounts: [], transactions: [] };
  }

  try {
    // 1. Fetch accounts from Firestore
    const accountsCol = collection(db, 'users', userId, 'accounts');
    const accountsSnapshot = await getDocs(accountsCol);
    const fetchedAccounts = accountsSnapshot.docs.map(
      doc => doc.data() as Account
    );

    // 2. Fetch transactions from Firestore
    const transactionsCol = collection(db, 'users', userId, 'transactions');
    const transactionsSnapshot = await getDocs(transactionsCol);
    const fetchedTransactions = transactionsSnapshot.docs.map(
      doc => doc.data() as Transaction
    );

    return {
      accounts: fetchedAccounts,
      transactions: fetchedTransactions,
    };
  } catch (error) {
    console.error('Error in getDashboardData from Firestore:', error);
    // In case of error, return empty arrays to prevent app crash
    return { accounts: [], transactions: [] };
  }
}


const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
}).format(value);
