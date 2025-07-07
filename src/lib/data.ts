
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

export async function getLoginHistory(userId: string) {
  const historyCollection = collection(db, 'users', userId, 'login_history');
  const q = query(historyCollection, orderBy('timestamp', 'desc'), limit(10));
  const querySnapshot = await getDocs(q);
  const history = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return history;
}

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
  institutionSlug: string;
  type: 'bank' | 'e-wallet' | 'investment' | 'loan';
  balance: number;
  accountNumber: string;
  holdings?: CryptoHolding[];
  isPinned?: boolean;
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  accountId: string;
};

export type VaultMember = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Vault = {
  id: string;
  name: string;
  icon: string;
  currentAmount: number;
  targetAmount: number;
  sourceAccountIds: string[];
  destinationAccountId: string;
  autoSaveEnabled?: boolean;
  autoSaveFrequency?: 'daily' | 'weekly' | 'monthly';
  autoSaveAmount?: number;
  roundUpEnabled?: boolean;
  isShared?: boolean;
  members?: VaultMember[];
  imageUrl?: string;
};

export type Beneficiary = {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
};

export type Budget = {
  id: string;
  name: string;
  category: string;
  amount: number;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
};

export type FavoriteTransaction = {
  id: string;
  name: string;
  amount: number;
  icon: string;
  category: string;
};

export type FinancialInstitution = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
  type: 'bank' | 'e-wallet' | 'investment' | 'loan' | 'other';
};

