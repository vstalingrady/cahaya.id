export type Account = {
  id: string;
  name: string;
  type: 'bank' | 'e-wallet' | 'investment' | 'loan';
  balance: number;
  last4: string;
  holding?: {
    symbol: string;
    amount: number;
  };
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
};

export type Beneficiary = {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
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
    holding: {
      symbol: 'BTC',
      amount: 0.23,
    }
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
    targetAmount: 10000000
  },
  {
    id: 'vault2',
    name: 'Bali Holiday',
    icon: 'Holiday',
    currentAmount: 1500000,
    targetAmount: 5000000
  },
   {
    id: 'vault3',
    name: 'New Phone',
    icon: 'New Gadget',
    currentAmount: 850000,
    targetAmount: 12000000
  }
]

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
    category: 'Bills',
    accountId: 'ovo1',
  },
  {
    id: 'txn6',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Ranch Market',
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
  {
    id: 'txn8',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Kopi Kenangan',
    amount: -22000,
    category: 'Food & Drink',
    accountId: 'gopay1'
  }
];
