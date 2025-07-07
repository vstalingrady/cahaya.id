// src/lib/mock-api-db.ts
/**
 * This file serves as a simple, in-memory "database" for our mock Ayoconnect API.
 * In a real application, this data would live in a secure, persistent database.
 * We are using snake_case for keys to mimic a typical external API's JSON response format.
 */

export interface MockInstitution {
  institution_id: string;
  name: string;
  logo: string; // URL to a logo
  primary_color: string; // hex code
}

export type CryptoHolding = {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  value: number; // in IDR
  logoUrl: string;
}

export interface MockBalance {
  current: number;
  available: number | null;
  iso_currency_code: 'IDR';
}

export interface MockAccount {
  account_id: string; // Unique ID for the account
  institution_id: string;
  user_id: string; // The user this account belongs to
  name: string;
  official_name: string | null;
  mask: string; // Last 4 digits
  type: 'depository' | 'ewallet' | 'credit' | 'investment' | 'loan';
  subtype: 'checking' | 'savings' | 'digital_wallet' | 'credit_card' | 'mutual_fund' | 'stock' | 'crypto' | 'personal_loan';
  balances: MockBalance;
  holdings?: CryptoHolding[];
}

export interface MockTransaction {
  transaction_id: string;
  account_id: string;
  amount: number; // Negative for debits, positive for credits
  iso_currency_code: 'IDR';
  description: string;
  merchant_name: string | null;
  date: string; // YYYY-MM-DD
  category: string[];
  pending: boolean;
}

export interface MockUser {
    user_id: string; // Our internal ID for the user
    // These credentials are for the *fake bank login* form
    bank_login: { 
        username: string;
        password_plaintext: string; // DO NOT DO THIS IN A REAL APP
    };
    identity: {
        names: string[];
        phone_numbers: string[];
        emails: string[];
    }
}

// --- DATABASE TABLES ---

