
'use server';

import { personalizedSavingSuggestions, PersonalizedSavingSuggestionsOutput } from "@/ai/flows/saving-opportunities";
import { budgetAnalysis, BudgetAnalysisOutput } from "@/ai/flows/budget-analysis";
import { discoverRecurringBills, BillDiscoveryOutput } from "@/ai/flows/bill-discovery";
import { getAiChatResponse as getAiChatResponseFlow, type ChatMessage } from "@/ai/flows/chat-flow";
import {
  type Transaction,
  type Account,
  type Budget,
  type Vault,
  type Beneficiary,
  type FavoriteTransaction,
} from "./data";
import {
  accounts as seedAccounts,
  transactions as seedTransactions,
  beneficiaries as seedBeneficiaries,
  budgets as seedBudgets,
  vaults as seedVaults,
  favoriteTransactions as seedFavoriteTransactions,
} from './data-seed';

import { isWithinInterval, format } from 'date-fns';
import { z } from 'zod';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, db } from './firebase';
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc, collection, writeBatch, getDocs, addDoc, query, where, updateDoc } from "firebase/firestore";
import { headers } from 'next/headers';
import { db as mockApiDb } from './mock-api-db';
import { type MockAccount, type MockTransaction } from './mock-api-db';


/**
 * Seeds initial data for a new user in Firestore.
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

    // Seed Budgets
    seedBudgets.forEach(budget => {
        const budgetDocRef = doc(db, 'users', uid, 'budgets', budget.id);
        batch.set(budgetDocRef, budget);
    });

    // Seed Vaults
    seedVaults.forEach(vault => {
        const vaultDocRef = doc(db, 'users', uid, 'vaults', vault.id);
        batch.set(vaultDocRef, vault);
    });

    // Seed Beneficiaries
    seedBeneficiaries.forEach(beneficiary => {
        const beneficiaryDocRef = doc(db, 'users', uid, 'beneficiaries', beneficiary.id);
        batch.set(beneficiaryDocRef, beneficiary);
    });

    // Seed Favorite Transactions
    seedFavoriteTransactions.forEach(favorite => {
        const favoriteDocRef = doc(db, 'users', uid, 'favorites', favorite.id);
        batch.set(favoriteDocRef, favorite);
    });

    await batch.commit();
    console.log(`Successfully seeded initial data for user ${uid}`);
  } catch (error) {
    console.error('Error seeding initial data for user:', error);
  }
}

export async function completeUserProfile(uid: string, fullName: string, email: string, phone: string) {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: uid,
        fullName: fullName,
        email: email,
        phone: phone,
        createdAt: new Date(),
      });
      await seedInitialDataForUser(uid);
    } else {
      console.log(`User ${uid} already exists. Skipping data seeding.`);
    }
  } catch (error: any) {
    console.error("Error creating user document in Firestore:", error);
    if (error.code === 'permission-denied' || (error.message && error.message.includes('Cloud Firestore API has not been used'))) {
      throw new Error("Account creation failed: The Firestore database isn't enabled for this project. Please visit the Firebase console, go to the Firestore Database section, and enable it.");
    }
    throw new Error(error.message || "Failed to create user profile in database.");
  }
}

const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export async function login(prevState: any, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const ip = headers().get('x-forwarded-for') ?? 'Unknown';
    const userAgent = headers().get('user-agent') ?? 'Unknown';

    await setDoc(doc(db, "users", user.uid, "login_history", new Date().toISOString()), {
      timestamp: new Date(),
      ipAddress: ip,
      userAgent: userAgent,
    });

  } catch (err: any) {
    if (err.code === 'permission-denied' || (err.message && err.message.includes('Cloud Firestore API has not been used'))) {
      return { success: false, message: "Login failed: The Firestore database isn't enabled for this project. Please enable it in the Firebase console." };
    }
    if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
      return { success: false, message: 'Invalid email or password.' };
    } else if (err.code && err.code.includes('app-check')) {
      console.error("App Check validation failed during login.");
      return { success: false, message: 'App Check validation failed. Ensure your debug token is configured correctly.' };
    }
    return { success: false, message: 'An unknown error occurred. Please try again.' };
  }

  return { success: true, message: null, errors: {} };
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
    return { accessToken: tokenInfo.access_token };
  } catch (error) {
    console.error("[Server Action exchangePublicToken] Error:", error);
    return { error: 'An internal server error occurred.' };
  }
}

export async function updateUserProfile(
  uid: string,
  data: { displayName?: string; email?: string; phone?: string; photoURL?: string }
) {
  if (!uid) {
    throw new Error("User is not authenticated.");
  }

  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.uid !== uid) {
    throw new Error("Authentication mismatch.");
  }

  try {
    const { displayName, email, phone, photoURL } = data;

    // Prepare data for Firebase Auth update (only displayName and photoURL can be updated here)
    const authUpdateData: { displayName?: string; photoURL?: string } = {};
    if (displayName !== undefined) authUpdateData.displayName = displayName;
    if (photoURL !== undefined) authUpdateData.photoURL = photoURL;

    if (Object.keys(authUpdateData).length > 0) {
      await updateProfile(currentUser, authUpdateData);
    }

    // Prepare data for Firestore update
    const firestoreUpdateData: { [key: string]: string } = {};
    if (displayName !== undefined) firestoreUpdateData.fullName = displayName;
    if (email !== undefined) firestoreUpdateData.email = email;
    if (phone !== undefined) firestoreUpdateData.phone = phone;
    if (photoURL !== undefined) firestoreUpdateData.photoURL = photoURL;

    if (Object.keys(firestoreUpdateData).length > 0) {
      const userDocRef = doc(db, "users", uid);
      await updateDoc(userDocRef, firestoreUpdateData);
    }

    // Revalidate the path to ensure the UI updates with new data
    revalidatePath('/profile');
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update profile.");
  }
}


// ---- Data Fetching Actions ----

export async function getDashboardData(
  userId: string
): Promise<{ accounts: Account[]; transactions: Transaction[] }> {
  if (!userId) {
    console.error('getDashboardData called without a userId.');
    return { accounts: [], transactions: [] };
  }
  try {
    const accountsCol = collection(db, 'users', userId, 'accounts');
    const accountsSnapshot = await getDocs(accountsCol);
    const fetchedAccounts = accountsSnapshot.docs.map(
      doc => doc.data() as Account
    );

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
    return { accounts: [], transactions: [] };
  }
}

export async function getAccountDetails(userId: string, accountId: string): Promise<{ account: Account | null, transactions: Transaction[] }> {
    if (!userId || !accountId) return { account: null, transactions: [] };
    try {
        const accountDocRef = doc(db, 'users', userId, 'accounts', accountId);
        const accountDoc = await getDoc(accountDocRef);

        if (!accountDoc.exists()) return { account: null, transactions: [] };
        
        const account = accountDoc.data() as Account;

        const transactionsCol = collection(db, 'users', userId, 'transactions');
        const q = query(transactionsCol, where('accountId', '==', accountId));
        const transactionsSnapshot = await getDocs(q);
        const transactions = transactionsSnapshot.docs.map(doc => doc.data() as Transaction);

        return { account, transactions };
    } catch (error) {
        console.error('Error fetching account details:', error);
        return { account: null, transactions: [] };
    }
}

// ---- Budget Actions ----

export async function getBudgets(userId: string): Promise<Budget[]> {
  if (!userId) return [];
  const budgetsCol = collection(db, 'users', userId, 'budgets');
  const snapshot = await getDocs(budgetsCol);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Budget));
}

export async function addBudget(userId: string, values: Omit<Budget, 'id'>) {
    if (!userId) throw new Error("User not authenticated.");
    const budgetsCol = collection(db, 'users', userId, 'budgets');
    await addDoc(budgetsCol, values);
    revalidatePath('/budgets');
}

export async function deleteBudget(userId: string, budgetId: string) {
    if (!userId || !budgetId) return;
    const budgetDocRef = doc(db, 'users', userId, 'budgets', budgetId);
    await deleteDoc(budgetDocRef);
    revalidatePath('/budgets');
}

export async function getUniqueTransactionCategories(userId: string): Promise<string[]> {
    if (!userId) return [];
    const { transactions } = await getDashboardData(userId);
    const categories = new Set(transactions.map(t => t.category));
    return Array.from(categories).filter(c => c !== 'Income');
}


// ---- Vault Actions ----
export async function getVaults(userId: string): Promise<Vault[]> {
  if (!userId) return [];
  const vaultsCol = collection(db, 'users', userId, 'vaults');
  const snapshot = await getDocs(vaultsCol);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Vault));
}

export async function getVaultDetails(userId: string, vaultId: string): Promise<Vault | null> {
    if (!userId || !vaultId) return null;
    const vaultDocRef = doc(db, 'users', userId, 'vaults', vaultId);
    const docSnap = await getDoc(vaultDocRef);
    return docSnap.exists() ? { ...docSnap.data(), id: docSnap.id } as Vault : null;
}

export async function addVault(userId: string, values: Omit<Vault, 'id' | 'currentAmount'>) {
    if (!userId) throw new Error("User not authenticated.");
    const newVault: Omit<Vault, 'id'> = { ...values, currentAmount: 0 };
    const vaultsCol = collection(db, 'users', userId, 'vaults');
    await addDoc(vaultsCol, newVault);
    revalidatePath('/vaults');
}

export async function deleteVault(userId: string, vaultId: string) {
    if (!userId || !vaultId) return;
    const vaultDocRef = doc(db, 'users', userId, 'vaults', vaultId);
    await deleteDoc(vaultDocRef);
    revalidatePath('/vaults');
}

// ---- Beneficiary Actions ----
export async function getBeneficiaries(userId: string): Promise<Beneficiary[]> {
  if (!userId) return [];
  const beneficiariesCol = collection(db, 'users', userId, 'beneficiaries');
  const snapshot = await getDocs(beneficiariesCol);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Beneficiary));
}

export async function addBeneficiary(userId: string, values: Omit<Beneficiary, 'id'>) {
    if (!userId) throw new Error("User not authenticated.");
    const beneficiariesCol = collection(db, 'users', userId, 'beneficiaries');
    await addDoc(beneficiariesCol, values);
    revalidatePath('/transfer/recipients');
    redirect('/transfer/recipients');
}

// ---- Favorites Actions ----
export async function getFavorites(userId: string): Promise<FavoriteTransaction[]> {
  if (!userId) return [];
  const favoritesCol = collection(db, 'users', userId, 'favorites');
  const snapshot = await getDocs(favoritesCol);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as FavoriteTransaction));
}

export async function addFavorite(userId: string, favorite: Omit<FavoriteTransaction, 'id'>) {
    if (!userId) throw new Error("User not authenticated.");
    const favoritesCol = collection(db, 'users', userId, 'favorites');
    const newDoc = await addDoc(favoritesCol, favorite);
    revalidatePath('/transfer');
    return { ...favorite, id: newDoc.id };
}

export async function removeFavorite(userId: string, favoriteId: string) {
    if (!userId || !favoriteId) return;
    const favoriteDocRef = doc(db, 'users', userId, 'favorites', favoriteId);
    await deleteDoc(favoriteDocRef);
    revalidatePath('/transfer');
}

// ---- AI Actions ----

export async function getSavingSuggestions(transactions: Transaction[]): Promise<PersonalizedSavingSuggestionsOutput & { error?: string }> {
  try {
    const spendingData = transactions
        .filter(t => t.amount < 0)
        .map(t => `${t.date}: ${t.description} (${t.category}) - ${Math.abs(t.amount)}`)
        .join('\n');

    if (transactions.length === 0) {
        return { 
            error: "No transaction data available to analyze.", financialHealthScore: 0, spenderType: "N/A",
            summary: "We need some transaction data to give you suggestions.", suggestions: [],
            investmentPlan: "", localDeals: [],
         };
    }
    
    const monthlyIncome = transactions
        .filter(t => t.amount > 0)
        .reduce((max, t) => t.amount > max ? t.amount : max, 0);

    const result = await personalizedSavingSuggestions({ 
        spendingData, monthlyIncome: monthlyIncome || 0, location: "Jakarta, Indonesia",
    });
    return result;

  } catch (error) {
    console.error("Error getting saving suggestions:", error);
    return { 
        error: "Failed to get AI-powered suggestions.", financialHealthScore: 0, spenderType: "Error",
        summary: "An unexpected error occurred while fetching suggestions.", suggestions: [],
        investmentPlan: "Could not generate an investment plan.", localDeals: [],
    };
  }
}

export async function getBudgetAnalysis(userId: string): Promise<BudgetAnalysisOutput & { error?: string }> {
    try {
        const budgets = await getBudgets(userId);
        const { transactions } = await getDashboardData(userId);

        if (budgets.length === 0) {
            return {
                error: "No budgets created.", coachTitle: "N/A",
                summary: "You haven't set any budgets yet. Create one to get started!",
                suggestions: [], proTip: "",
            };
        }

        const budgetData = budgets.map(budget => {
            const budgetInterval = { start: new Date(budget.startDate), end: new Date(budget.endDate) };
            const spent = transactions
                .filter(t =>
                    t.category === budget.category && t.amount < 0 &&
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
            error: "Failed to get AI-powered analysis.", coachTitle: "Error",
            summary: "An unexpected error occurred while fetching analysis.",
            suggestions: [], proTip: "Could not generate a tip.",
        };
    }
}

export async function getBillSuggestions(transactions: Transaction[]): Promise<BillDiscoveryOutput & { error?: string }> {
  try {
    const transactionHistory = transactions
      .filter(t => t.amount < 0)
      .map(t => `${t.date}: ${t.description} - ${Math.abs(t.amount)}`)
      .join('\n');

    if (transactions.length === 0) {
      return { potentialBills: [] };
    }

    const result = await discoverRecurringBills({ transactionHistory });
    return result;

  } catch (error) {
    console.error("Error getting bill suggestions:", error);
    return {
      error: "Failed to get AI-powered bill suggestions.",
      potentialBills: [],
    };
  }
}

export async function getAiChatResponse(
  history: ChatMessage[]
): Promise<string> {
  try {
    const response = await getAiChatResponseFlow({history});
    return response;
  } catch (error) {
    console.error("Error getting AI chat response:", error);
    return "I'm sorry, I encountered an error and can't respond right now. Please try again later.";
  }
}

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
}).format(value);

// This action is no longer needed as linking is handled by the mock API flow.
// It's kept here to avoid breaking changes if it was referenced, but it's now a no-op.
export async function linkAccount(prevState: any, formData: FormData) {
  redirect('/dashboard?new_account=true');
}

    