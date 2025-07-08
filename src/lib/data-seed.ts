
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
const today = new Date();
const getDateString = (dayOfMonth: number, monthOffset = 0) => {
    const date = new Date(today.getFullYear(), today.getMonth() + monthOffset, dayOfMonth);
    // Ensure date is not in the future
    if (date > today) {
        date.setFullYear(today.getFullYear() - 1);
    }
    return date.toISOString().split('T')[0];
};

export const transactions: Transaction[] = [
  // Current Month
  { id: 'txn_1', accountId: 'acc_bca_tahapan_1', amount: 25000000, date: getDateString(1), description: 'Salary Deposit', category: 'Income' },
  { id: 'txn_2', accountId: 'acc_bca_kredit_2', amount: -1800000, date: getDateString(2), description: 'Dinner at SKYE', category: 'Food & Drink' },
  { id: 'txn_3', accountId: 'acc_bca_tahapan_1', amount: -3200000, date: getDateString(3), description: 'Garuda Flight to Bali', category: 'Travel' },
  { id: 'txn_4', accountId: 'acc_gopay_main_3', amount: -120000, date: getDateString(4), description: "GoFood McDonald's", category: 'Food & Drink' },
  { id: 'txn_5', accountId: 'acc_gopay_main_3', amount: -35000, date: getDateString(5), description: 'Gojek Ride', category: 'Transportation' },
  { id: 'txn_6', accountId: 'acc_bca_kredit_2', amount: -2500000, date: getDateString(6), description: 'Shopping at Zara', category: 'Shopping' },
  { id: 'txn_7', accountId: 'acc_bca_kredit_2', amount: -54999, date: getDateString(7), description: 'Spotify Premium', category: 'Entertainment' },
  { id: 'txn_9', accountId: 'acc_mandiri_payroll_4', amount: -250000, date: getDateString(8), description: 'Biaya Admin', category: 'Fees'},
  { id: 'txn_10', accountId: 'acc_kredivo_loan_7', amount: -5500000, date: getDateString(9), description: 'Pembayaran Tagihan Kredivo', category: 'Bills' },
  { id: 'txn_11', accountId: 'acc_bibit_main_5', amount: -15000000, date: getDateString(10), description: 'Invest in Mutual Fund', category: 'Investments' },
  { id: 'txn_12', accountId: 'acc_bca_tahapan_1', amount: -850000, date: getDateString(11), description: 'Uniqlo Shopping', category: 'Shopping' },
  { id: 'txn_13', accountId: 'acc_bca_tahapan_1', amount: -1200000, date: getDateString(12), description: 'PLN & IndiHome Bill', category: 'Bills' },
  { id: 'txn_14', accountId: 'acc_mandiri_payroll_4', amount: 5000000, date: getDateString(13), description: 'Project Freelance Payment', category: 'Income' },
  { id: 'txn_15', accountId: 'acc_pintu_main_6', amount: -10000000, date: getDateString(14), description: 'Buy Bitcoin', category: 'Investments' },
  { id: 'txn_16', accountId: 'acc_gopay_main_3', amount: -55000, date: getDateString(15), description: 'Kopi Kenangan', category: 'Food & Drink' },
  { id: 'txn_17', accountId: 'acc_bca_tahapan_1', amount: -750000, date: getDateString(16), description: 'Groceries at Ranch Market', category: 'Shopping' },
  { id: 'txn_18', accountId: 'acc_bca_tahapan_1', amount: 1000000, date: getDateString(17), description: 'Reimbursement from Office', category: 'Income' },
];

// --- MOCK BENEFICIARIES ---
export const beneficiaries: Beneficiary[] = [
    { id: 'bene1', name: 'Susi Susanti', bankName: 'BCA', accountNumber: '1234567890' },
    { id: 'bene2', name: 'Bambang Pamungkas', bankName: 'Mandiri', accountNumber: '0987654321' },
    { id: 'bene3', name: 'Rental Mobil Bali', bankName: 'BNI', accountNumber: '1122334455' },
];

// --- MOCK VAULTS ---
export const vaults: Vault[] = [
    {
        id: 'vault1', name: 'Holiday to Japan', icon: 'Holiday', currentAmount: 28500000, targetAmount: 30000000, sourceAccountIds: ['acc_bca_tahapan_1'],
        destinationAccountId: 'acc_bca_tahapan_1', roundUpEnabled: true, imageUrl: 'https://placehold.co/600x400.png'
    },
    {
        id: 'vault2', name: 'New iPhone 16', icon: 'New Gadget', currentAmount: 3500000, targetAmount: 25000000, sourceAccountIds: ['acc_gopay_main_3'],
        destinationAccountId: 'acc_bca_tahapan_1', autoSaveEnabled: true, autoSaveFrequency: 'weekly', autoSaveAmount: 500000,
    },
    {
        id: 'vault3', name: 'Budi & Susi Wedding', icon: 'Wedding', currentAmount: 112000000, targetAmount: 200000000, sourceAccountIds: ['acc_bca_tahapan_1', 'acc_mandiri_payroll_4'],
        destinationAccountId: 'acc_mandiri_payroll_4', isShared: true, members: [
            { id: 'user1', name: 'Budi', avatarUrl: 'https://placehold.co/40x40.png' },
            { id: 'user2', name: 'Susi', avatarUrl: 'https://placehold.co/40x40.png' },
        ]
    }
];

// --- MOCK BUDGETS ---
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

export const budgets: Budget[] = [
    { id: 'budget_food', name: 'Monthly Food & Drink', category: 'Food & Drink', amount: 3000000, startDate: getDateString(1), endDate: getDateString(lastDayOfMonth) },
    { id: 'budget_shopping', name: 'Gadget & Clothes', category: 'Shopping', amount: 5000000, startDate: getDateString(1), endDate: getDateString(lastDayOfMonth) },
    { id: 'budget_transport', name: 'Monthly Transport', category: 'Transportation', amount: 1500000, startDate: getDateString(1), endDate: getDateString(lastDayOfMonth) },
];

// --- MOCK FAVORITE TRANSACTIONS ---
export const favoriteTransactions: FavoriteTransaction[] = [
    { id: 'fav1', name: 'Bayar Kosan', amount: 3500000, icon: 'Home', category: 'Housing', recipientId: 'bene1', recipientBank: 'BCA' },
    { id: 'fav2', name: 'Transfer ke Ortu', amount: 5000000, icon: 'User', category: 'Family', recipientId: 'bene2', recipientBank: 'Mandiri' },
    { id: 'fav3', name: 'Top Up GoPay', amount: 500000, icon: 'Wallet', category: 'Top Up' },
];
