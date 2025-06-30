import Link from 'next/link';
import { accounts, transactions } from '@/lib/data';
import TotalBalance from '@/components/dashboard/total-balance';
import AccountCard from '@/components/dashboard/account-card';
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
                    <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
                        Good morning, Vstalin Grady
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
                <Accordion type="multiple" defaultValue={['banks', 'e-wallets']} className="space-y-4">
                    <AccordionItem value="banks" className="border-none">
                        <AccordionTrigger className="bg-gradient-to-r from-red-950/40 to-red-900/40 backdrop-blur-xl p-4 rounded-xl hover:no-underline hover:bg-red-900/60 text-white font-semibold">Banks</AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-2">
                             {banks.map(account => <AccountCard key={account.id} account={account} />)}
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="e-wallets" className="border-none">
                        <AccordionTrigger className="bg-gradient-to-r from-red-950/40 to-red-900/40 backdrop-blur-xl p-4 rounded-xl hover:no-underline hover:bg-red-900/60 text-white font-semibold">E-Wallets</AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-2">
                             {ewallets.map(account => <AccountCard key={account.id} account={account} />)}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="investments" className="border-none">
                        <AccordionTrigger className="bg-gradient-to-r from-red-950/40 to-red-900/40 backdrop-blur-xl p-4 rounded-xl hover:no-underline hover:bg-red-900/60 text-white font-semibold">Investments</AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-2">
                             {investments.map(account => <AccountCard key={account.id} account={account} />)}
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="loans" className="border-none">
                        <AccordionTrigger className="bg-gradient-to-r from-red-950/40 to-red-900/40 backdrop-blur-xl p-4 rounded-xl hover:no-underline hover:bg-red-900/60 text-white font-semibold">Online Loans</AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-2">
                             {loans.map(account => <AccountCard key={account.id} account={account} />)}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
