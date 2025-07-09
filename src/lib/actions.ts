/**
 * @file This file contains the server-side actions for the application.
 * It follows the React Server Actions pattern, allowing client components
 * to invoke these functions directly on the server.
 *
 * It also serves as the interface between the frontend and the Genkit AI flows,
 * ensuring that all AI-related logic is handled securely on the server.
 */
'use server';

import {
  discoverRecurringBills,
  type BillDiscoveryOutput,
} from '@/ai/flows/bill-discovery';
import {
  budgetAnalysis,
  type BudgetAnalysisOutput,
} from '@/ai/flows/budget-analysis';
import {
  getAiChatResponse as getAiChatResponseFlow,
  type ChatMessage,
} from '@/ai/flows/chat-flow';
import {
  personalizedSavingSuggestions,
  type PersonalizedSavingSuggestionsOutput,
} from '@/ai/flows/saving-opportunities';
import { verifyPin } from '@/ai/flows/verify-pin';
import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  writeBatch,
  Timestamp,
  deleteDoc,
  orderBy,
  limit,
  addDoc,
} from 'firebase/firestore';
import {
  Account,
  Transaction,
  Vault,
  Beneficiary,
  Budget,
  FavoriteTransaction,
} from './data';
import {
  accounts as seedAccounts,
  transactions as seedTransactions,
  vaults as seedVaults,
  beneficiaries as seedBeneficiaries,
  budgets as seedBudgets,
  favoriteTransactions as seedFavorites,
} from './data-seed';

import { revalidatePath } from 'next/cache';
import * as bcrypt from 'bcrypt';
import { format, isWithinInterval } from 'date-fns';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);

// ---- User Profile & Onboarding Actions ----

/**
 * Checks if a user has completed the onboarding process (i.e., set a PIN).
 * @param userId The UID of the user to check.
 * @returns An object indicating if onboarding is complete.
 */
export async function checkUserOnboardingStatus(userId: string): Promise<{ onboardingComplete: boolean }> {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const userData = docSnap.data();
    // A user is considered onboarded if they have a hashedPin or the flag is explicitly true.
    return { onboardingComplete: !!userData.hashedPin || userData.hasCompletedOnboarding === true };
  }
  
  // If the user document doesn't exist yet (race condition), assume not onboarded.
  return { onboardingComplete: false };
}

/**
 * Creates a new user profile in Firestore. This is called during the final
 * step of the sign-up process.
 *
 * @param {string} userId - The user's UID from Firebase Auth.
 * @param {string} fullName - The user's full name.
 * @param {string} email - The user's email address.
 * @param {string} phoneNumber - The user's phone number.
 * @returns {Promise<{success: boolean, error?: string}>} - The result of the operation.
 */
export async function completeUserProfile(
  userId: string,
  fullName: string,
  email: string | null,
  phoneNumber: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      {
        uid: userId,
        fullName,
        email,
        phoneNumber,
        createdAt: Timestamp.now(),
        hasCompletedOnboarding: false,
      },
      { merge: true }
    );

    return { success: true };
  } catch (error) {
    console.error('Error completing user profile:', error);
    return { success: false, error: 'Failed to save user profile.' };
  }
}

/**
 * Sets the user's 6-digit PIN for app access and transaction authorization.
 *
 * @param {string} userId - The user's UID.
 * @param {string} pin - The 6-digit PIN.
 * @returns {Promise<{success: boolean, error?: string}>} - The result of the operation.
 */
export async function setSecurityPin(
  userId: string,
  pin: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const userRef = doc(db, 'users', userId);
    const saltRounds = 10;
    const hashedPin = await bcrypt.hash(pin, saltRounds);

    await updateDoc(userRef, {
      hashedPin: hashedPin, // Store the hashed pin
      hasCompletedOnboarding: true, // This is the final step
    });

    // Seed the user's account with mock data upon completing onboarding.
    await seedUserData(userId);

    // Revalidate all data-heavy paths
    revalidatePath('/dashboard');
    revalidatePath('/history');
    revalidatePath('/budgets');
    revalidatePath('/vaults');
    revalidatePath('/insights');
    revalidatePath('/transfer');

    return { success: true };
  } catch (error) {
    console.error('Error setting security PIN:', error);
    return { success: false, error: 'Failed to set security PIN.' };
  }
}

