
/**
 * @fileOverview Mock database and API functions for development/testing
 */

// Mock database structure
export const mockInstitutions = [
  {
    institution_id: 'bca_id',
    name: 'Bank Central Asia',
    type: 'bank',
    logo_url: 'https://placehold.co/48x48.png'
  },
  {
    institution_id: 'mandiri_id', 
    name: 'Bank Mandiri',
    type: 'bank',
    logo_url: 'https://placehold.co/48x48.png'
  },
  {
    institution_id: 'gopay_id',
    name: 'GoPay',
    type: 'e-wallet',
    logo_url: 'https://placehold.co/48x48.png'
  }
];

export const db = {
  users: [
    {
      user_id: 'user_budi',
      bank_login: {
        username: 'b_santoso',
        password_plaintext: 'password123'
      },
      accounts: ['acc_bca_checking', 'acc_mandiri_savings']
    }
  ],
  accounts: [
    {
      account_id: 'acc_bca_checking',
      name: 'BCA Checking',
      type: 'checking',
      balance: 5000000,
      currency: 'IDR'
    },
    {
      account_id: 'acc_mandiri_savings',
      name: 'Mandiri Savings',
      type: 'savings', 
      balance: 15000000,
      currency: 'IDR'
    }
  ],
  access_tokens: new Map(),
  
  getUserByAccessToken(token: string) {
    return this.access_tokens.get(token);
  },
  
  setAccessToken(token: string, userInfo: any) {
    this.access_tokens.set(token, userInfo);
  }
};
