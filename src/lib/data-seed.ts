
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

export const accounts: Account[] = [
  {
    id: 'bca1',
    name: 'BCA Main Account',
    institutionSlug: 'bca',
    type: 'bank',
    balance: 85200501,
    accountNumber: '479988776623',
  },
  {
    id: 'gopay1',
    name: 'GoPay',
    institutionSlug: 'gopay',
    type: 'e-wallet',
    balance: 1068000,
    accountNumber: '081234560812',
  },
  {
    id: 'ovo1',
    name: 'OVO Premier',
    institutionSlug: 'ovo',
    type: 'e-wallet',
    balance: 310001,
    accountNumber: '085711227829',
  },
  {
    id: 'bibit1',
    name: 'Bibit Portfolio',
    institutionSlug: 'bibit',
    type: 'investment',
    balance: 125000000,
    accountNumber: 'Invst',
  },
  {
    id: 'pintu1',
    name: 'Pintu Crypto',
    institutionSlug: 'pintu',
    type: 'investment',
    balance: 75000000,
    accountNumber: 'Crpto',
    holdings: [
      { id: 'btc', name: 'Bitcoin', symbol: 'BTC', amount: 0.65, value: 45000000, logoUrl: 'https://placehold.co/48x48.png' },
      { id: 'eth', name: 'Ethereum', symbol: 'ETH', amount: 5, value: 25000000, logoUrl: 'https://placehold.co/48x48.png' },
      { id: 'sol', name: 'Solana', symbol: 'SOL', amount: 50, value: 5000000, logoUrl: 'https://placehold.co/48x48.png' },
    ]
  },
  {
    id: 'kredivo1',
    name: 'Kredivo PayLater',
    institutionSlug: 'kredivo',
    type: 'loan',
    balance: 5500000, // Represents outstanding debt
    accountNumber: 'Loan',
  }
];

export const transactions: Transaction[] = [
  // July 2024
  { id: 't1', date: '2024-07-28T13:00:00Z', description: 'Lunch at Paul', amount: -350000, category: 'Food & Drink', accountId: 'bca1'},
  { id: 't2', date: '2024-07-27T18:00:00Z', description: 'Spotify Premium', amount: -54999, category: 'Bills', accountId: 'ovo1'},
  { id: 't3', date: '2024-07-27T15:00:00Z', description: 'Shopping at Zara', amount: -2500000, category: 'Shopping', accountId: 'bca1'},
  { id: 't4', date: '2024-07-26T19:30:00Z', description: 'GoFood McDonald\'s', amount: -120000, category: 'Food & Drink', accountId: 'gopay1'},
  { id: 't5', date: '2024-07-25T09:05:00Z', description: 'Salary Deposit', amount: 55000000, category: 'Income', accountId: 'bca1'},
  { id: 't6', date: '2024-07-25T09:10:00Z', description: 'Auto-invest Bibit', amount: -5000000, category: 'Investment', accountId: 'bca1'},
  { id: 't7', date: '2024-07-24T20:00:00Z', description: 'Dinner at SKYE', amount: -1800000, category: 'Food & Drink', accountId: 'bca1'},
  { id: 't8', date: '2024-07-23T18:00:00Z', description: 'Gojek Ride', amount: -35000, category: 'Transportation', accountId: 'gopay1'},
  { id: 't9', date: '2024-07-22T10:00:00Z', description: 'Netflix Subscription', amount: -186000, category: 'Bills', accountId: 'ovo1'},
  { id: 't10', date: '2024-07-21T16:00:00Z', description: 'Groceries at Grand Lucky', amount: -1200000, category: 'Groceries', accountId: 'bca1'},
  { id: 't11', date: '2024-07-20T11:00:00Z', description: 'Starbucks', amount: -65000, category: 'Food & Drink', accountId: 'gopay1'},
  { id: 't12', date: '2024-07-19T14:00:00Z', description: 'Garuda Flight to Bali', amount: -3200000, category: 'Travel', accountId: 'bca1'},
  { id: 't13', date: '2024-07-18T16:30:00Z', description: 'Uniqlo Purchase', amount: -799000, category: 'Shopping', accountId: 'bca1'},
  { id: 't14', date: '2024-07-17T08:00:00Z', description: 'Fitness First Membership', amount: -850000, category: 'Health', accountId: 'bca1'},
  { id: 't15', date: '2024-07-15T10:00:00Z', description: 'Top Up Pintu Crypto', amount: -10000000, category: 'Investment', accountId: 'bca1'},
  { id: 't16', date: '2024-07-12T13:00:00Z', description: 'Apple Store (iPhone)', amount: -25000000, category: 'Electronics', accountId: 'bca1'},
  { id: 't17', date: '2024-07-10T12:00:00Z', description: 'Transfer to Mom', amount: -2000000, category: 'Family', accountId: 'bca1'},
  { id: 't18', date: '2024-07-08T09:00:00Z', description: 'Kopi Kenangan', amount: -22000, category: 'Food & Drink', accountId: 'gopay1'},
  { id: 't19', date: '2024-07-05T11:00:00Z', description: 'PLN Bill', amount: -750000, category: 'Bills', accountId: 'ovo1'},
  { id: 't20', date: '2024-07-03T12:30:00Z', description: 'Business Lunch', amount: -500000, category: 'Food & Drink', accountId: 'bca1'},
  { id: 't21', date: '2024-07-01T10:00:00Z', description: 'Freelance Payment Received', amount: 7500000, category: 'Income', accountId: 'bca1'},

  // June 2024
  { id: 't22', date: '2024-06-28T19:00:00Z', description: 'CGV Sphere X', amount: -250000, category: 'Entertainment', accountId: 'ovo1'},
  { id: 't23', date: '2024-06-25T09:00:00Z', description: 'Salary Deposit', amount: 55000000, category: 'Income', accountId: 'bca1'},
  { id: 't24', date: '2024-06-25T09:05:00Z', description: 'Auto-invest Bibit', amount: -5000000, category: 'Investment', accountId: 'bca1'},
  { id: 't25', date: '2024-06-20T17:00:00Z', description: 'Tokopedia Gadgets', amount: -1500000, category: 'Electronics', accountId: 'gopay1'},
];

