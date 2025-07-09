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
    billDiscoveryFlow, 
    budgetAnalysisFlow, 
    getAiChatResponseFlow, 
    savingOpportunitiesFlow, 
    spendingAnalysisFlow,
    verifyPinFlow,
} from '@/ai/genkit';
import { db, auth } from './firebase';
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
    FinancialInstitution,
    CryptoHolding
} from './data';
import { 
    accounts as seedAccounts, 
    transactions as seedTransactions, 
    vaults as seedVaults,
    beneficiaries as seedBeneficiaries,
    budgets as seedBudgets,
    favoriteTransactions as seedFavorites,
    financialInstitutions as seedInstitutions
} from './data-seed';

import { revalidatePath } from 'next/cache';

// ---- User Profile & Onboarding Actions ----

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
    await setDoc(userRef, {
      uid: userId,
      fullName,
      email,
      phoneNumber,
      createdAt: Timestamp.now(),
      hasCompletedOnboarding: false,
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error("Error completing user profile:", error);
    return { success: false, error: "Failed to save user profile." };
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
    await updateDoc(userRef, {
      pin: pin, // In a real app, this should be hashed.
      hasCompletedOnboarding: true, // This is the final step
    });
    
    // Seed the user's account with mock data upon completing onboarding.
    await seedUserData(userId);

    // Revalidate all data-heavy paths
    revalidatePath('/dashboard');
    revalidatePath('/history');
    revalidatePath('/budgets');

    return { success: true };
  } catch (error) {
    console.error("Error setting security PIN:", error);
    return { success: false, error: "Failed to set security PIN." };
  }
}

/**
 * Verifies a user's PIN against the one stored in Firestore.
 * This is a server-side action that calls a Genkit flow.
 * 
 * @param {string} userId - The user's UID.
 * @param {string} pinAttempt - The PIN entered by the user.
 * @returns {Promise<{success: boolean, error?: string}>} - The result of the verification.
 */
export async function verifySecurityPin(
    userId: string,
    pinAttempt: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const result = await verifyPinFlow({ userId, pinAttempt });
        return result;
    } catch (error) {
        console.error("Error verifying PIN in action:", error);
        return { success: false, error: "An unexpected error occurred during PIN verification." };
    }
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
        const transactionRef = doc(db, 'users', userId, 'transactions', transaction.id);
        batch.set(transactionRef, transaction);
    });

    // Seed vaults
    seedVaults.forEach(vault => {
        const vaultRef = doc(db, 'users', userId, 'vaults', vault.id);
        batch.set(vaultRef, vault);
    });

    // Seed beneficiaries
    seedBeneficiaries.forEach(beneficiary => {
        const beneficiaryRef = doc(db, 'users', userId, 'beneficiaries', beneficiary.id);
        batch.set(beneficiaryRef, beneficiary);
    });

    // Seed budgets
    seedBudgets.forEach(budget => {
        const budgetRef = doc(db, 'users', userId, 'budgets', budget.id);
        batch.set(budgetRef, budget);
    });

    // Seed favorite transactions
    seedFavorites.forEach(favorite => {
        const favoriteRef = doc(db, 'users', userId, 'favoriteTransactions', favorite.id);
        batch.set(favoriteRef, favorite);
    });
    
    await batch.commit();
}


// ---- Data Fetching Actions ----

/**
 * Fetches the user's profile data from Firestore.
 * 
 * @param {string} userId - The user's UID.
 * @returns {Promise<any>} - The user's profile data.
 */
export async function getUserProfile(userId: string): Promise<any> {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data();
    }
    return null;
}

/**
 * Fetches all financial accounts for a given user.
 * 
 * @param {string} userId - The user's UID.
 * @returns {Promise<Account[]>} - An array of the user's accounts.
 */
export async function getAccounts(userId: string): Promise<Account[]> {
    const accountsCollection = collection(db, 'users', userId, 'accounts');
    const q = query(accountsCollection, orderBy('balance', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Account));
}

/**
 * Fetches a single financial account by its ID.
 * @param {string} userId - The user's UID.
 * @param {string} accountId - The ID of the account to fetch.
 * @returns {Promise<Account | null>} - The account object or null if not found.
 */