export const financialInstitutions: FinancialInstitution[] = [
  // Major National Banks
  { id: 'bca', slug: 'bca', name: 'BCA', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia_logo.svg', type: 'bank' },
  { id: 'mandiri', slug: 'mandiri', name: 'Mandiri', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo.svg', type: 'bank' },
  { id: 'bri', slug: 'bri', name: 'BRI', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/68/BANK_BRI_logo.svg', type: 'bank' },
  { id: 'bni', slug: 'bni', name: 'BNI', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/B/BA/Logo_BNI.svg/200px-Logo_BNI.svg.png', type: 'bank' },
  { id: 'cimb', slug: 'cimb', name: 'CIMB Niaga', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/CIMB_Niaga_logo.svg', type: 'bank' },
  { id: 'permata', slug: 'permata', name: 'Permata Bank', logoUrl: 'https://upload.wikimedia.org/wikipedia/id/thumb/a/a0/PermataBank_logo.svg/2560px-PermataBank_logo.svg.png', type: 'bank' },
  { id: 'danamon', slug: 'danamon', name: 'Bank Danamon', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Danamon_logo.svg/2560px-Danamon_logo.svg.png', type: 'bank' },

  // E-Wallets
  { id: 'gopay', slug: 'gopay', name: 'GoPay', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg', type: 'e-wallet' },
  { id: 'ovo', slug: 'ovo', name: 'OVO', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg', type: 'e-wallet' },
  { id: 'dana', slug: 'dana', name: 'DANA', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_DANA_blue.svg', type: 'e-wallet' },
  { id: 'shopeepay', slug: 'shopeepay', name: 'ShopeePay', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/ShopeePay_logo.svg/2560px-ShopeePay_logo.svg.png', type: 'e-wallet' },
  { id: 'linkaja', slug: 'linkaja', name: 'LinkAja', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/LinkAja.svg/2560px-LinkAja.svg.png', type: 'e-wallet' },

  // Investment Platforms
  { id: 'bibit', slug: 'bibit', name: 'Bibit', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Bibit.id_logo.svg', type: 'investment' },
  { id: 'pintu', slug: 'pintu', name: 'Pintu', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Pintu_logo.svg/2560px-Pintu_logo.svg.png', type: 'investment' },

  // Loan Providers
  { id: 'kredivo', slug: 'kredivo', name: 'Kredivo', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Kredivo_logo.svg/2560px-Kredivo_logo.svg.png', type: 'loan' },

  // Other Supported Banks
  { id: 'bsi', slug: 'bsi', name: 'BSI', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bank_Syariah_Indonesia.svg/2560px-Bank_Syariah_Indonesia.svg.png', type: 'bank' },
  { id: 'btn', slug: 'btn', name: 'BTN', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Bank_Tabungan_Negara_logo.svg/2560px-Bank_Tabungan_Negara_logo.svg.png', type: 'bank' },
  { id: 'ocbc', slug: 'ocbc', name: 'OCBC NISP', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/OCBC_NISP_logo.svg/2560px-OCBC_NISP_logo.svg.png', type: 'bank' },
  { id: 'panin', slug: 'panin', name: 'Panin Bank', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Panin_Bank_logo.svg/2560px-Panin_Bank_logo.svg.png', type: 'bank' },
  { id: 'dbs', slug: 'dbs', name: 'DBS Indonesia', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/DBS_Bank_logo.svg/2560px-DBS_Bank_logo.svg.png', type: 'bank' },
  { id: 'uob', slug: 'uob', name: 'UOB Indonesia', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/UOB_Logo.svg/1280px-UOB_Logo.svg.png', type: 'bank' },
  { id: 'maybank', slug: 'maybank', name: 'Maybank', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Maybank_logo.svg/2560px-Maybank_logo.svg.png', type: 'bank' },
  { id: 'sinarmas', slug: 'sinarmas', name: 'Bank Sinarmas', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bank-sinarmas-logo.svg/2560px-Bank-sinarmas-logo.svg.png', type: 'bank' },
  { id: 'mega', slug: 'mega', name: 'Bank Mega', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Logo_Bank_Mega.svg/2560px-Logo_Bank_Mega.svg.png', type: 'bank' },
  { id: 'jenius', slug: 'jenius', name: 'Jenius', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Jenius-logo.svg/2560px-Jenius-logo.svg.png', type: 'bank' },
  
  // Mobile Credit & Data
  { id: 'telkomsel', slug: 'telkomsel', name: 'Telkomsel', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Telkomsel_2021_icon.svg/1024px-Telkomsel_2021_icon.svg.png', type: 'other' },
  { id: 'indosat', slug: 'indosat', name: 'Indosat', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Indosat_Ooredoo_Hutchison_logo.svg/2560px-Indosat_Ooredoo_Hutchison_logo.svg.png', type: 'other' },
  { id: 'xl-axiata', slug: 'xl-axiata', name: 'XL Axiata', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/XL_logo_2016.svg/2560px-XL_logo_2016.svg.png', type: 'other' },
  { id: 'smartfren', slug: 'smartfren', name: 'Smartfren', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Smartfren_logo.svg/2560px-Smartfren_logo.svg.png', type: 'other' },

  // Utilities
  { id: 'pln', slug: 'pln', name: 'PLN', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Logo_PLN.svg', type: 'other' },
  { id: 'indihome', slug: 'indihome', name: 'IndiHome', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/IndiHome_2023.svg', type: 'other' },
  { id: 'first-media', slug: 'first-media', name: 'First Media', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/First_Media_logo.svg/2560px-First_Media_logo.svg.png', type: 'other' },
  { id: 'biznet', slug: 'biznet', name: 'Biznet', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Biznet_logo.svg/2560px-Biznet_logo.svg.png', type: 'other' },

  // Government
  { id: 'bpjs', slug: 'bpjs', name: 'BPJS Kesehatan', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/BPJS_Kesehatan_logo.svg', type: 'other' },

  // Multifinance
  { id: 'adira', slug: 'adira', name: 'Adira Finance', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Adira_Finance_logo.svg/1280px-Adira_Finance_logo.svg.png', type: 'other' },
  
  // E-Commerce & Transport
  { id: 'shopee', slug: 'shopee', name: 'Shopee', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Shopee.svg/1200px-Shopee.svg.png', type: 'other' },
  { id: 'traveloka', slug: 'traveloka', name: 'Traveloka', logoUrl: 'https://upload.wikimedia.org/wikipedia/id/thumb/d/d7/Traveloka_Primary_Logo.svg/2560px-Traveloka_Primary_Logo.svg.png', type: 'other' },
  { id: 'kai', slug: 'kai', name: 'KAI', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Logo_KAI_Commuter_2020.svg/1024px-Logo_KAI_Commuter_2020.svg.png', type: 'other' },
  
  // Game & Digital Vouchers
  { id: 'google-play', slug: 'google-play', name: 'Google Play', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Google_Play_2022_logo.svg/2560px-Google_Play_2022_logo.svg.png', type: 'other' },
  { id: 'spotify', slug: 'spotify', name: 'Spotify', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/2560px-Spotify_logo_with_text.svg.png', type: 'other' },
  { id: 'steam', slug: 'steam', name: 'Steam', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png', type: 'other' },
];
