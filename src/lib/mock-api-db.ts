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
  subtype: 'checking' | 'savings' | 'digital_wallet' | 'credit_card' | 'mutual_fund' | 'stock' | 'crypto';
  balances: MockBalance;
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
  {
    institution_id: 'bca',
    name: 'BCA',
    logo: '/logos/bca.svg',
    primary_color: '#0060f0',
  },
  {
    institution_id: 'gopay',
    name: 'GoPay',
    logo: '/logos/gopay.svg',
    primary_color: '#00a9de',
  },
  {
    institution_id: 'mandiri',
    name: 'Mandiri',
    logo: '/logos/mandiri.svg',
    primary_color: '#003d79',
  },
];

export const mockUsers: MockUser[] = [
    {
        user_id: 'user_vstalin_123',
        bank_login: {
            username: 'vstalin',
            password_plaintext: 'password123'
        },
        identity: {
            names: ['Vstalin Grady'],
            phone_numbers: ['+6281234567890'],
            emails: ['vstalin.grady@example.com']
        }
    }
];

export const mockAccounts: MockAccount[] = [
  // Vstalin's BCA Accounts
  {
    account_id: 'acc_bca_tahapan_1',
    institution_id: 'bca',
    user_id: 'user_vstalin_123',
    name: 'BCA Tahapan Gold',
    official_name: 'Tahapan Gold Vstalin G',
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
    user_id: 'user_vstalin_123',
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
  // Vstalin's GoPay Account
  {
    account_id: 'acc_gopay_main_3',
    institution_id: 'gopay',
    user_id: 'user_vstalin_123',
    name: 'GoPay',
    official_name: 'Vstalin Grady',
    mask: '7890',
    type: 'ewallet',
    subtype: 'digital_wallet',
    balances: {
      current: 1068000,
      available: 1068000,
      iso_currency_code: 'IDR',
    },
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
    if (publicToken !== 'good_public_token_for_vstalin') {
      return { error: 'Invalid public token' };
    }
    const accessToken = `access_token_vstalin_${Date.now()}`;
    const userId = 'user_vstalin_123';
    tokenStore.set(accessToken, { userId, accounts: ['acc_bca_tahapan_1', 'acc_bca_kredit_2', 'acc_gopay_main_3'] });
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
    if (clientId === 'cuan_client_id' && clientSecret === 'cuan_client_secret') {
        return { access_token: `app_token_${Date.now()}`, expires_in: 3600 };
    }
    return null;
  }
};