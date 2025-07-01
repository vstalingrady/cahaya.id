
import Link from 'next/link';
import { accounts, transactions } from '@/lib/data';
import TotalBalance from '@/components/dashboard/total-balance';
import AccountCard from '@/components/dashboard/account-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EwalletIcon from '@/components/icons/ewallet-icon';
import { Briefcase, Landmark, Coins } from 'lucide-react';

export default function DashboardPage() {
    const totalAssets = accounts
        .filter(acc => acc.type !== 'loan')
        .reduce((sum, acc) => sum + acc.balance, 0);
    
    const totalLiabilities = accounts
        .filter(acc => acc.type === 'loan')
        .reduce((sum, acc) => sum + acc.balance, 0);
        
    const netWorth = totalAssets - totalLiabilities;

    const accountGroups = {
        bank: accounts.filter(a => a.type === 'bank'),
        'e-wallet': accounts.filter(a => a.type === 'e-wallet'),
        investment: accounts.filter(a => a.type === 'investment'),
        loan: accounts.filter(a => a.type === 'loan'),
    }

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
                <Accordion type="multiple" defaultValue={['bank', 'e-wallet', 'investment', 'loan']} className="w-full space-y-2">
                    {accountGroups.bank.length > 0 && (
                        <AccordionItem value="bank" className="bg-gradient-to-r from-red-950/50 to-red-900/50 backdrop-blur-xl rounded-2xl border border-red-600/20 shadow-2xl px-5">
                            <AccordionTrigger>
                                <div className='flex items-center gap-3'>
                                    <Landmark className='w-5 h-5 text-red-300' />
                                    <span className='font-semibold text-white'>Banks</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 space-y-2">
                                {accountGroups.bank.map(account => (
                                    <AccountCard key={account.id} account={account} />
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {accountGroups['e-wallet'].length > 0 && (
                         <AccordionItem value="e-wallet" className="bg-gradient-to-r from-red-950/50 to-red-900/50 backdrop-blur-xl rounded-2xl border border-red-600/20 shadow-2xl px-5">
                            <AccordionTrigger>
                                <div className='flex items-center gap-3'>
                                    <EwalletIcon className='w-5 h-5 text-red-300' />
                                    <span className='font-semibold text-white'>E-Wallets</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 space-y-2">
                                {accountGroups['e-wallet'].map(account => (
                                    <AccountCard key={account.id} account={account} />
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    )}
                    
                    {accountGroups.investment.length > 0 && (
                        <AccordionItem value="investment" className="bg-gradient-to-r from-red-950/50 to-red-900/50 backdrop-blur-xl rounded-2xl border border-red-600/20 shadow-2xl px-5">
                            <AccordionTrigger>
                                <div className='flex items-center gap-3'>
                                    <Briefcase className='w-5 h-5 text-red-300' />
                                    <span className='font-semibold text-white'>Investments</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 space-y-2">
                                {accountGroups.investment.map(account => (
                                    <AccountCard key={account.id} account={account} />
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {accountGroups.loan.length > 0 && (
                         <AccordionItem value="loan" className="bg-gradient-to-r from-red-950/50 to-red-900/50 backdrop-blur-xl rounded-2xl border border-red-600/20 shadow-2xl px-5">
                            <AccordionTrigger>
                                <div className='flex items-center gap-3'>
                                    <Coins className='w-5 h-5 text-red-300' />
                                    <span className='font-semibold text-white'>Loans</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 space-y-2">
                                {accountGroups.loan.map(account => (
                                    <AccountCard key={account.id} account={account} />
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    )}
                </Accordion>
            </div>
        </div>
    );
}
