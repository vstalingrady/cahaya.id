export type Account = {
  id: string;
  name: string;
  type: 'bank' | 'e-wallet';
  balance: number;
  last4: string;
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  accountId: string;
};

export const accounts: Account[] = [
  {
    id: 'bca1',
    name: 'BCA Main Account',
    type: 'bank',
    balance: 25750000,
    last4: '1234',
  },
  {
    id: 'gopay1',
    name: 'GoPay',
    type: 'e-wallet',
    balance: 850000,
    last4: '5678',
  },
  {
    id: 'ovo1',
    name: 'OVO Premier',
    type: 'e-wallet',
    balance: 1235000,
    last4: '1122',
  },
];

export const transactions: Transaction[] = [
  {
    id: 'txn1',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Starbucks Grand Indonesia',
    amount: -55000,
    category: 'Food & Drink',
    accountId: 'gopay1',
  },
  {
    id: 'txn2',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Gojek Ride',
    amount: -25000,
    category: 'Transportation',
    accountId: 'gopay1',
  },
  {
    id: 'txn3',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Salary Deposit',
    amount: 15000000,
    category: 'Income',
    accountId: 'bca1',
  },
  {
    id: 'txn4',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Uniqlo Purchase',
    amount: -799000,
    category: 'Shopping',
    accountId: 'bca1',
  },
  {
    id: 'txn5',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Netflix Subscription',
    amount: -186000,
    category: 'Entertainment',
    accountId: 'ovo1',
  },
  {
    id: 'txn6',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Ranch Market Groceries',
    amount: -550000,
    category: 'Groceries',
    accountId: 'bca1',
  },
   {
    id: 'txn7',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Cinema XXI',
    amount: -100000,
    category: 'Entertainment',
    accountId: 'ovo1',
  },
];
