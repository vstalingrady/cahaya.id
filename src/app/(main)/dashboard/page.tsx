import Link from 'next/link';
import { accounts, transactions } from '@/lib/data';
import TotalBalance from '@/components/dashboard/total-balance';
import AccountCard from '@/components/dashboard/account-card';

export default function DashboardPage() {
    const totalAssets = accounts
        .filter(acc => acc.type !== 'loan')
        .reduce((sum, acc) => sum + acc.balance, 0);
    
    const totalLiabilities = accounts
        .filter(acc => acc.type === 'loan')
        .reduce((sum, acc) => sum + acc.balance, 0);
        
    const netWorth = totalAssets - totalLiabilities;

    return (
        <div className="space-y-8 animate-fade-in-up">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
                        Good morning, Vstalin
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-accent rounded-2xl shadow-2xl border-red-500/20" data-ai-hint="person avatar"></div>
                </div>
            </header>

            <TotalBalance amount={netWorth} transactions={transactions} />

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white font-serif">Your Accounts</h2>
                    <Link href="/link-account" className="text-sm font-semibold text-accent hover:text-accent/90">
                        Link New
                    </Link>
                </div>
                <div className="space-y-2">
                    {accounts.map(account => (
                        <AccountCard key={account.id} account={account} />
                    ))}
                </div>
            </div>
        </div>
    );
}
