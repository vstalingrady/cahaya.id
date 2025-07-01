'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { accounts, transactions } from '@/lib/data';
import NoiseOverlay from '@/components/noise-overlay';
import TransactionHistory from '@/components/dashboard/transaction-history';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Helper function to format currency
const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

export default function AccountDetailPage() {
  const params = useParams();
  const accountId = params.id as string;
  
  const account = accounts.find(acc => acc.id === accountId);
  
  if (!account) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <header className="flex items-center relative">
            <Link href="/dashboard" className="absolute left-0">
                <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <h1 className="text-2xl font-black mx-auto bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
                Error
            </h1>
        </header>
        <Alert variant="destructive">
            <AlertDescription>Account not found. Please go back to the dashboard.</AlertDescription>
        </Alert>
    </div>
    );
  }

  const accountTransactions = transactions.filter(t => t.accountId === accountId);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-center relative">
        <Link href="/dashboard" className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <div className="text-center mx-auto">
          <h1 className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
            {account.name}
          </h1>
          <p className="text-lg font-bold text-white">{formatCurrency(account.balance)}</p>
        </div>
      </header>

      {account.type === 'investment' && account.holdings && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white font-serif">Portfolio Holdings</h2>
          <div className="grid grid-cols-1 gap-4">
            {account.holdings.map(holding => (
              <div key={holding.id} className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between border border-red-600/20 shadow-2xl relative overflow-hidden">
                <NoiseOverlay opacity={0.03} />
                <div className="flex items-center gap-4">
                   <Image src={holding.logoUrl} alt={holding.name} width={48} height={48} className="rounded-full" data-ai-hint={`${holding.name} coin`} />
                  <div>
                    <p className="font-bold text-lg text-white">{holding.name}</p>
                    <p className="text-red-300 text-sm font-mono">{holding.amount} {holding.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg text-white">{formatCurrency(holding.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(account.type === 'bank' || account.type === 'e-wallet') && (
         <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white font-serif">Transaction History</h2>
          {accountTransactions.length > 0 ? (
            <TransactionHistory transactions={accountTransactions} />
          ) : (
            <div className="bg-gradient-to-r from-red-950/50 to-red-900/50 p-4 rounded-xl text-center text-muted-foreground">
                No transactions for this account yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