export const mockInstitutions: MockInstitution[] = [
  { institution_id: 'bca', name: 'BCA', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia_logo.svg', primary_color: '#0060f0' },
  { institution_id: 'gopay', name: 'GoPay', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg', primary_color: '#00a9de' },
  { institution_id: 'mandiri', name: 'Mandiri', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo.svg', primary_color: '#003d79' },
  { institution_id: 'bibit', name: 'Bibit', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Bibit.id_logo.svg', primary_color: '#4CAF50' },
  { institution_id: 'pintu', name: 'Pintu', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Pintu_logo.svg/2560px-Pintu_logo.svg.png', primary_color: '#00A3FF' },
  { institution_id: 'kredivo', name: 'Kredivo', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Kredivo_logo.svg/2560px-Kredivo_logo.svg.png', primary_color: '#0A429E' },
];


export const mockUsers: MockUser[] = [
    {
        user_id: 'user_budi_123',
        bank_login: {
            username: 'b_santoso',
            password_plaintext: 'password123'
        },
        identity: {
            names: ['Budi Santoso'],
            phone_numbers: ['+6281234567890'],
            emails: ['budi.santoso@example.com']
        }
    }
];

export const mockAccounts: MockAccount[] = [
  // Budi's BCA Accounts
  {
    account_id: 'acc_bca_tahapan_1',
    institution_id: 'bca',
    user_id: 'user_budi_123',
    name: 'BCA Tahapan Gold',
    official_name: 'Tahapan Gold Budi S',
    mask: '2847',
    type: 'depository',
    subtype: 'checking',
    balances: {
      current: 85200501,
      available: 85200501,
      iso_currency_code: 'IDR',
    },
  },
  {
    account_id: 'acc_bca_kredit_2',
    institution_id: 'bca',
    user_id: 'user_budi_123',
    name: 'BCA Everyday Card',
    official_name: 'BCA Mastercard Everyday',
    mask: '5588',
    type: 'credit',
    subtype: 'credit_card',
    balances: {
      current: -4500000,
      available: 15500000,
      iso_currency_code: 'IDR',
    },
  },
  // Budi's GoPay Account
  {
    account_id: 'acc_gopay_main_3',
    institution_id: 'gopay',
    user_id: 'user_budi_123',
    name: 'GoPay',
    official_name: 'Budi Santoso',
    mask: '7890',
    type: 'ewallet',
    subtype: 'digital_wallet',
    balances: {
      current: 1068000,
      available: 1068000,
      iso_currency_code: 'IDR',
    },
  },
   {
    account_id: 'acc_mandiri_payroll_4',
    institution_id: 'mandiri',
    user_id: 'user_budi_123',
    name: 'Mandiri Payroll',
    official_name: 'Budi Santoso - Gaji',
    mask: '5566',
    type: 'depository',
    subtype: 'checking',
    balances: { current: 42500000, available: 42500000, iso_currency_code: 'IDR' },
  },
  {
    account_id: 'acc_bibit_main_5',
    institution_id: 'bibit',
    user_id: 'user_budi_123',
    name: 'Bibit Portfolio',
    official_name: 'Budi Santoso - Bibit',
    mask: 'IVST',
    type: 'investment',
    subtype: 'mutual_fund',
    balances: { current: 125000000, available: 125000000, iso_currency_code: 'IDR' },
  },
  {
    account_id: 'acc_pintu_main_6',
    institution_id: 'pintu',
    user_id: 'user_budi_123',
    name: 'Pintu Crypto',
    official_name: 'Budi S - Pintu',
    mask: 'CRPT',
    type: 'investment',
    subtype: 'crypto',
    balances: { current: 75000000, available: 75000000, iso_currency_code: 'IDR' },
    holdings: [
      { id: 'btc', name: 'Bitcoin', symbol: 'BTC', amount: 0.65, value: 45000000, logoUrl: 'https://placehold.co/48x48.png' },
      { id: 'eth', name: 'Ethereum', symbol: 'ETH', amount: 5, value: 25000000, logoUrl: 'https://placehold.co/48x48.png' },
    ]
  },
  {
    account_id: 'acc_kredivo_loan_7',
    institution_id: 'kredivo',
    user_id: 'user_budi_123',
    name: 'Kredivo PayLater',
    official_name: null,
    mask: 'LOAN',
    type: 'loan',
    subtype: 'personal_loan',
    balances: { current: 5500000, available: 14500000, iso_currency_code: 'IDR' },
  },
];

export const mockTransactions: MockTransaction[] = [
  // BCA Tahapan Transactions
  {
    transaction_id: 'txn_1',
    account_id: 'acc_bca_tahapan_1',
    amount: 55000000,
    iso_currency_code: 'IDR',
    description: 'Salary Deposit',
    merchant_name: 'PT Cuan Sejahtera',
    date: '2024-07-25',
    category: ['Income', 'Salary'],
    pending: false,
  },
  {
    transaction_id: 'txn_2',
    account_id: 'acc_bca_tahapan_1',
    amount: -1800000,
    iso_currency_code: 'IDR',
    description: 'Dinner at SKYE',
    merchant_name: 'SKYE Bar & Restaurant',
    date: '2024-07-24',
    category: ['Food and Drink', 'Restaurants'],
    pending: false,
  },
  {
    transaction_id: 'txn_3',
    account_id: 'acc_bca_tahapan_1',
    amount: -3200000,
    iso_currency_code: 'IDR',
    description: 'Garuda Flight to Bali',
    merchant_name: 'Garuda Indonesia',
    date: '2024-07-19',
    category: ['Travel', 'Airlines'],
    pending: false,
  },
  // GoPay Transactions
  {
    transaction_id: 'txn_4',
    account_id: 'acc_gopay_main_3',
    amount: -120000,
    iso_currency_code: 'IDR',
    description: "GoFood McDonald's",
    merchant_name: "McDonald's",
    date: '2024-07-26',
    category: ['Food and Drink', 'Fast Food'],
    pending: false,
  },
  {
    transaction_id: 'txn_5',
    account_id: 'acc_gopay_main_3',
    amount: -35000,
    iso_currency_code: 'IDR',
    description: 'Gojek Ride',
    merchant_name: 'Gojek',
    date: '2024-07-23',
    category: ['Transportation', 'Ride Sharing'],
    pending: false,
  },
  // BCA Credit Card Transactions
  {
    transaction_id: 'txn_6',
    account_id: 'acc_bca_kredit_2',
    amount: -2500000,
    iso_currency_code: 'IDR',
    description: 'Shopping at Zara',
    merchant_name: 'Zara',
    date: '2024-07-27',
    category: ['Shopping', 'Clothing'],
    pending: false,
  },
  {
    transaction_id: 'txn_7',
    account_id: 'acc_bca_kredit_2',
    amount: -54999,
    iso_currency_code: 'IDR',
    description: 'Spotify Premium',
    merchant_name: 'Spotify',
    date: '2024-07-27',
    category: ['Services', 'Subscription'],
    pending: false,
  },
  // New Transactions for new accounts
  { transaction_id: 'txn_8', account_id: 'acc_mandiri_payroll_4', amount: 45000000, iso_currency_code: 'IDR', description: 'Bonus Tahunan', merchant_name: 'PT Cuan Sejahtera', date: '2024-06-30', category: ['Income', 'Bonus'], pending: false },
  { transaction_id: 'txn_9', account_id: 'acc_mandiri_payroll_4', amount: -250000, iso_currency_code: 'IDR', description: 'Biaya Admin', merchant_name: 'Bank Mandiri', date: '2024-07-31', category: ['Fees', 'Bank Fees'], pending: false },
  { transaction_id: 'txn_10', account_id: 'acc_kredivo_loan_7', amount: -5500000, iso_currency_code: 'IDR', description: 'Pembayaran Tagihan Kredivo', merchant_name: 'Kredivo', date: '2024-07-01', category: ['Payments', 'Loan Payments'], pending: false },
];

// --- API Helper Functions ---

/**
 * A simple key-value store to act as our session/token database.
 * In a real app, use Redis or a proper database for this.
 */
const tokenStore = new Map<string, any>();

export const db = {
  // Data tables
  institutions: mockInstitutions,
  users: mockUsers,
  accounts: mockAccounts,
  transactions: mockTransactions,
  
  // Token management
  // This simulates exchanging a public token for an access token
  exchangePublicToken: (publicToken: string) => {
    if (publicToken !== 'good_public_token_for_budi') {
      return { error: 'Invalid public token' };
    }
    const accessToken = `access_token_budi_${Date.now()}`;
    const userId = 'user_budi_123';
    const allAccountIds = mockAccounts.filter(a => a.user_id === userId).map(a => a.account_id);
    tokenStore.set(accessToken, { userId, accounts: allAccountIds });
    return { access_token: accessToken, user_id: userId };
  },

  // This simulates verifying an access token
  getUserByAccessToken: (accessToken: string) => {
    if (!accessToken || !tokenStore.has(accessToken)) {
        return null;
    }
    return tokenStore.get(accessToken);
  },

  // This simulates the OAuth client credentials flow
  getAppToken: (clientId: string, clientSecret: string) => {
    if (clientId === 'cahaya_client_id' && clientSecret === 'cahaya_client_secret') {
        return { access_token: `app_token_${Date.now()}`, expires_in: 3600 };
    }
    return null;
  }
};
