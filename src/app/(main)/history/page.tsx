
'use client';

import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import TransactionCalendar from '@/components/profile/transaction-calendar';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { getDashboardData } from '@/lib/actions';
import { type Transaction, type Account } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export default function HistoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { accounts: fetchedAccounts, transactions: fetchedTransactions } = await getDashboardData(user.uid);
        setAccounts(fetchedAccounts);
        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error("Failed to fetch history data:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load transaction history.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user, toast]);

  const currentNetWorth = useMemo(() => {
    if (isLoading) return 0;
    const totalAssets = accounts
      .filter(acc => acc.type !== 'loan')
      .reduce((sum, acc) => sum + acc.balance, 0);
    const totalLiabilities = accounts
      .filter(acc => acc.type === 'loan')
      .reduce((sum, acc) => sum + acc.balance, 0);
    return totalAssets - totalLiabilities;
  }, [accounts, isLoading]);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-center relative">
        <Link href="/dashboard" className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-bold mx-auto font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Transaction History
        </h1>
      </header>

      <div className="space-y-4">
         <p className="text-muted-foreground text-center">Select a date to view all transactions from that day.</p>
         {isLoading ? (
            <div className="flex items-center justify-center pt-24">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
         ) : (
            <TransactionCalendar transactions={transactions} currentBalance={currentNetWorth} />
         )}
      </div>

    </div>
  );
}