/**
 * Verifies a user's PIN against the one stored in Firestore.
 * This is a server-side action that calls a Genkit flow.
 *
 * @param {string} userId - The user's UID.
 * @param {string} pinAttempt - The PIN entered by the user.
 * @returns {Promise<{success: boolean, reason?: string}>} - The result of the verification.
 */
export async function verifySecurityPin(
  userId: string,
  pinAttempt: string
): Promise<{ success: boolean; reason?: string }> {
  try {
    const result = await verifyPin({ userId, pinAttempt });
    return result;
  } catch (error) {
    console.error('Error verifying PIN in action:', error);
    return {
      success: false,
      reason: 'An unexpected server error occurred during PIN verification.',
    };
  }
}

/**
 * Handles actions to perform when a user signs in. It checks if a user record
 * exists and creates one if it doesn't.
 * @param user The Firebase user object.
 */
export async function handleSignIn(user: {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
}) {
  const userRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    console.log(`New user detected: ${user.uid}. Creating Firestore record.`);
    await setDoc(userRef, {
      uid: user.uid,
      fullName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      createdAt: Timestamp.now(),
      hasCompletedOnboarding: false,
    });
  } else {
    // Optional: Update user info on every login
    // await updateDoc(userRef, { lastLogin: Timestamp.now() });
  }

  // Record the login event for security auditing.
  const loginHistoryRef = collection(db, 'users', user.uid, 'login_history');
  await addDoc(loginHistoryRef, {
    timestamp: Timestamp.now(),
    ipAddress: '0.0.0.0', // In a real app, get this from request headers
    userAgent: 'Unknown', // In a real app, get this from request headers
  });
}

// ---- Data Seeding Actions ----

/**
 * Seeds a new user's account with mock financial data for demonstration purposes.
 * This function uses a batched write to perform all operations atomically.
 *
 * @param {string} userId - The UID of the user to seed data for.
 */
export async function seedUserData(userId: string) {
  const batch = writeBatch(db);

  // Seed accounts
  seedAccounts.forEach(account => {
    const accountRef = doc(db, 'users', userId, 'accounts', account.id);
    batch.set(accountRef, account);
  });

  // Seed transactions
  seedTransactions.forEach(transaction => {
    const transactionRef = doc(
      db,
      'users',
      userId,
      'transactions',
      transaction.id
    );
    batch.set(transactionRef, transaction);
  });

  // Seed vaults
  seedVaults.forEach(vault => {
    const vaultRef = doc(db, 'users', userId, 'vaults', vault.id);
    batch.set(vaultRef, vault);
  });

  // Seed beneficiaries
  seedBeneficiaries.forEach(beneficiary => {
    const beneficiaryRef = doc(
      db,
      'users',
      userId,
      'beneficiaries',
      beneficiary.id
    );
    batch.set(beneficiaryRef, beneficiary);
  });

  // Seed budgets
  seedBudgets.forEach(budget => {
    const budgetRef = doc(db, 'users', userId, 'budgets', budget.id);
    batch.set(budgetRef, budget);
  });

  // Seed favorite transactions
  seedFavorites.forEach(favorite => {
    const favoriteRef = doc(
      db,
      'users',
      userId,
      'favoriteTransactions',
      favorite.id
    );
    batch.set(favoriteRef, favorite);
  });

  await batch.commit();
}

// ---- Data Fetching Actions ----

/**
 * Fetches all necessary data for the main dashboard.
 * @param {string} userId The UID of the logged-in user.
 * @returns {Promise<{accounts: Account[], transactions: Transaction[]}>} An object containing accounts and recent transactions.
 */
export async function getDashboardData(userId: string): Promise<{
  accounts: Account[];
  transactions: Transaction[];
}> {
  try {
    const accounts = await getAccounts(userId);
    const transactions = await getRecentTransactions(userId, 100);
    return { accounts, transactions };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Return empty arrays on error to prevent client-side crashes
    return { accounts: [], transactions: [] };
  }
}

/**
 * Fetches the details for a single account and its associated transactions.
 * @param userId The UID of the logged-in user.
 * @param accountId The ID of the account to fetch.
 * @returns An object containing the account and its transactions.
 */
export async function getAccountDetails(
  userId: string,
  accountId: string
): Promise<{ account: Account | null; transactions: Transaction[] }> {
  const [account, transactions] = await Promise.all([
    getAccountById(userId, accountId),
    getTransactionsByAccountId(userId, accountId),
  ]);
  return { account, transactions };
}

