'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Plus, ChevronRight, Banknote, MessageSquare, Cable, Phone, Droplets, Lightbulb, Shield, Car, CreditCard } from 'lucide-react';
import Link from 'next/link';

import NoiseOverlay from '@/components/noise-overlay';
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
import { accounts, beneficiaries, type Beneficiary } from '@/lib/data';
import { cn } from '@/lib/utils';

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

const billers = [
  { name: 'PLN', subtext: 'Token & Tagihan', icon: Lightbulb },
  { name: 'Pulsa & Data', subtext: 'Telkomsel, XL, etc.', icon: Phone },
  { name: 'Air PDAM', subtext: 'Tagihan Air', icon: Droplets },
  { name: 'Internet & TV', subtext: 'IndiHome, First Media', icon: Cable },
  { name: 'BPJS', subtext: 'Kesehatan', icon: Shield },
  { name: 'E-Samsat', subtext: 'Pajak Kendaraan', icon: Car },
  { name: 'Kartu Kredit', subtext: 'Tagihan Kartu', icon: CreditCard },
];


export default function TransferPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedRecipient, setSelectedRecipient] = useState<Beneficiary | null>(null);
  
  const userAccounts = accounts.filter(acc => acc.type === 'bank' || acc.type === 'e-wallet');

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
      description: `You have successfully transferred ${formatCurrency(numericAmount)} to ${selectedRecipient?.name}. Total debited: ${formatCurrency(totalDebit)}`,
    });
    // Reset state after successful transfer
    setSelectedRecipient(null);
    form.reset();
    router.push('/dashboard');
  }

  const handleSelectRecipient = (recipient: Beneficiary) => {
    setSelectedRecipient(recipient);
    form.reset(); // Reset form when changing recipient
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
          Pay & Transfer
        </h1>
        <p className="text-muted-foreground">Your central hub for all payments.</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white font-serif">Transfer To</h2>
            <Link href="/transfer/add-recipient" className="text-sm font-semibold text-accent hover:text-accent/90 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add New
            </Link>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {beneficiaries.map((beneficiary) => (
             <button key={beneficiary.id} onClick={() => handleSelectRecipient(beneficiary)} className={cn(
               "w-full text-left bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between hover:from-red-800/60 hover:to-red-700/60 transition-all duration-300 border border-red-600/20 shadow-2xl group relative overflow-hidden",
               selectedRecipient?.id === beneficiary.id && "ring-2 ring-primary border-primary"
             )}>
                <NoiseOverlay opacity={0.03} />
                <div className="flex items-center gap-3">
                    {getBankLogo(beneficiary.bankName)}
                    <div>
                        <p className="font-bold text-lg text-white">{beneficiary.name}</p>
                        <p className="text-red-300 text-sm">{beneficiary.bankName} &bull; {beneficiary.accountNumber}</p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
            </button>
          ))}
        </div>
      </div>
      
      {selectedRecipient && (
         <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-8 rounded-2xl border border-red-600/20 shadow-2xl relative overflow-hidden animate-fade-in-up">
            <NoiseOverlay opacity={0.03} />
            <h3 className="text-xl font-bold text-white font-serif mb-6 text-center">Transfer to <span className="text-accent">{selectedRecipient.name}</span></h3>
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
      )}


      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white font-serif">Pay Bills</h2>
        <div className="grid grid-cols-1 gap-4">
          {billers.map((biller) => (
            <button key={biller.name} className="w-full text-left bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center gap-5 hover:from-red-800/60 hover:to-red-700/60 transition-all duration-300 border border-red-600/20 shadow-2xl group relative overflow-hidden">
              <NoiseOverlay opacity={0.03} />
              <div className="bg-gradient-to-br from-red-500 to-red-700 p-3 rounded-xl shadow-lg">
                  <biller.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg text-white">{biller.name}</p>
                <p className="text-red-300 text-sm">{biller.subtext}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
