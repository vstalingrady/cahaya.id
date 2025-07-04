'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { accounts as initialAccounts, transactions, Account } from '@/lib/data';
import TotalBalance from '@/components/dashboard/total-balance';
import AccountCard from '@/components/dashboard/account-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EwalletIcon from '@/components/icons/ewallet-icon';
import { Briefcase, Landmark, Coins, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
    const [accountList, setAccountList] = useState<Account[]>(initialAccounts);
    
    // Note: accountList state is not updated on unlink for this prototype.
    // In a real app, this would be handled by a global state manager (e.g., Redux, Zustand)
    // that would be updated after the unlink action and reflected here.
    const [isPrivate, setIsPrivate] = useState(true);
    const [showPinDialog, setShowPinDialog] = useState(false);
    const [pin, setPin] = useState('');
    const [pinError, setPinError] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!isPrivate) {
            timer = setTimeout(() => {
                setIsPrivate(true);
                toast({ title: "Privacy Mode On", description: "Balances are hidden again for your security." });
            }, 30000); // 30 seconds
        }
        return () => clearTimeout(timer);
    }, [isPrivate, toast]);

    const handleConfirmPin = () => {
        if (pin === '000000') {
            setIsPrivate(false);
            setShowPinDialog(false);
            setPin('');
            setPinError('');
            toast({ title: "Privacy Mode Off", description: "Balances will be visible for 30 seconds." });
        } else {
            setPinError('Incorrect PIN. Please try again.');
            setPin('');
        }
    };

    const { totalAssets, totalLiabilities, netWorth, accountGroups } = useMemo(() => {
        const totalAssets = accountList
            .filter(acc => acc.type !== 'loan')
            .reduce((sum, acc) => sum + acc.balance, 0);
        
        const totalLiabilities = accountList
            .filter(acc => acc.type === 'loan')
            .reduce((sum, acc) => sum + acc.balance, 0);
            
        const netWorth = totalAssets - totalLiabilities;

        const accountGroups = {
            bank: accountList.filter(a => a.type === 'bank'),
            'e-wallet': accountList.filter(a => a.type === 'e-wallet'),
            investment: accountList.filter(a => a.type === 'investment'),
            loan: accountList.filter(a => a.type === 'loan'),
        };

        return { totalAssets, totalLiabilities, netWorth, accountGroups };
    }, [accountList]);


    return (
        <>
        <AlertDialog open={showPinDialog} onOpenChange={(isOpen) => { setShowPinDialog(isOpen); if(!isOpen) { setPin(''); setPinError(''); }}}>
            <AlertDialogContent className="bg-popover text-popover-foreground border-border">
                <AlertDialogHeader>
                    <AlertDialogTitle>Enter PIN to Show Balances</AlertDialogTitle>
                    <AlertDialogDescription>
                        For your security, please enter your 6-digit PIN to view sensitive information for 30 seconds.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4 space-y-2">
                    <Input
                        type="password"
                        placeholder="••••••"
                        maxLength={6}
                        value={pin}
                        onChange={(e) => {
                            setPin(e.target.value.replace(/\D/g, ''));
                            if (pinError) setPinError('');
                        }}
                        className="bg-input border-border h-14 text-center text-xl tracking-[0.5em] placeholder:text-muted-foreground"
                    />
                    {pinError && <p className="text-sm text-destructive text-center">{pinError}</p>}
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirmPin}
                        disabled={pin.length < 6}
                    >
                        Reveal Balances
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <div className="space-y-8 animate-fade-in-up">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Good morning, Vstalin
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => isPrivate ? setShowPinDialog(true) : setIsPrivate(true)} className="w-12 h-12 bg-card rounded-2xl shadow-lg border-2 border-border/50 flex items-center justify-center cursor-pointer transition-colors hover:border-primary/50">
                    {isPrivate ? <Eye className="w-6 h-6 text-muted-foreground" /> : <EyeOff className="w-6 h-6 text-primary" />}
                  </button>
                  <Link href="/profile">
                    <Image src="https://placehold.co/128x128.png" width={48} height={48} alt="User Avatar" className="w-12 h-12 bg-primary rounded-2xl shadow-lg border-2 border-border/50 cursor-pointer" data-ai-hint="person avatar" />
                  </Link>
                </div>
            </header>

            <TotalBalance title="Total Net Worth" amount={netWorth} transactions={transactions} showHistoryLink={true} isPrivate={isPrivate} />

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white font-serif">Your Accounts</h2>
                    <Link href="/link-account" className="text-sm font-semibold text-primary hover:text-primary/90">
                        Link New
                    </Link>
                </div>
                <Accordion type="multiple" defaultValue={['bank', 'e-wallet', 'investment', 'loan']} className="w-full space-y-2">
                    {accountGroups.bank.length > 0 && (
                        <AccordionItem value="bank" className="bg-card backdrop-blur-xl rounded-2xl border-none shadow-lg shadow-primary/10 px-5">
                            <AccordionTrigger className="hover:no-underline text-white">
                                <div className='flex items-center gap-3'>
                                    <Landmark className='w-5 h-5' />
                                    <span className='font-semibold'>Banks</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 space-y-2">
                                {accountGroups.bank.map(account => (
                                    <AccountCard key={account.id} account={account} isPrivate={isPrivate} />
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {accountGroups['e-wallet'].length > 0 && (
                        <AccordionItem value="e-wallet" className="bg-card backdrop-blur-xl rounded-2xl border-none shadow-lg shadow-primary/10 px-5">
                            <AccordionTrigger className="hover:no-underline text-white">
                                <div className='flex items-center gap-3'>
                                    <EwalletIcon className='w-5 h-5' />
                                    <span className='font-semibold'>E-Wallets</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 space-y-2">
                                {accountGroups['e-wallet'].map(account => (
                                    <AccountCard key={account.id} account={account} isPrivate={isPrivate} />
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    )}
                    
                    {accountGroups.investment.length > 0 && (
                        <AccordionItem value="investment" className="bg-card backdrop-blur-xl rounded-2xl border-none shadow-lg shadow-primary/10 px-5">
                            <AccordionTrigger className="hover:no-underline text-white">
                                <div className='flex items-center gap-3'>
                                    <Briefcase className='w-5 h-5' />
                                    <span className='font-semibold'>Investments</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 space-y-2">
                                {accountGroups.investment.map(account => (
                                    <AccountCard key={account.id} account={account} isPrivate={isPrivate} />
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {accountGroups.loan.length > 0 && (
                        <AccordionItem value="loan" className="bg-card backdrop-blur-xl rounded-2xl border-none shadow-lg shadow-primary/10 px-5">
                            <AccordionTrigger className="hover:no-underline text-white">
                                <div className='flex items-center gap-3'>
                                    <Coins className='w-5 h-5' />
                                    <span className='font-semibold'>Loans</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 space-y-2">
                                {accountGroups.loan.map(account => (
                                    <AccountCard key={account.id} account={account} isPrivate={isPrivate} />
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    )}
                </Accordion>
            </div>
        </div>
        </>
    );
}