/**
 * Fetches all financial accounts for a given user.
 *
 * @param {string} userId - The user's UID.
 * @returns {Promise<Account[]>} - An array of the user's accounts.
 */
export async function getAccounts(userId: string): Promise<Account[]> {
  const accountsCollection = collection(db, 'users', userId, 'accounts');
  const q = query(accountsCollection);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as Account)
  );
}

/**
 * Fetches a single financial account by its ID.
 * @param {string} userId - The user's UID.
 * @param {string} accountId - The ID of the account to fetch.
 * @returns {Promise<Account | null>} - The account object or null if not found.
 */
export async function getAccountById(
  userId: string,
  accountId: string
): Promise<Account | null> {
  const accountRef = doc(db, 'users', userId, 'accounts', accountId);
  const docSnap = await getDoc(accountRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Account;
  }
  return null;
}

/**
 * Fetches the most recent transactions for a given user, with an optional limit.
 *
 * @param {string} userId - The user's UID.
 * @param {number} [count=100] - The maximum number of transactions to fetch.
 * @returns {Promise<Transaction[]>} - An array of the user's recent transactions.
 */
export async function getRecentTransactions(
  userId: string,
  count: number = 100
): Promise<Transaction[]> {
  const transactionsCollection = collection(
    db,
    'users',
    userId,
    'transactions'
  );
  const q = query(transactionsCollection, orderBy('date', 'desc'), limit(count));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as Transaction)
  );
}

/**
 * Fetches all transactions for a specific account.
 *
 * @param {string} userId - The user's UID.
 * @param {string} accountId - The ID of the account to fetch transactions for.
 * @returns {Promise<Transaction[]>} - An array of transactions for the specified account.
 */
export async function getTransactionsByAccountId(
  userId: string,
  accountId: string
): Promise<Transaction[]> {
  const transactionsCollection = collection(
    db,
    'users',
    userId,
    'transactions'
  );
  const q = query(
    transactionsCollection,
    where('accountId', '==', accountId),
    orderBy('date', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as Transaction)
  );
}

/**
 * Fetches all savings vaults for a given user.
 *
 * @param {string} userId - The user's UID.
 * @returns {Promise<Vault[]>} - An array of the user's savings vaults.
 */
export async function getVaults(userId: string): Promise<Vault[]> {
  const vaultsCollection = collection(db, 'users', userId, 'vaults');
  const querySnapshot = await getDocs(vaultsCollection);
  return querySnapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as Vault)
  );
}

/**
 * Fetches a single savings vault by its ID.
 *
 * @param {string} userId - The user's UID.
 * @param {string} vaultId - The ID of the vault to fetch.
 * @returns {Promise<Vault | null>} - The vault object or null if not found.
 */
export async function getVaultDetails(
  userId: string,
  vaultId: string
): Promise<Vault | null> {
  const vaultRef = doc(db, 'users', userId, 'vaults', vaultId);
  const docSnap = await getDoc(vaultRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Vault;
  }
  return null;
}

/**
 * Fetches all beneficiaries (saved recipients) for a user.
 *
 * @param {string} userId - The user's UID.
 * @returns {Promise<Beneficiary[]>} - An array of the user's beneficiaries.
 */
export async function getBeneficiaries(userId: string): Promise<Beneficiary[]> {
  const beneficiariesCollection = collection(
    db,
    'users',
    userId,
    'beneficiaries'
  );
  const querySnapshot = await getDocs(beneficiariesCollection);
  return querySnapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as Beneficiary)
  );
}

/**
 * Fetches all budgets for a given user.
 *
 * @param {string} userId - The user's UID.
 * @returns {Promise<Budget[]>} - An array of the user's budgets.
 */
export async function getBudgets(userId: string): Promise<Budget[]> {
  const budgetsCollection = collection(db, 'users', userId, 'budgets');
  const querySnapshot = await getDocs(budgetsCollection);
  return querySnapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as Budget)
  );
}

/**
 * Fetches all favorite transactions for a user.
 *
 * @param {string} userId - The user's UID.
 * @returns {Promise<FavoriteTransaction[]>} - An array of the user's favorite transactions.
 */
export async function getFavorites(
  userId: string
): Promise<FavoriteTransaction[]> {
  const favoritesCollection = collection(
    db,
    'users',
    userId,
    'favoriteTransactions'
  );
  const querySnapshot = await getDocs(favoritesCollection);
  return querySnapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as FavoriteTransaction)
  );
}

