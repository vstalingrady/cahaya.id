
// This file contains the initial seed data for new users.
// It is imported by the `seedInitialDataForUser` function in actions.ts.

import {
  type Account,
  type Transaction,
  type Vault,
  type Beneficiary,
  type Budget,
  type FavoriteTransaction,
} from './data';

// --- MOCK ACCOUNTS ---
export const accounts: Account[] = [];

// --- MOCK TRANSACTIONS ---
export const transactions: Transaction[] = [];

// --- MOCK BENEFICIARIES ---
export const beneficiaries: Beneficiary[] = [];

// --- MOCK VAULTS ---
export const vaults: Vault[] = [];

// --- MOCK BUDGETS ---
export const budgets: Budget[] = [];

// --- MOCK FAVORITE TRANSACTIONS ---
export const favoriteTransactions: FavoriteTransaction[] = [];
