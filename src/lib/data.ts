export type CryptoHolding = {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  value: number; // in IDR
  logoUrl: string;
}

export type Account = {
  id: string;
  name: string;
  type: 'bank' | 'e-wallet' | 'investment' | 'loan';
  balance: number;
  last4: string;
  holdings?: CryptoHolding[];
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  accountId: string;
};

export type Vault = {
  id: string;
  name: string;
  icon: string;
  currentAmount: number;
  targetAmount: number;
  sourceAccountIds: string[];
  destinationAccountId: string;
};

export type Beneficiary = {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
};

export type Budget = {
  category: string;
  amount: number;
};


export const accounts: Account[] = [
  {
    id: 'bca1',
    name: 'BCA Main Account',
    type: 'bank',
    balance: 15250000,
    last4: '2847',
  },
  {
    id: 'gopay1',
    name: 'GoPay',
    type: 'e-wallet',
    balance: 875000,
    last4: '0812',
  },
  {
    id: 'ovo1',
    name: 'OVO Premier',
    type: 'e-wallet',
    balance: 250000,
    last4: '0857',
  },
  {
    id: 'bibit1',
    name: 'Bibit Portfolio',
    type: 'investment',
    balance: 45600000,
    last4: 'Invst'
  },
  {
    id: 'pintu1',
    name: 'Pintu Crypto',
    type: 'investment',
    balance: 25400000,
    last4: 'Crpto',
    holdings: [
      { id: 'btc', name: 'Bitcoin', symbol: 'BTC', amount: 0.23, value: 15000000, logoUrl: 'https://placehold.co/48x48.png' },
      { id: 'eth', name: 'Ethereum', symbol: 'ETH', amount: 1.5, value: 8000000, logoUrl: 'https://placehold.co/48x48.png' },
      { id: 'sol', name: 'Solana', symbol: 'SOL', amount: 20, value: 2400000, logoUrl: 'https://placehold.co/48x48.png' },
    ]
  },
  {
    id: 'kredivo1',
    name: 'Kredivo PayLater',
    type: 'loan',
    balance: 1250000, // Represents outstanding debt
    last4: 'Loan'
  }
];

export const beneficiaries: Beneficiary[] = [
  {
    id: 'ben1',
    name: 'Vstalin Grady',
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
    targetAmount: 10000000,
    sourceAccountIds: ['bca1'],
    destinationAccountId: 'bca1',
  },
  {
    id: 'vault2',
    name: 'Bali Holiday',
    icon: 'Holiday',
    currentAmount: 1500000,
    targetAmount: 5000000,
    sourceAccountIds: ['gopay1', 'ovo1'],
    destinationAccountId: 'bca1',
  },
   {
    id: 'vault3',
    name: 'New Phone',
    icon: 'New Gadget',
    currentAmount: 850000,
    targetAmount: 12000000,
    sourceAccountIds: ['bca1', 'gopay1'],
    destinationAccountId: 'bca1',
  }
]

export const budgets: Budget[] = [
  { category: 'Food & Drink', amount: 1500000 },
  { category: 'Transportation', amount: 500000 },
  { category: 'Shopping', amount: 1000000 },
  { category: 'Bills', amount: 500000 },
  { category: 'Groceries', amount: 750000 },
  { category: 'Entertainment', amount: 400000 },
];

export const transactions: Transaction[] = [
  {
    id: 'txn1',
    date: '2024-07-20T10:00:00.000Z',
    description: 'Starbucks Grand Indonesia',
    amount: -55000,
    category: 'Food & Drink',
    accountId: 'gopay1',
  },
  {
    id: 'txn2',
    date: '2024-07-19T15:30:00.000Z',
    description: 'Gojek Ride',
    amount: -25000,
    category: 'Transportation',
    accountId: 'gopay1',
  },
  {
    id: 'txn3',
    date: '2024-07-25T09:00:00.000Z',
    description: 'Salary Deposit',
    amount: 15000000,
    category: 'Income',
    accountId: 'bca1',
  },
  {
    id: 'txn4',
    date: '2024-07-18T18:45:00.000Z',
    description: 'Uniqlo Purchase',
    amount: -799000,
    category: 'Shopping',
    accountId: 'bca1',
  },
  {
    id: 'txn5',
    date: '2024-07-17T11:00:00.000Z',
    description: 'Netflix Subscription',
    amount: -186000,
    category: 'Bills',
    accountId: 'ovo1',
  },
  {
    id: 'txn6',
    date: '2024-07-16T13:20:00.000Z',
    description: 'Ranch Market',
    amount: -550000,
    category: 'Groceries',
    accountId: 'bca1',
  },
   {
    id: 'txn7',
    date: '2024-07-15T20:00:00.000Z',
    description: 'Cinema XXI',
    amount: -100000,
    category: 'Entertainment',
    accountId: 'ovo1',
  },
  {
    id: 'txn8',
    date: '2024-07-14T08:30:00.000Z',
    description: 'Kopi Kenangan',
    amount: -22000,
    category: 'Food & Drink',
    accountId: 'gopay1'
  }
];
