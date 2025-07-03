import { NextResponse } from 'next/server';

export type FavoriteTransaction = {
  id: string;
  name: string;
  amount: number;
  icon: string;
  category: string;
};

export const favoriteTransactions: FavoriteTransaction[] = [
  { id: 'fav1', name: 'Transfer to Mom', amount: 1000000, icon: 'User', category: 'Family' },
  { id: 'fav2', name: 'Pay Netflix', amount: 186000, icon: 'Clapperboard', category: 'Bills' },
  { id: 'fav3', name: 'Pay Kredivo', amount: 1250000, icon: 'CreditCard', category: 'Bills' },
  { id: 'fav4', name: 'Top Up GoPay', amount: 200000, icon: 'Wallet', category: 'Top Up' },
];

export async function GET() {
  return NextResponse.json(favoriteTransactions);
}