export async function getAccountById(userId: string, accountId: string): Promise<Account | null> {
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
export async function getRecentTransactions(userId: string, count: number = 100): Promise<Transaction[]> {
    const transactionsCollection = collection(db, 'users', userId, 'transactions');
    const q = query(transactionsCollection, orderBy('date', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
}

/**
 * Fetches all transactions for a specific account.
 * 
 * @param {string} userId - The user's UID.
 * @param {string} accountId - The ID of the account to fetch transactions for.
 * @returns {Promise<Transaction[]>} - An array of transactions for the specified account.
 */
export async function getTransactionsByAccountId(userId: string, accountId: string): Promise<Transaction[]> {
    const transactionsCollection = collection(db, 'users', userId, 'transactions');
    const q = query(transactionsCollection, where('accountId', '==', accountId), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
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
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vault));
}

/**
 * Fetches a single savings vault by its ID.
 * 
 * @param {string} userId - The user's UID.
 * @param {string} vaultId - The ID of the vault to fetch.
 * @returns {Promise<Vault | null>} - The vault object or null if not found.
 */
export async function getVaultById(userId: string, vaultId: string): Promise<Vault | null> {
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
    const beneficiariesCollection = collection(db, 'users', userId, 'beneficiaries');
    const querySnapshot = await getDocs(beneficiariesCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Beneficiary));
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
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Budget));
}

/**
 * Fetches all favorite transactions for a user.
 * 
 * @param {string} userId - The user's UID.
 * @returns {Promise<FavoriteTransaction[]>} - An array of the user's favorite transactions.
 */
export async function getFavoriteTransactions(userId: string): Promise<FavoriteTransaction[]> {
    const favoritesCollection = collection(db, 'users', userId, 'favoriteTransactions');
    const querySnapshot = await getDocs(favoritesCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FavoriteTransaction));
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
    const history = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return history;
}


// ---- Data Mutation Actions ----

