
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
export const accounts: Account[] = [
    {
      id: 'acc_bca_tahapan_1',
      name: 'BCA Tahapan Gold',
      institutionSlug: 'bca',
      type: 'bank',
      balance: 85200501,
      accountNumber: '2847',
      isPinned: true,
    },
    {
      id: 'acc_bca_kredit_2',
      name: 'BCA Everyday Card',
      institutionSlug: 'bca',
      type: 'loan', 
      balance: 4500000,
      accountNumber: '5588',
    },
    {
      id: 'acc_gopay_main_3',
      name: 'GoPay',
      institutionSlug: 'gopay',
      type: 'e-wallet',
      balance: 1068000,
      accountNumber: '7890',
    },
    {
      id: 'acc_mandiri_payroll_4',
      name: 'Mandiri Payroll',
      institutionSlug: 'mandiri',
      type: 'bank',
      balance: 42500000,
      accountNumber: '5566',
    },
    {
      id: 'acc_bibit_main_5',
      name: 'Bibit Portfolio',
      institutionSlug: 'bibit',
      type: 'investment',
      balance: 125000000,
      accountNumber: 'IVST',
    },
    {
      id: 'acc_pintu_main_6',
      name: 'Pintu Crypto',
      institutionSlug: 'pintu',
      type: 'investment',
      balance: 75000000,
      accountNumber: 'CRPT',
      holdings: [
        { id: 'btc', name: 'Bitcoin', symbol: 'BTC', amount: 0.65, value: 45000000, logoUrl: 'https://placehold.co/48x48.png' },
        { id: 'eth', name: 'Ethereum', symbol: 'ETH', amount: 5, value: 25000000, logoUrl: 'https://placehold.co/48x48.png' },
      ]
    },
    {
      id: 'acc_kredivo_loan_7',
      name: 'Kredivo PayLater',
      institutionSlug: 'kredivo',
      type: 'loan',
      balance: 5500000,
      accountNumber: 'LOAN',
    },
  ];
  
// --- MOCK TRANSACTIONS ---
export const transactions: Transaction[] = [
    { id: 'txn_1', accountId: 'acc_bca_tahapan_1', amount: 55000000, date: '2024-07-25', description: 'Salary Deposit', category: 'Income' },
    { id: 'txn_2', accountId: 'acc_bca_tahapan_1', amount: -1800000, date: '2024-07-24', description: 'Dinner at SKYE', category: 'Food and Drink' },
    { id: 'txn_3', accountId: 'acc_bca_tahapan_1', amount: -3200000, date: '2024-07-19', description: 'Garuda Flight to Bali', category: 'Travel' },
    { id: 'txn_4', accountId: 'acc_gopay_main_3', amount: -120000, date: '2024-07-26', description: "GoFood McDonald's", category: 'Food and Drink' },
    { id: 'txn_5', accountId: 'acc_gopay_main_3', amount: -35000, date: '2024-07-23', description: 'Gojek Ride', category: 'Transportation' },
    { id: 'txn_6', accountId: 'acc_bca_kredit_2', amount: -2500000, date: '2024-07-27', description: 'Shopping at Zara', category: 'Shopping' },
    { id: 'txn_7', accountId: 'acc_bca_kredit_2', amount: -54999, date: '2024-07-27', description: 'Spotify Premium', category: 'Services' },
    { id: 'txn_8', accountId: 'acc_mandiri_payroll_4', amount: 45000000, date: '2024-06-30', description: 'Bonus Tahunan', category: 'Income' },
    { id: 'txn_9', accountId: 'acc_mandiri_payroll_4', amount: -250000, date: '2024-07-31', description: 'Biaya Admin', category: 'Fees'},
    { id: 'txn_10', accountId: 'acc_kredivo_loan_7', amount: -5500000, date: '2024-07-01', description: 'Pembayaran Tagihan Kredivo', category: 'Payments' },
    { id: 'txn_11', accountId: 'acc_bibit_main_5', amount: -25000000, date: '2024-07-02', description: 'Invest in Mutual Fund', category: 'Investments' },
    { id: 'txn_12', accountId: 'acc_bca_tahapan_1', amount: -850000, date: '2024-07-05', description: 'Uniqlo Shopping', category: 'Shopping' },
    { id: 'txn_13', accountId: 'acc_bca_tahapan_1', amount: -1200000, date: '2024-07-10', description: 'PLN & IndiHome Bill', category: 'Bills' },
    { id: 'txn_14', accountId: 'acc_mandiri_payroll_4', amount: 15000000, date: '2024-07-15', description: 'Project Freelance Payment', category: 'Income' },
    { id: 'txn_15', accountId: 'acc_pintu_main_6', amount: -10000000, date: '2024-07-18', description: 'Buy Bitcoin', category: 'Investments' },
    { id: 'txn_16', accountId: 'acc_gopay_main_3', amount: -55000, date: '2024-07-28', description: 'Kopi Kenangan', category: 'Food and Drink' },
    { id: 'txn_17', accountId: 'acc_bca_tahapan_1', amount: -750000, date: '2024-07-29', description: 'Groceries at Ranch Market', category: 'Groceries' },
    { id: 'txn_18', accountId: 'acc_bca_tahapan_1', amount: 5000000, date: '2024-07-08', description: 'Reimbursement from Office', category: 'Income' },
    { id: 'txn_19', accountId: 'acc_gopay_main_3', amount: -100000, date: '2024-08-01', description: 'Mobile Top-up Telkomsel', category: 'Bills' },
    { id: 'txn_20', accountId: 'acc_bca_tahapan_1', amount: -500000, date: '2024-08-02', description: 'Shopee Checkout', category: 'Shopping' },
    { id: 'txn_21', accountId: 'acc_mandiri_payroll_4', amount: -2500000, date: '2024-08-03', description: 'Car Service', category: 'Transportation' },
    { id: 'txn_22', accountId: 'acc_gopay_main_3', amount: -75000, date: '2024-08-04', description: 'Lunch at Warteg', category: 'Food and Drink' }
];