export const beneficiaries: Beneficiary[] = [
  {
    id: 'ben1',
    name: 'Budi Santoso',
    bankName: 'BCA',
    accountNumber: '1234567890',
  },
  {
    id: 'ben2',
    name: 'John Smith',
    bankName: 'Mandiri',
    accountNumber: '0987654321',
  },
  {
    id: 'ben3',
    name: 'Mom',
    bankName: 'BNI',
    accountNumber: '1122334455',
  },
];

export const vaults: Vault[] = [
  {
    id: 'vault1',
    name: 'Emergency Fund',
    icon: 'Emergency',
    currentAmount: 2000000,
    targetAmount: 50000000,
    sourceAccountIds: ['bca1'],
    destinationAccountId: 'bca1',
    autoSaveEnabled: true,
    autoSaveFrequency: 'weekly',
    autoSaveAmount: 250000,
    roundUpEnabled: true,
  },
  {
    id: 'vault2',
    name: 'Bali Holiday',
    icon: 'Holiday',
    currentAmount: 3200000,
    targetAmount: 15000000,
    sourceAccountIds: ['gopay1', 'ovo1'],
    destinationAccountId: 'bca1',
    autoSaveEnabled: false,
  },
   {
    id: 'vault3',
    name: 'New Phone',
    icon: 'New Gadget',
    currentAmount: 850000,
    targetAmount: 25000000,
    sourceAccountIds: ['bca1', 'gopay1'],
    destinationAccountId: 'bca1',
    autoSaveEnabled: true,
    autoSaveFrequency: 'monthly',
    autoSaveAmount: 1000000,
  },
  {
    id: 'vault4',
    name: 'Honeymoon Fund',
    icon: 'Wedding',
    currentAmount: 7500000,
    targetAmount: 75000000,
    sourceAccountIds: ['bca1'],
    destinationAccountId: 'bca1',
    isShared: true,
    members: [
      { id: 'user1', name: 'Budi Santoso', avatarUrl: 'https://placehold.co/48x48.png' },
      { id: 'user2', name: 'Jane Doe', avatarUrl: 'https://placehold.co/48x48.png' },
    ],
    imageUrl: 'https://placehold.co/600x400.png',
  }
];

export const budgets: Budget[] = [
  { id: 'bud1', name: 'Monthly Food & Drink', category: 'Food & Drink', amount: 5000000, startDate: '2024-07-01', endDate: '2024-07-31' },
  { id: 'bud2', name: 'Monthly Transport', category: 'Transportation', amount: 1500000, startDate: '2024-07-01', endDate: '2024-07-31' },
  { id: 'bud3', name: 'July Shopping', category: 'Shopping', amount: 10000000, startDate: '2024-07-01', endDate: '2024-07-31' },
];

export const favoriteTransactions: FavoriteTransaction[] = [
  { id: 'fav1', name: 'Transfer to Mom', amount: 1000000, icon: 'User', category: 'Family' },
  { id: 'fav2', name: 'Pay Netflix', amount: 186000, icon: 'Clapperboard', category: 'Bills' },
  { id: 'fav3', name: 'Pay Kredivo', amount: 1250000, icon: 'CreditCard', category: 'Bills' },
  { id: 'fav4', name: 'Top Up GoPay', amount: 200000, icon: 'Wallet', category: 'Top Up' },
];
