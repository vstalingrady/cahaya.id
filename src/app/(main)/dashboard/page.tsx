import Link from 'next/link';
import { Plus } from 'lucide-react';
import { accounts, transactions } from '@/lib/data';
import TotalBalance from '@/components/dashboard/total-balance';
import AccountCard from '@/components/dashboard/account-card';
import TransactionHistory from '@/components/dashboard/transaction-history';

export default function DashboardPage() {
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                        Good morning, Budi
                    </h1>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-2xl border border-red-500/20" data-ai-hint="person avatar"></div>
            </header>

            <TotalBalance amount={totalBalance} />

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Your Accounts</h2>
                    <Link href="/signup" className="text-sm font-semibold text-red-400 hover:text-red-300 flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Link New
                    </Link>
                </div>
                <div className="space-y-4">
                    {accounts.map(account => (
                        <AccountCard key={account.id} account={account} />
                    ))}
                </div>
            </div>
            
            <div>
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                </div>
                <TransactionHistory transactions={transactions.slice(0, 4)} />
            </div>
        </div>
    );
}