/**
 * Fetches a user's login history.
 *
 * @param {string} userId - The user's UID.
 * @returns {Promise<any[]>} - An array of login history events.
 */
export async function getLoginHistory(userId: string): Promise<any[]> {
  const historyCollection = collection(db, 'users', userId, 'login_history');
  const q = query(historyCollection, orderBy('timestamp', 'desc'), limit(10));
  const querySnapshot = await getDocs(q);
  const history = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return history;
}

/**
 * Fetches all unique transaction categories for a user to populate budget dropdowns.
 * @param userId
 * @returns
 */
export async function getUniqueTransactionCategories(
  userId: string
): Promise<string[]> {
  const transactions = await getRecentTransactions(userId, 500); // Fetch a good sample size
  const categories = new Set(transactions.map(t => t.category));
  return Array.from(categories);
}

// ---- Data Mutation Actions ----

/**
 * Adds a new savings vault for a user.
 * @param {string} userId - The user's UID.
 * @param {Omit<Vault, 'id'>} vaultData - The data for the new vault.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function addVault(
  userId: string,
  vaultData: Omit<Vault, 'id'>
): Promise<{ success: boolean; error?: string }> {
  try {
    const vaultsCollection = collection(db, 'users', userId, 'vaults');
    await addDoc(vaultsCollection, vaultData);
    revalidatePath('/vaults');
    return { success: true };
  } catch (error) {
    console.error('Error adding vault:', error);
    return { success: false, error: 'Failed to add new vault.' };
  }
}

/**
 * Deletes a savings vault.
 * @param {string} userId - The user's UID.
 * @param {string} vaultId - The ID of the vault to delete.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteVault(
  userId: string,
  vaultId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const vaultRef = doc(db, 'users', userId, 'vaults', vaultId);
    await deleteDoc(vaultRef);
    revalidatePath('/vaults');
    return { success: true };
  } catch (error) {
    console.error('Error deleting vault:', error);
    return { success: false, error: 'Failed to delete vault.' };
  }
}

/**
 * Adds a new budget for a user.
 * @param {string} userId - The user's UID.
 * @param {Omit<Budget, 'id'>} budgetData - The data for the new budget.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function addBudget(
  userId: string,
  budgetData: Omit<Budget, 'id'>
): Promise<{ success: boolean; error?: string }> {
  try {
    const budgetsCollection = collection(db, 'users', userId, 'budgets');
    await addDoc(budgetsCollection, budgetData);
    revalidatePath('/budgets');
    return { success: true };
  } catch (error) {
    console.error('Error adding budget:', error);
    return { success: false, error: 'Failed to add new budget.' };
  }
}

/**
 * Deletes a budget.
 * @param {string} userId - The user's UID.
 * @param {string} budgetId - The ID of the budget to delete.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteBudget(
  userId: string,
  budgetId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const budgetRef = doc(db, 'users', userId, 'budgets', budgetId);
    await deleteDoc(budgetRef);
    revalidatePath('/budgets');
    return { success: true };
  } catch (error) {
    console.error('Error deleting budget:', error);
    return { success: false, error: 'Failed to delete budget.' };
  }
}

/**
 * Adds a new favorite transaction template.
 * @param userId
 * @param favoriteData
 * @returns
 */
export async function addFavorite(
  userId: string,
  favoriteData: Omit<FavoriteTransaction, 'id'>
): Promise<FavoriteTransaction> {
  const favoritesCollection = collection(
    db,
    'users',
    userId,
    'favoriteTransactions'
  );
  const docRef = await addDoc(favoritesCollection, favoriteData);
  revalidatePath('/transfer');
  return { id: docRef.id, ...favoriteData };
}

/**
 * Removes a favorite transaction template.
 * @param userId
 * @param favoriteId
 * @returns
 */
export async function removeFavorite(
  userId: string,
  favoriteId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const favoriteRef = doc(
      db,
      'users',
      userId,
      'favoriteTransactions',
      favoriteId
    );
    await deleteDoc(favoriteRef);
    revalidatePath('/transfer');
    return { success: true };
  } catch (error) {
    console.error('Error removing favorite:', error);
    return { success: false, error: 'Failed to remove favorite.' };
  }
}

/**
 * Updates the user's profile information.
 * @param userId
 * @param profileData
 * @returns
 */
export async function updateUserProfile(
  userId: string,
  profileData: {
    displayName?: string;
    email?: string;
    phone?: string;
    photoURL?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, profileData);
    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: 'Failed to update profile.' };
  }
}

