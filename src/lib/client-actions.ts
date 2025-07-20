'use client';

// Client-side versions of server actions for standalone APK
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Mock data for standalone app
const mockAccounts = [
  {
    id: 'acc_bca_checking',
    name: 'BCA Checking',
    type: 'bank' as const,
    balance: 5000000,
    currency: 'IDR',
    accountNumber: '1234567890',
    bankName: 'Bank Central Asia'
  },
  {
    id: 'acc_mandiri_savings',
    name: 'Mandiri Savings',
    type: 'bank' as const,
    balance: 15000000,
    currency: 'IDR',
    accountNumber: '0987654321',
    bankName: 'Bank Mandiri'
  }
];

const mockTransactions = [
  {
    id: 'txn_1',
    accountId: 'acc_bca_checking',
    amount: -50000,
    description: 'Coffee Shop',
    category: 'Food & Dining',
    date: new Date().toISOString(),
    type: 'debit' as const
  },
  {
    id: 'txn_2',
    accountId: 'acc_bca_checking',
    amount: -120000,
    description: 'Grocery Store',
    category: 'Groceries',
    date: new Date(Date.now() - 86400000).toISOString(),
    type: 'debit' as const
  }
];

// Client-side authentication functions
export async function clientSignIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function clientSignUp(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function clientSignOut() {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Mock data functions for standalone app
export function getClientAccounts() {
  return Promise.resolve(mockAccounts);
}

export function getClientTransactions() {
  return Promise.resolve(mockTransactions);
}

export function getClientDashboardData() {
  return Promise.resolve({
    accounts: mockAccounts,
    transactions: mockTransactions
  });
}

// Mock AI chat function for offline use
export function getClientAiResponse(message: string) {
  const responses = [
    "I'm currently running in offline mode. For full AI features, please connect to the internet.",
    "Your financial data looks good! I'd love to provide more detailed insights when you're online.",
    "That's a great question! For personalized AI advice, please ensure you have an internet connection.",
    "I can see your basic financial information. Connect to the internet for advanced AI analysis."
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return Promise.resolve({
    aiResponse: { role: 'model' as const, content: randomResponse },
    chatId: 'offline-chat'
  });
}

// Local storage helpers for offline data persistence
export function saveToLocalStorage(key: string, data: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export function getFromLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  return null;
}