
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { getDashboardData, verifySecurityPin } from '@/lib/actions';
import { type Account, type Transaction } from '@/lib/data';
import TotalBalance from '@/components/dashboard/total-balance';
import AccountCard from '@/components/dashboard/account-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Landmark, Coins, Eye, EyeOff, Loader2, Wallet, Briefcase } from 'lucide-react';
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
import { useAuth } from '@/components/auth/auth-provider';

export default function DashboardPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [accountList, setAccountList] = useState<Account[]>([]);
    const [transactionList, setTransactionList] = useState<Transaction[]>([]);
    
    const [isPrivate, setIsPrivate] = useState(true);
    const [showPinDialog, setShowPinDialog] = useState(false);
    const [pin, setPin] = useState('');
    const [pinError, setPinError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const { accounts, transactions } = await getDashboardData(user.uid);
                setAccountList(accounts);
                setTransactionList(transactions);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Could not load your account data.'
                });
            } finally {
              setIsLoading(false);
            }
        };

        fetchData();
    }, [user, toast]);

    const handleConfirmPin = async () => {
        if (pin.length < 6 || !user) return;
        setPinError(null);

        try {
            const { success } = await verifySecurityPin(user.uid, pin);
            if (success) {
                setIsPrivate(false);
                setShowPinDialog(false);
                setPin('');
                toast({ title: "Privacy Mode Off", description: "Balances are now visible." });
            } else {
                setPinError("Invalid PIN. Please try again.");
                setPin(''); // Clear the pin input for another attempt
            }
        } catch (error) {
            console.error("Error verifying PIN:", error);
            setPinError("An error occurred. Please try again later.");
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
            ewallet: accountList.filter(a => a.type === 'e-wallet'),
            investment: accountList.filter(a => a.type === 'investment'),
            loan: accountList.filter(a => a.type === 'loan'),
        };

        return { totalAssets, totalLiabilities, netWorth, accountGroups };
    }, [accountList]);


    return (
        <>
        <AlertDialog open={showPinDialog} onOpenChange={(isOpen) => { setShowPinDialog(isOpen); if(!isOpen) { setPin(''); setPinError(null); }}}>
            <AlertDialogContent className="bg-popover text-popover-foreground border-border">
                <AlertDialogHeader>
                    <AlertDialogTitle>Enter PIN to Show Balances</AlertDialogTitle>
                    <AlertDialogDescription>
                        For your security, please enter your 6-character PIN to view sensitive information.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4 space-y-2">
                    <Input
                        type="password"
                        placeholder="••••••"
                        maxLength={6}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="bg-input border-border h-14 text-center text-xl tracking-[0.5em] placeholder:text-muted-foreground"
                    />
                    {pinError && <p className="text-sm text-destructive text-center">{pinError}</p>}
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setPin('')}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirmPin}
                        disabled={pin.length < 6}
                    >
                        Reveal Balances
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        <div className="animate-fade-in-up">
            <header className="sticky top-0 -mt-6 pt-6 pb-4 -mx-6 px-6 bg-background/80 backdrop-blur-md z-20 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Good morning, {user?.displayName?.split(' ')[0] || 'User'}
                    </h1>
                    <p className="text-sm text-muted-foreground">Welcome back to your dashboard.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11">
                     <button onClick={() => isPrivate ? setShowPinDialog(true) : setIsPrivate(true)} className="w-full h-full bg-card rounded-full shadow-lg border-2 border-border/50 flex items-center justify-center cursor-pointer transition-colors hover:border-primary/50 relative z-10">
                        {isPrivate ? <Eye className="w-5 h-5 text-muted-foreground" /> : <EyeOff className="w-5 h-5 text-primary" />}
                     </button>
                  </div>
                  <Link href="/profile">
                    <Image src={user.photoURL || "https://placehold.co/128x128.png"} width={44} height={44} alt="User Avatar" className="w-11 h-11 bg-primary rounded-full shadow-lg border-2 border-border/50 cursor-pointer" data-ai-hint="person avatar" />
                  </Link>
                </div>
            </header>

            {isLoading ? (
                <div className="flex items-center justify-center pt-24">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            ) : (
            <div className="space-y-8 pt-4">
                <TotalBalance title="Total Net Worth" amount={netWorth} transactions={transactionList} showHistoryLink={true} isPrivate={isPrivate} />

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-foreground font-serif">Your Accounts</h2>
                        <Link href="/link-account" className="text-sm font-semibold text-primary hover:text-primary/90">
                            Link New
                        </Link>
                    </div>
                    <Accordion type="multiple" defaultValue={['bank', 'ewallet', 'investment', 'loan']} className="w-full space-y-2">
                        {accountGroups.bank.length > 0 && (
                            <AccordionItem value="bank" className="bg-card backdrop-blur-xl rounded-2xl border-none shadow-lg shadow-primary/10 px-5">
                                <AccordionTrigger className="hover:no-underline text-card-foreground">
                                    <div className='flex items-center gap-3'>
                                        <div className="w-6 flex justify-center">
                                            <Landmark className='w-5 h-5' />
                                        </div>
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
                        
                        {accountGroups.ewallet.length > 0 && (
                            <AccordionItem value="ewallet" className="bg-card backdrop-blur-xl rounded-2xl border-none shadow-lg shadow-primary/10 px-5">
                                <AccordionTrigger className="hover:no-underline text-card-foreground">
                                    <div className='flex items-center gap-3'>
                                        <div className="w-6 flex justify-center">
                                            <Wallet className='w-5 h-5' />
                                        </div>
                                        <span className='font-semibold'>E-Money</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 space-y-2">
                                    {accountGroups.ewallet.map(account => (
                                        <AccountCard key={account.id} account={account} isPrivate={isPrivate} />
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        )}

                        {accountGroups.investment.length > 0 && (
                            <AccordionItem value="investment" className="bg-card backdrop-blur-xl rounded-2xl border-none shadow-lg shadow-primary/10 px-5">
                                <AccordionTrigger className="hover:no-underline text-card-foreground">
                                    <div className='flex items-center gap-3'>
                                        <div className="w-6 flex justify-center">
                                            <Briefcase className='w-5 h-5' />
                                        </div>
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
                                <AccordionTrigger className="hover:no-underline text-card-foreground">
                                    <div className='flex items-center gap-3'>
                                        <div className="w-6 flex justify-center">
                                            <Coins className='w-5 h-5' />
                                        </div>
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
            )}
        </div>
        </>
    );
}
