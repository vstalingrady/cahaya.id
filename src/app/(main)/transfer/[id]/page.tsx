
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Banknote, MessageSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { getBeneficiaries, getDashboardData } from '@/lib/actions';
import { type Account, type Beneficiary } from '@/lib/data';

const formSchema = z.object({
  fromAccountId: z.string().min(1, { message: 'Please select an account to transfer from.' }),
  amount: z.coerce.number().min(10000, { message: 'Minimum transfer amount is IDR 10,000.' }),
  notes: z.string().optional(),
});

const BI_FAST_FEE = 2500;
const BANK_API_FEE = 1000;
const CAHAYA_FEE = 500;
const TOTAL_FEE = BI_FAST_FEE + BANK_API_FEE + CAHAYA_FEE;

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

export default function InitiateTransferPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const recipientId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [recipient, setRecipient] = useState<Beneficiary | null>(null);
  const [userAccounts, setUserAccounts] = useState<Account[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [beneficiaries, { accounts }] = await Promise.all([
                getBeneficiaries(user.uid),
                getDashboardData(user.uid)
            ]);
            const foundRecipient = beneficiaries.find(b => b.id === recipientId) || null;
            setRecipient(foundRecipient);
            setUserAccounts(accounts.filter(acc => acc.type === 'bank' || acc.type === 'e-wallet'));
        } catch (error) {
            console.error("Failed to fetch transfer page data:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not load page data.' });
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, [user, recipientId, toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromAccountId: '',
      amount: 0,
      notes: '',
    },
  });
  
  const amount = form.watch('amount');

  function onSubmit(values: z.infer<typeof formSchema>) {
    const selectedAccount = userAccounts.find(acc => acc.id === values.fromAccountId);
    const numericAmount = Number(values.amount);
    const totalDebit = numericAmount + TOTAL_FEE;

    if (!selectedAccount || selectedAccount.balance < totalDebit) {
        toast({
          variant: "destructive",
          title: "Insufficient Balance",
          description: `Your balance is not enough to cover the transfer and fees.`,
        });
        return;
    }
    
    // In a real app, this would be an async server action to perform the transfer.
    console.log(values);
    toast({
      title: "Transfer Successful!",
      description: `You have successfully transferred ${formatCurrency(numericAmount)} to ${recipient?.name}. Total debited: ${formatCurrency(totalDebit)}`,
    });
    router.push('/dashboard');
  }

  if (isLoading) {
      return <div className="flex items-center justify-center pt-24"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>;
  }

  if (!recipient) {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <header className="flex items-center relative">
                <Link href="/transfer" className="absolute left-0">
                    <ArrowLeft className="w-6 h-6 text-foreground" />
                </Link>
                <h1 className="text-2xl font-bold mx-auto font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Error
                </h1>
            </header>
            <Alert variant="destructive">
                <AlertDescription>Recipient not found. Please go back and select a valid recipient.</AlertDescription>
            </Alert>
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
        <header className="flex items-center relative">
            <Link href="/transfer/recipients" className="absolute left-0">
                <ArrowLeft className="w-6 h-6 text-foreground" />
            </Link>
            <div className="text-center mx-auto">
                <h1 className="text-2xl font-bold font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Transfer to {recipient.name}
                </h1>
                <p className="text-sm text-muted-foreground">{recipient.bankName} &bull; {recipient.accountNumber}</p>
            </div>
        </header>
        
         <div className="bg-card backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fromAccountId"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-muted-foreground">From Account</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="bg-input border-border h-14 text-base placeholder:text-muted-foreground">
                                <SelectValue placeholder="Select an account" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {userAccounts.map(account => (
                                <SelectItem key={account.id} value={account.id}>
                                    <div className="flex justify-between w-full">
                                        <span>{account.name}</span>
                                        <span className="text-muted-foreground">{formatCurrency(account.balance)}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-muted-foreground">Amount</FormLabel>
                        <FormControl>
                        <div className="relative">
                            <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input type="number" className="bg-input border-border h-14 pl-12 text-base placeholder:text-muted-foreground" placeholder="IDR 0" {...field} />
                        </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-muted-foreground">Notes (Optional)</FormLabel>
                        <FormControl>
                        <div className="relative">
                            <MessageSquare className="absolute left-4 top-5 w-5 h-5 text-muted-foreground" />
                            <Textarea className="bg-input border-border pl-12 text-base placeholder:text-muted-foreground" placeholder="For lunch yesterday" {...field} />
                        </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {Number(amount) >= 10000 && (
                <div className="space-y-3 bg-secondary p-5 rounded-2xl border border-border">
                    <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Transfer Amount</span>
                    <span className="font-mono text-card-foreground">{formatCurrency(Number(amount))}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">BI-FAST Fee</span>
                    <span className="font-mono text-card-foreground">{formatCurrency(BI_FAST_FEE)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Bank API Fee</span>
                    <span className="font-mono text-card-foreground">{formatCurrency(BANK_API_FEE)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Cahaya Service Fee</span>
                    <span className="font-mono text-card-foreground">{formatCurrency(CAHAYA_FEE)}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-base pt-3 mt-2 border-t border-border/50">
                    <span className="text-card-foreground">Total Debited</span>
                    <span className="font-mono text-primary">{formatCurrency(Number(amount) + TOTAL_FEE)}</span>
                    </div>
                </div>
                )}


                <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-semibold text-xl shadow-lg border-border hover:shadow-primary/10 transition-all duration-300 transform hover:scale-105 h-auto"
                >
                    Confirm & Transfer
                </Button>
              </form>
            </Form>
         </div>
    </div>
  );
}