// --- MOCK BENEFICIARIES ---
export const beneficiaries: Beneficiary[] = [
    {
      id: 'benef_1',
      name: 'John Doe',
      bankName: 'BCA',
      accountNumber: '1234567890',
    },
    {
      id: 'benef_2',
      name: 'Jane Smith',
      bankName: 'Mandiri',
      accountNumber: '0987654321',
    },
];

// --- MOCK VAULTS ---
export const vaults: Vault[] = [
    {
      id: 'vault_1',
      name: 'Dream Laptop',
      icon: '💻',
      currentAmount: 15000000,
      targetAmount: 25000000,
      sourceAccountIds: ['acc_bca_tahapan_1'],
      destinationAccountId: 'acc_bibit_main_5',
    },
    {
      id: 'vault_2',
      name: 'Japan Trip',
      icon: '✈️',
      currentAmount: 5000000,
      targetAmount: 50000000,
      sourceAccountIds: ['acc_mandiri_payroll_4'],
      destinationAccountId: 'acc_bibit_main_5',
    },
];

// --- MOCK BUDGETS ---
export const budgets: Budget[] = [
    {
        id: 'budget_1',
        name: 'Food & Drinks',
        category: 'Food and Drink',
        amount: 5000000,
        startDate: '2024-08-01',
        endDate: '2024-08-31',
    },
    {
        id: 'budget_2',
        name: 'Shopping',
        category: 'Shopping',
        amount: 2500000,
        startDate: '2024-08-01',
        endDate: '2024-08-31',
    },
];

// --- MOCK FAVORITE TRANSACTIONS ---
export const favoriteTransactions: FavoriteTransaction[] = [
    {
      id: 'fav_1',
      name: 'Send to Mom',
      amount: 5000000,
      icon: '👩‍👧',
      category: 'Family',
      recipientId: 'benef_1',
    },
    {
      id: 'fav_2',
      name: 'Pay Cicilan',
      amount: 2500000,
      icon: '🏠',
      category: 'Bills',
      recipientId: 'benef_2',
    },
];