/**
 * Adds a new savings vault for a user.
 * @param {string} userId - The user's UID.
 * @param {Omit<Vault, 'id'>} vaultData - The data for the new vault.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function addVault(userId: string, vaultData: Omit<Vault, 'id' | 'currentAmount'>): Promise<{ success: boolean, error?: string }> {
    try {
        const vaultsCollection = collection(db, 'users', userId, 'vaults');
        await addDoc(vaultsCollection, {
            ...vaultData,
            currentAmount: 0 // Vaults always start at 0
        });
        revalidatePath('/vaults');
        return { success: true };
    } catch (error) {
        console.error("Error adding vault:", error);
        return { success: false, error: "Failed to add new vault." };
    }
}

/**
 * Updates an existing savings vault.
 * @param {string} userId - The user's UID.
 * @param {string} vaultId - The ID of the vault to update.
 * @param {Partial<Vault>} vaultData - The data to update.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updateVault(userId: string, vaultId: string, vaultData: Partial<Vault>): Promise<{ success: boolean, error?: string }> {
    try {
        const vaultRef = doc(db, 'users', userId, 'vaults', vaultId);
        await updateDoc(vaultRef, vaultData);
        revalidatePath('/vaults');
        revalidatePath(`/vaults/${vaultId}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating vault:", error);
        return { success: false, error: "Failed to update vault." };
    }
}

/**
 * Deletes a savings vault.
 * @param {string} userId - The user's UID.
 * @param {string} vaultId - The ID of the vault to delete.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteVault(userId: string, vaultId: string): Promise<{ success: boolean, error?: string }> {
    try {
        const vaultRef = doc(db, 'users', userId, 'vaults', vaultId);
        await deleteDoc(vaultRef);
        revalidatePath('/vaults');
        return { success: true };
    } catch (error) {
        console.error("Error deleting vault:", error);
        return { success: false, error: "Failed to delete vault." };
    }
}


/**
 * Adds a new budget for a user.
 * @param {string} userId - The user's UID.
 * @param {Omit<Budget, 'id'>} budgetData - The data for the new budget.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function addBudget(userId: string, budgetData: Omit<Budget, 'id'>): Promise<{ success: boolean, error?: string }> {
    try {
        const budgetsCollection = collection(db, 'users', userId, 'budgets');
        await addDoc(budgetsCollection, budgetData);
        revalidatePath('/budgets');
        return { success: true };
    } catch (error) {
        console.error("Error adding budget:", error);
        return { success: false, error: "Failed to add new budget." };
    }
}


/**
 * Adds a new beneficiary for a user.
 * @param {string} userId - The user's UID.
 * @param {Omit<Beneficiary, 'id'>} beneficiaryData - The data for the new beneficiary.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function addBeneficiary(userId: string, beneficiaryData: Omit<Beneficiary, 'id'>): Promise<{ success: boolean, error?: string }> {
    try {
        const beneficiariesCollection = collection(db, 'users', userId, 'beneficiaries');
        await addDoc(beneficiariesCollection, beneficiaryData);
        revalidatePath('/transfer/recipients');
        return { success: true };
    } catch (error) {
        console.error("Error adding beneficiary:", error);
        return { success: false, error: "Failed to add new beneficiary." };
    }
}


/**
 * Simulates a fund transfer between accounts.
 * In a real app, this would involve complex interactions with payment gateways.
 * Here, we just create a new transaction record.
 * 
 * @param {string} userId - The user's UID.
 * @param {string} fromAccountId - The ID of the source account.
 * @param {string} toAccountId - The ID of the destination account or beneficiary name.
 * @param {number} amount - The amount to transfer.
 * @param {string} notes - Transfer notes.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function transferFunds(
    userId: string,
    fromAccountId: string,
    toAccountId: string, // Can be another of the user's accounts or a beneficiary
    amount: number,
    notes: string
): Promise<{ success: boolean; error?: string }> {
    const batch = writeBatch(db);

    try {
        // 1. Debit the source account
        const fromAccountRef = doc(db, 'users', userId, 'accounts', fromAccountId);
        const fromAccountSnap = await getDoc(fromAccountRef);
        if (!fromAccountSnap.exists() || fromAccountSnap.data().balance < amount) {
            return { success: false, error: "Insufficient funds." };
        }
        const fromAccountData = fromAccountSnap.data();
        batch.update(fromAccountRef, { balance: fromAccountData.balance - amount });

        // 2. Credit the destination account (if it's one of the user's accounts)
        const toAccountRef = doc(db, 'users', userId, 'accounts', toAccountId);
        const toAccountSnap = await getDoc(toAccountRef);
        if (toAccountSnap.exists()) {
             const toAccountData = toAccountSnap.data();
             batch.update(toAccountRef, { balance: toAccountData.balance + amount });
        }
        
        // 3. Create transaction records
        const debitTransactionRef = doc(collection(db, 'users', userId, 'transactions'));
        batch.set(debitTransactionRef, {
            accountId: fromAccountId,
            amount: -amount,
            category: 'Transfer',
            date: new Date().toISOString(),
            description: `Transfer to ${toAccountSnap.exists() ? toAccountSnap.data().name : toAccountId}`,
            notes,
        });

        if (toAccountSnap.exists()) {
            const creditTransactionRef = doc(collection(db, 'users', userId, 'transactions'));
            batch.set(creditTransactionRef, {
                accountId: toAccountId,
                amount: amount,
                category: 'Transfer',
                date: new Date().toISOString(),
                description: `Transfer from ${fromAccountData.name}`,
                notes,
            });
        }
        
        await batch.commit();

        revalidatePath('/dashboard');
        revalidatePath('/history');
        revalidatePath(`/accounts/${fromAccountId}`);
        if(toAccountSnap.exists()) revalidatePath(`/accounts/${toAccountId}`);

        return { success: true };

    } catch (error) {
        console.error("Error transferring funds:", error);
        return { success: false, error: "Fund transfer failed." };
    }
}

/**
 * Simulates a QRIS payment.
 * Creates a transaction record for the payment.
 * 
 * @param {string} userId - The user's UID.
 * @param {string} fromAccountId - The ID of the source account.
 * @param {number} amount - The payment amount.
 * @param {string} merchantName - The name of the QRIS merchant.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function makeQrisPayment(
    userId: string,
    fromAccountId: string,
    amount: number,
    merchantName: string
): Promise<{ success: boolean; error?: string }> {
     const batch = writeBatch(db);
    try {
        const fromAccountRef = doc(db, 'users', userId, 'accounts', fromAccountId);
        const fromAccountSnap = await getDoc(fromAccountRef);

        if (!fromAccountSnap.exists() || fromAccountSnap.data().balance < amount) {
            return { success: false, error: "Insufficient funds." };
        }
        const fromAccountData = fromAccountSnap.data();
        batch.update(fromAccountRef, { balance: fromAccountData.balance - amount });

        const transactionRef = doc(collection(db, 'users', userId, 'transactions'));
        batch.set(transactionRef, {
            accountId: fromAccountId,
            amount: -amount,
            category: 'QRIS Payment',
            date: new Date().toISOString(),
            description: `Payment to ${merchantName}`,
        });

        await batch.commit();

        revalidatePath('/dashboard');
        revalidatePath('/history');
        revalidatePath(`/accounts/${fromAccountId}`);

        return { success: true };
    } catch (error) {
        console.error("Error making QRIS payment:", error);
        return { success: false, error: "QRIS payment failed." };
    }
}

/**
 * Simulates a mobile top-up.
 * Creates a transaction record for the purchase.
 * 
 * @param {string} userId - The user's UID.
 * @param {string} fromAccountId - The ID of the source account.
 * @param {string} phoneNumber - The phone number to top-up.
 * @param {number} amount - The top-up amount.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function topUpMobile(
    userId: string,
    fromAccountId: string,
    phoneNumber: string,
    amount: number
): Promise<{ success: boolean; error?: string }> {
    const batch = writeBatch(db);
    try {
        const fromAccountRef = doc(db, 'users', userId, 'accounts', fromAccountId);
        const fromAccountSnap = await getDoc(fromAccountRef);

        if (!fromAccountSnap.exists() || fromAccountSnap.data().balance < amount) {
            return { success: false, error: "Insufficient funds." };
        }
        const fromAccountData = fromAccountSnap.data();
        batch.update(fromAccountRef, { balance: fromAccountData.balance - amount });

        const transactionRef = doc(collection(db, 'users', userId, 'transactions'));
        batch.set(transactionRef, {
            accountId: fromAccountId,
            amount: -amount,
            category: 'Top-up',
            date: new Date().toISOString(),
            description: `Mobile top-up for ${phoneNumber}`,
        });
        
        await batch.commit();

        revalidatePath('/dashboard');
        revalidatePath('/history');
        revalidatePath(`/accounts/${fromAccountId}`);

        return { success: true };
    } catch (error) {
        console.error("Error with mobile top-up:", error);
        return { success: false, error: "Mobile top-up failed." };
    }
}

// ---- AI-Powered Actions ----
// These actions act as server-side wrappers for the Genkit flows.

/**
 * Gets AI-powered analysis of a user's spending habits.
 * 
 * @param {Transaction[]} transactions - An array of the user's transactions.
 * @returns {Promise<string>} - A string containing the AI's analysis.
 */
