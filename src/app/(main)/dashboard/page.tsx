import Link from 'next/link';
import { ArrowRight, Bell, Menu } from 'lucide-react';
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
        <div className="space-y-8 animate-fade-in-up">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Good morning, Vstalin Grady
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-white hover:text-accent transition-colors">
                      <Bell className="w-7 h-7" />
                  </button>
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-purple-800 rounded-2xl shadow-2xl border-red-500/20" data-ai-hint="person avatar"></div>
                   <button className="text-white hover:text-accent transition-colors">
                      <Menu className="w-7 h-7" />
                  </button>
                </div>
            </header>

            <TotalBalance amount={netWorth} transactions={transactions} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/transfer" className="w-full text-left bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between hover:from-red-800/60 hover:to-red-700/60 transition-all duration-300 border border-red-600/20 shadow-2xl group relative overflow-hidden">
                    <NoiseOverlay opacity={0.03} />
                    <div>
                        <p className="font-black text-lg text-white">Pay & Transfer</p>
                        <p className="text-muted-foreground text-sm">QRIS, top-ups, and more</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-accent group-hover:text-accent/80 transition-colors" />
                </Link>
                 <Link href="/insights" className="w-full text-left bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between hover:from-red-800/60 hover:to-red-700/60 transition-all duration-300 border border-red-600/20 shadow-2xl group relative overflow-hidden">
                    <NoiseOverlay opacity={0.03} />
                    <div>
                        <p className="font-black text-lg text-white">Spending Insights</p>
                        <p className="text-muted-foreground text-sm">Track your expenses automatically</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-accent group-hover:text-accent/80 transition-colors" />
                </Link>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Your Accounts</h2>
                    <Link href="/link-account" className="text-sm font-semibold text-accent hover:text-accent/90">
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
