'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Banknote, Landmark, MessageSquare } from 'lucide-react';

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
import { accounts } from '@/lib/data';
import NoiseOverlay from '@/components/noise-overlay';
import Link from 'next/link';

const formSchema = z.object({
  fromAccountId: z.string().min(1, { message: 'Please select an account to transfer from.' }),
  recipientBank: z.string().min(1, { message: 'Please select a recipient bank.' }),
  recipientAccount: z.string().min(10, { message: 'Please enter a valid account number.' }),
  amount: z.coerce.number().min(10000, { message: 'Minimum transfer amount is IDR 10,000.' }),
  notes: z.string().optional(),
});

const banks = [
  { value: 'bca', label: 'BCA (Bank Central Asia)' },
  { value: 'bni', label: 'BNI (Bank Negara Indonesia)' },
  { value: 'mandiri', label: 'Mandiri' },
  { value: 'bri', label: 'BRI (Bank Rakyat Indonesia)' },
  { value: 'cimb', label: 'CIMB Niaga' },
  { value: 'permata', label: 'Permata Bank' },
  { value: 'danamon', label: 'Danamon' },
];

const BI_FAST_FEE = 2500;
const BANK_API_FEE = 1000;
const CUAN_FEE = 500;
const TOTAL_FEE = BI_FAST_FEE + BANK_API_FEE + CUAN_FEE;

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

export default function InitiateTransferPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromAccountId: '',
      recipientBank: '',
      recipientAccount: '',
      amount: 0,
      notes: '',
    },
  });

  const amount = form.watch('amount');
  const fromAccountId = form.watch('fromAccountId');
  const selectedAccount = accounts.find(acc => acc.id === fromAccountId);
  const isSufficientBalance = selectedAccount ? selectedAccount.balance >= (amount + TOTAL_FEE) : false;

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isSufficientBalance) {
        toast({
          variant: "destructive",
          title: "Insufficient Balance",
          description: `Your balance is not enough to cover the transfer and fees.`,
        });
        return;
    }
    console.log(values);
    toast({
      title: "Transfer Successful!",
      description: `You have successfully transferred ${formatCurrency(values.amount)} to account ${values.recipientAccount}. Total debited: ${formatCurrency(values.amount + TOTAL_FEE)}`,
    });
    router.push('/dashboard');
  }
  
  const userAccounts = accounts.filter(acc => acc.type === 'bank' || acc.type === 'e-wallet');

  return (
    <div className="space-y-8 animate-fade-in-up">
       <header className="flex items-center relative">
        <Link href="/transfer" className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-black mx-auto bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
          Transfer Money
        </h1>
      </header>

      <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-8 rounded-2xl border border-red-600/20 shadow-2xl relative overflow-hidden">
        <NoiseOverlay opacity={0.03} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fromAccountId"
              render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-red-200">From Account</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger className="bg-red-950/50 border-red-800/50 h-14 text-base placeholder:text-red-300/70">
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
              name="recipientBank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-200">Recipient Bank</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger className="bg-red-950/50 border-red-800/50 h-14 text-base placeholder:text-red-300/70">
                            <SelectValue placeholder="Select a bank" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {banks.map(bank => (
                            <SelectItem key={bank.value} value={bank.value}>
                                {bank.label}
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
                name="recipientAccount"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-red-200">Recipient Account Number</FormLabel>
                    <FormControl>
                    <div className="relative">
                        <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-300" />
                        <Input className="bg-red-950/50 border-red-800/50 h-14 pl-12 text-base placeholder:text-red-300/70" placeholder="e.g. 1234567890" {...field} />
                    </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-red-200">Amount</FormLabel>
                    <FormControl>
                    <div className="relative">
                        <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-300" />
                        <Input type="number" className="bg-red-950/50 border-red-800/50 h-14 pl-12 text-base placeholder:text-red-300/70" placeholder="IDR 0" {...field} />
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
                    <FormLabel className="text-red-200">Notes (Optional)</FormLabel>
                    <FormControl>
                    <div className="relative">
                        <MessageSquare className="absolute left-4 top-5 w-5 h-5 text-red-300" />
                        <Textarea className="bg-red-950/50 border-red-800/50 pl-12 text-base placeholder:text-red-300/70" placeholder="For lunch yesterday" {...field} />
                    </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            {amount >= 10000 && (
            <div className="space-y-3 bg-red-950/60 p-5 rounded-2xl border border-red-800/50">
                <div className="flex justify-between items-center text-sm">
                <span className="text-red-300">Transfer Amount</span>
                <span className="font-mono text-white">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                <span className="text-red-300">BI-FAST Fee</span>
                <span className="font-mono text-white">{formatCurrency(BI_FAST_FEE)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                <span className="text-red-300">Bank API Fee</span>
                <span className="font-mono text-white">{formatCurrency(BANK_API_FEE)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                <span className="text-red-300">Cuan Service Fee</span>
                <span className="font-mono text-white">{formatCurrency(CUAN_FEE)}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-base pt-3 mt-2 border-t border-red-800/50">
                <span className="text-white">Total Debited</span>
                <span className="font-mono text-accent">{formatCurrency(amount + TOTAL_FEE)}</span>
                </div>
            </div>
            )}


            <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-accent text-white py-5 rounded-2xl font-black text-xl shadow-2xl border border-red-400/30 hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group h-auto"
            >
                <NoiseOverlay opacity={0.05} />
                <span className="relative z-10">Confirm & Transfer</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