/**
 * Pins or unpins an account from the dashboard.
 * @param userId
 * @param accountId
 * @param isPinned
 * @returns
 */
export async function togglePinAccount(
  userId: string,
  accountId: string,
  isPinned: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const accountRef = doc(db, 'users', userId, 'accounts', accountId);
    await updateDoc(accountRef, { isPinned });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error toggling pin status:', error);
    return { success: false, error: 'Failed to update pin status.' };
  }
}

/**
 * Deletes an account and all its associated transactions.
 * @param userId
 * @param accountId
 * @returns
 */
export async function deleteAccount(
  userId: string,
  accountId: string
): Promise<{ success: boolean; error?: string }> {
  const batch = writeBatch(db);
  try {
    // 1. Delete the account document
    const accountRef = doc(db, 'users', userId, 'accounts', accountId);
    batch.delete(accountRef);

    // 2. Find and delete all transactions for that account
    const transactionsCollection = collection(
      db,
      'users',
      userId,
      'transactions'
    );
    const q = query(transactionsCollection, where('accountId', '==', accountId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    revalidatePath('/dashboard');
    revalidatePath('/history');
    return { success: true };
  } catch (error) {
    console.error('Error deleting account:', error);
    return { success: false, error: 'Failed to delete account.' };
  }
}

async function getSpendingPerBudget(
  userId: string,
  budgets: Budget[]
): Promise<Map<string, number>> {
  const spending = new Map<string, number>();
  if (budgets.length === 0) return spending;

  const transactions = await getRecentTransactions(userId, 500); // Fetch recent transactions

  budgets.forEach(budget => {
    const budgetInterval = {
      start: new Date(budget.startDate),
      end: new Date(budget.endDate),
    };
    const budgetSpending = transactions
      .filter(
        t =>
          t.category === budget.category &&
          t.amount < 0 &&
          isWithinInterval(new Date(t.date), budgetInterval)
      )
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);
    spending.set(budget.id, budgetSpending);
  });
  return spending;
}

// ---- AI-Powered Actions ----

export async function getSavingSuggestions(
  transactions: Transaction[]
): Promise<PersonalizedSavingSuggestionsOutput & { error?: string }> {
  try {
    const spendingData = transactions
      .filter(t => t.amount < 0)
      .map(t => `${t.description}: ${formatCurrency(t.amount)}`)
      .join('\n');

    // In a real app, you'd get this info from the user's profile
    const mockInput = {
      spendingData: spendingData || 'No spending data for this period.',
      monthlyIncome: 15000000,
      location: 'Jakarta',
    };

    const suggestions = await personalizedSavingSuggestions(mockInput);
    return suggestions;
  } catch (error) {
    console.error('Error getting saving suggestions:', error);
    return {
      error: "I'm sorry, I couldn't find any saving opportunities right now.",
      financialHealthScore: 0,
      spenderType: 'Error',
      summary: 'Could not generate suggestions.',
      suggestions: [],
      investmentPlan: '',
      localDeals: [],
    };
  }
}

export async function getBudgetAnalysis(
  userId: string
): Promise<BudgetAnalysisOutput & { error?: string }> {
  try {
    const budgets = await getBudgets(userId);
    if (budgets.length === 0) {
      return {
        error: 'No budgets found to analyze.',
        coachTitle: 'Ready to Start?',
        summary:
          "You haven't created any budgets yet. Create one for categories like 'Food' or 'Shopping' to get started with AI analysis!",
        suggestions: [],
        proTip:
          "A budget is a plan for your money. It's the most powerful tool for achieving your financial goals.",
      };
    }

    const spendingPerBudget = await getSpendingPerBudget(userId, budgets);

    const budgetData = budgets
      .map(budget => {
        const spent = spendingPerBudget.get(budget.id) || 0;
        const percentage =
          budget.amount > 0 ? ((spent / budget.amount) * 100).toFixed(0) : 0;
        return `- ${budget.name} (${
          budget.category
        }): Target ${formatCurrency(budget.amount)}, Spent ${formatCurrency(
          spent
        )} (${percentage}% used).`;
      })
      .join('\n');

    const analysis = await budgetAnalysis({ budgetData });
    return analysis;
  } catch (error) {
    console.error('Error getting budget analysis:', error);
    return {
      error: 'An unexpected error occurred while analyzing your budgets.',
      coachTitle: 'Analysis Error',
      summary: "We couldn't process your budget data right now. Please try again later.",
      suggestions: [],
      proTip: 'If the problem persists, our support team is here to help.',
    };
  }
}

/**
 * Discovers potential recurring bills from a user's transaction history.
 * @param {Transaction[]} transactions - The user's transactions.
 * @returns {Promise<BillDiscoveryOutput & { error?: string }>}
 */
export async function getBillSuggestions(
  transactions: Transaction[]
): Promise<BillDiscoveryOutput & { error?: string }> {
  try {
    const transactionHistory = transactions
      .filter(t => t.amount < 0)
      .map(t => `${t.date}: ${t.description} ${formatCurrency(t.amount)}`)
      .join('\n');

    const suggestions = await discoverRecurringBills({ transactionHistory });
    return suggestions;
  } catch (error) {
    console.error('Error getting bill suggestions:', error);
    return {
      error: 'Failed to get AI-powered bill suggestions.',
      potentialBills: [],
    };
  }
}

export async function getAiChatResponse(input: {
  history: ChatMessage[];
}): Promise<string> {
  try {
    const response = await getAiChatResponseFlow(input);
    return response;
  } catch (error) {
    console.error('Error getting AI chat response:', error);
    return "I'm sorry, I encountered an error and can't respond right now. Please try again later.";
  }
}

// ---- Legacy/Mock Actions ----

// The following actions are related to the mock AyoConnect API flow.
// They would be replaced by real API calls in a production environment.

/**
 * Simulates exchanging a public token for a private access token.
 * This would be a server-to-server call to the financial aggregator.
 * @param publicToken The temporary public token from the client-side flow.
 * @returns An object with the access token or an error.
 */
export async function exchangePublicToken(publicToken: string): Promise<{
  accessToken?: string;
  error?: string;
}> {
  // In a real app, this would be an HTTP POST request to the aggregator's /token endpoint.
  // For now, we call our mock DB function.
  const response = db.exchangePublicToken(publicToken);
  if (response.error) {
    return { error: response.error };
  }
  return { accessToken: response.access_token };
}

/**
 * Fetches account data from the mock provider and syncs it to our Firestore DB.
 * @param userId The UID of the user to associate the accounts with.
 * @param accessToken The private access token for the financial provider.
 * @returns An object indicating success/failure and the number of accounts added.
 */
export async function syncAccountsFromProvider(
  userId: string,
  accessToken: string
): Promise<{ accountsAdded?: number; error?: string }> {
  try {
    // 1. Fetch accounts from the mock provider API
    // In a real app, this would be an authorized GET request.
    const providerData = db.getUserByAccessToken(accessToken);
    if (!providerData) {
      return { error: 'Invalid access token.' };
    }

    const providerAccounts = db.accounts.filter(acc =>
      providerData.accounts.includes(acc.account_id)
    );

    // 2. Write the new accounts to our Firestore DB in a batch
    const batch = writeBatch(db);
    let accountsAdded = 0;

    for (const providerAccount of providerAccounts) {
      // Map the provider account format to our internal Account format.
      const newAccount: Omit<Account, 'id'> = {
        name: providerAccount.name,
        institutionSlug: providerAccount.institution_id,
        type: mapProviderAccountType(providerAccount.type),
        balance: providerAccount.balances.current,
        accountNumber: providerAccount.mask,
      };

      // Use the provider's account_id as our document ID to prevent duplicates.
      const accountRef = doc(
        db,
        'users',
        userId,
        'accounts',
        providerAccount.account_id
      );
      batch.set(accountRef, newAccount);
      accountsAdded++;
    }

    await batch.commit();

    // 3. Revalidate the dashboard path so the new data appears instantly.
    revalidatePath('/dashboard');

    return { accountsAdded };
  } catch (err: any) {
    console.error('Error syncing accounts:', err);
    return { error: 'Failed to sync accounts.' };
  }
}

// Helper to map provider account types to our internal types
function mapProviderAccountType(
  providerType: 'depository' | 'ewallet' | 'credit' | 'investment' | 'loan'
): 'bank' | 'e-wallet' | 'investment' | 'loan' {
  switch (providerType) {
    case 'depository':
      return 'bank';
    case 'ewallet':
      return 'e-wallet';
    case 'credit':
      return 'loan'; // We classify credit cards as a type of loan/liability
    case 'investment':
      return 'investment';
    case 'loan':
      return 'loan';
    default:
      return 'bank'; // Default fallback
  }
}