export async function getSpendingAnalysis(transactions: Transaction[]): Promise<string> {
    try {
        const analysis = await spendingAnalysisFlow({ transactions });
        return analysis;
    } catch (error) {
        console.error("Error getting spending analysis:", error);
        return "I'm sorry, I was unable to analyze your spending data at this time.";
    }
}

/**
 * Gets AI-powered suggestions for saving opportunities.
 * 
 * @param {Transaction[]} transactions - An array of the user's transactions.
 * @returns {Promise<string>} - A string containing the AI's suggestions.
 */
export async function getSavingOpportunities(transactions: Transaction[]): Promise<string> {
    try {
        const opportunities = await savingOpportunitiesFlow({ transactions });
        return opportunities;
    } catch (error) {
        console.error("Error getting saving opportunities:", error);
        return "I'm sorry, I couldn't find any saving opportunities right now.";
    }
}

/**
 * Gets AI-powered analysis of a user's budget performance.
 * 
 * @param {Budget[]} budgets - An array of the user's budgets.
 * @param {Transaction[]} transactions - An array of the user's transactions.
 * @returns {Promise<string>} - A string containing the AI's analysis.
 */
export async function getBudgetAnalysis(
    budgets: Budget[],
    transactions: Transaction[]
): Promise<string> {
    try {
        const analysis = await budgetAnalysisFlow({ budgets, transactions });
        return analysis;
    } catch (error) {
        console.error("Error getting budget analysis:", error);
        return "I'm sorry, I was unable to analyze your budget performance at this time.";
    }
}

/**
 * Discovers potential recurring bills from a user's transaction history.
 * @param {Transaction[]} transactions - The user's transactions.
 * @returns {Promise<{potentialBills: any[], error?: string}>}
 */
export async function getBillSuggestions(
  transactions: Transaction[]
): Promise<{ potentialBills: any[]; error?: string }> {
  try {
    const suggestions = await billDiscoveryFlow({ transactions });
    return { potentialBills: suggestions, error: undefined };
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

// ---- Legacy/Mock Actions ----
