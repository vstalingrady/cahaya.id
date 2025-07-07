
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

// New users will start with a clean slate. Data is added by linking accounts.
export const accounts: Account[] = [];
export const transactions: Transaction[] = [];
export const beneficiaries: Beneficiary[] = [];
export const vaults: Vault[] = [];
export const budgets: Budget[] = [];
export const favoriteTransactions: FavoriteTransaction[] = [];
