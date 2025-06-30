'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { accounts, beneficiaries } from '@/lib/data';
import NoiseOverlay from '@/components/noise-overlay';
import Link from 'next/link';

const formSchema = z.object({
  fromAccountId: z.string().min(1, { message: 'Please select an account to transfer from.' }),
  amount: z.coerce.number().min(10000, { message: 'Minimum transfer amount is IDR 10,000.' }),
  notes: z.string().optional(),
});


const BI_FAST_FEE = 2500;
const BANK_API_FEE = 1000;
const CUAN_FEE = 500;
const TOTAL_FEE = BI_FAST_FEE + BANK_API_FEE + CUAN_FEE;

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const getBankLogo = (bankName: string) => {
    const lowerName = bankName.toLowerCase();
    const initials = bankName.split(' ').map(n => n[0]).join('');

    if (lowerName.includes('bca')) return <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">BCA</div>;
    if (lowerName.includes('mandiri')) return <div className="w-12 h-12 bg-gradient-to-br from-sky-600 to-sky-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">MDR</div>;
    if (lowerName.includes('bni')) return <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">BNI</div>;
    return <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">{initials.substring(0, 3)}</div>;
}

export default function InitiateTransferPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const recipientId = searchParams.get('recipientId');
  const recipient = beneficiaries.find(b => b.id === recipientId);

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
    const selectedAccount = accounts.find(acc => acc.id === values.fromAccountId);
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
    
    console.log(values);
    toast({
      title: "Transfer Successful!",
      description: `You have successfully transferred ${formatCurrency(numericAmount)} to ${recipient?.name}. Total debited: ${formatCurrency(totalDebit)}`,
    });
    router.push('/dashboard');
  }
  
  const userAccounts = accounts.filter(acc => acc.type === 'bank' || acc.type === 'e-wallet');
  
  if (!recipient) {
      return (
          <div className="text-center space-y-4">
              <p className="text-destructive font-bold">Recipient not found.</p>
              <Button onClick={() => router.push('/transfer')}>Go Back</Button>
          </div>
      )
  }


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
      
       <div className="bg-gradient-to-r from-red-950/40 to-red-900/40 backdrop-blur-xl p-5 rounded-2xl border border-red-600/20 shadow-2xl relative overflow-hidden flex items-center gap-3">
          <NoiseOverlay opacity={0.03} />
          {getBankLogo(recipient.bankName)}
          <div>
            <p className="text-red-300 text-sm">Transferring to</p>
            <p className="font-bold text-lg text-white">{recipient.name}</p>
            <p className="text-red-300 text-sm font-semibold">{recipient.bankName} &bull; {recipient.accountNumber}</p>
          </div>
       </div>


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

            {Number(amount) >= 10000 && (
            <div className="space-y-3 bg-red-950/60 p-5 rounded-2xl border border-red-800/50">
                <div className="flex justify-between items-center text-sm">
                <span className="text-red-300">Transfer Amount</span>
                <span className="font-mono text-white">{formatCurrency(Number(amount))}</span>
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
                <span className="font-mono text-accent">{formatCurrency(Number(amount) + TOTAL_FEE)}</span>
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
