import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { accounts, transactions } from '@/lib/data';
import TotalBalance from '@/components/dashboard/total-balance';
import AccountCard from '@/components/dashboard/account-card';
import TransactionHistory from '@/components/dashboard/transaction-history';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import NoiseOverlay from '@/components/noise-overlay';

export default function DashboardPage() {
    const totalAssets = accounts
        .filter(acc => acc.type !== 'loan')
        .reduce((sum, acc) => sum + acc.balance, 0);
    
    const totalLiabilities = accounts
        .filter(acc => acc.type === 'loan')
        .reduce((sum, acc) => sum + acc.balance, 0);
        
    const netWorth = totalAssets - totalLiabilities;

    const banks = accounts.filter(acc => acc.type === 'bank');
    const ewallets = accounts.filter(acc => acc.type === 'e-wallet');
    const investments = accounts.filter(acc => acc.type === 'investment');
    const loans = accounts.filter(acc => acc.type === 'loan');

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

            <TotalBalance amount={netWorth} />

            <div className="grid grid-cols-1 gap-4">
                <Link href="/transfer" className="w-full text-left bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between hover:from-red-800/60 hover:to-red-700/60 transition-all duration-300 border border-red-600/20 shadow-2xl group relative overflow-hidden">
                    <NoiseOverlay opacity={0.03} />
                    <div>
                        <p className="font-black text-lg text-white">Send & Request</p>
                        <p className="text-red-300 text-sm">Transfer, request, or split bills</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
                </Link>
                 <Link href="/insights" className="w-full text-left bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between hover:from-red-800/60 hover:to-red-700/60 transition-all duration-300 border border-red-600/20 shadow-2xl group relative overflow-hidden">
                    <NoiseOverlay opacity={0.03} />
                    <div>
                        <p className="font-black text-lg text-white">Spending Insights</p>
                        <p className="text-red-300 text-sm">Track your expenses automatically</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
                </Link>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Your Accounts</h2>
                    <Link href="/link-account" className="text-sm font-semibold text-red-400 hover:text-red-300">
                        Link New
                    </Link>
                </div>
                <Accordion type="multiple" defaultValue={['banks', 'e-wallets']} className="space-y-4">
                    <AccordionItem value="banks" className="border-none">
                        <AccordionTrigger className="bg-gradient-to-r from-red-950/40 to-red-900/40 backdrop-blur-xl p-4 rounded-xl hover:no-underline hover:bg-red-900/60 text-white font-bold">Banks</AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-2">
                             {banks.map(account => <AccountCard key={account.id} account={account} />)}
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="e-wallets" className="border-none">
                        <AccordionTrigger className="bg-gradient-to-r from-red-950/40 to-red-900/40 backdrop-blur-xl p-4 rounded-xl hover:no-underline hover:bg-red-900/60 text-white font-bold">E-Wallets</AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-2">
                             {ewallets.map(account => <AccountCard key={account.id} account={account} />)}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="investments" className="border-none">
                        <AccordionTrigger className="bg-gradient-to-r from-red-950/40 to-red-900/40 backdrop-blur-xl p-4 rounded-xl hover:no-underline hover:bg-red-900/60 text-white font-bold">Investments</AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-2">
                             {investments.map(account => <AccountCard key={account.id} account={account} />)}
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="loans" className="border-none">
                        <AccordionTrigger className="bg-gradient-to-r from-red-950/40 to-red-900/40 backdrop-blur-xl p-4 rounded-xl hover:no-underline hover:bg-red-900/60 text-white font-bold">Online Loans</AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-2">
                             {loans.map(account => <AccountCard key={account.id} account={account} />)}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
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
