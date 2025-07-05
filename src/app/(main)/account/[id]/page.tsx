
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { type Account, type Transaction } from '@/lib/data';
import { getAccountDetails } from '@/lib/actions';
import { useAuth } from '@/components/auth/auth-provider';
import TransactionCalendar from '@/components/profile/transaction-calendar';
import TotalBalance from '@/components/dashboard/total-balance';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
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

// This currency formatter can be moved to a utils file if used in more places
const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

export default function AccountDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const accountId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [isUnlinkConfirmOpen, setIsUnlinkConfirmOpen] = useState(false);
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (!user || !accountId) return;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { account: fetchedAccount, transactions: fetchedTransactions } = await getAccountDetails(user.uid, accountId);
            setAccount(fetchedAccount);
            setTransactions(fetchedTransactions);
        } catch (error) {
            console.error("Failed to fetch account details:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not load account details.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
  }, [user, accountId, toast]);
  
  const handleConfirmUnlink = () => {
    if (pin.length < 6) return;

    // In a real app, this would be an async server action to delete the account link.
    // For this prototype, we'll just simulate it.
    toast({
        title: "Account Unlinked",
        description: `The "${account?.name}" account has been unlinked.`,
    });

    setIsUnlinkConfirmOpen(false);
    setPin('');
    
    router.push('/dashboard');
  };
  
  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-full pt-24">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
    );
  }

  if (!account) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <header className="flex items-center relative">
            <Link href="/dashboard" className="absolute left-0">
                <ArrowLeft className="w-6 h-6 text-foreground" />
            </Link>
            <h1 className="text-2xl font-bold mx-auto font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Error
            </h1>
        </header>
        <Alert variant="destructive">
            <AlertDescription>Account not found. Please go back to the dashboard.</AlertDescription>
        </Alert>
    </div>
    );
  }

  return (
    <>
    <AlertDialog open={isUnlinkConfirmOpen} onOpenChange={setIsUnlinkConfirmOpen}>
        <AlertDialogContent className="bg-popover text-popover-foreground border-border">
            <AlertDialogHeader>
            <AlertDialogTitle>Unlink "{account.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. To continue, please enter your 6-character Clarity PIN.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
            <Input
                type="password"
                placeholder="••••••"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="bg-input border-border h-14 text-center text-xl tracking-[0.5em] placeholder:text-muted-foreground"
            />
            </div>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPin('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction
                onClick={handleConfirmUnlink}
                disabled={pin.length < 6}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
                Unlink Account
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-center relative">
        <Link href="/dashboard" className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <h1 className="text-2xl font-bold mx-auto font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {account.name}
        </h1>
      </header>
      
      {/* Reusable balance chart component */}
      <TotalBalance
        title="Current Balance"
        amount={account.balance}
        transactions={transactions}
        showHistoryLink={false}
      />

      {account.type === 'investment' && account.holdings && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground font-serif">Portfolio Holdings</h2>
          <div className="grid grid-cols-1 gap-4">
            {account.holdings.map(holding => (
              <div key={holding.id} className="bg-card p-5 rounded-2xl flex items-center justify-between border border-border shadow-lg shadow-primary/10">
                <div className="flex items-center gap-4">
                   <Image src={holding.logoUrl} alt={holding.name} width={48} height={48} className="rounded-full" data-ai-hint={`${holding.name} coin`} />
                  <div>
                    <p className="font-semibold text-lg text-card-foreground">{holding.name}</p>
                    <p className="text-muted-foreground text-sm font-mono">{holding.amount} {holding.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-lg text-card-foreground">{formatCurrency(holding.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(account.type === 'bank' || account.type === 'e-wallet') && (
         <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground font-serif">Transaction History</h2>
          {transactions.length > 0 ? (
            <TransactionCalendar transactions={transactions} currentBalance={account.balance} />
          ) : (
            <div className="bg-card p-6 rounded-xl text-center text-muted-foreground border border-border">
                No transactions for this account yet.
            </div>
          )}
        </div>
      )}

      {account.type !== 'loan' && (
        <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <Button
                variant="link"
                className="text-destructive hover:text-destructive/80 font-semibold"
                onClick={() => setIsUnlinkConfirmOpen(true)}
            >
                Unlink this Account
            </Button>
        </div>
      )}
    </div>
    </>
  );
}
