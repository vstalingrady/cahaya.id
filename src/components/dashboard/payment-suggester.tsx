'use client';
import { useState } from 'react';
import { accounts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, WalletCards } from 'lucide-react';
import BankIcon from '../icons/bank-icon';
import EwalletIcon from '../icons/ewallet-icon';

interface SplitSuggestion {
  accountId: string;
  name: string;
  type: 'bank' | 'e-wallet';
  amount: number;
  percentage: number;
}

export default function PaymentSuggester() {
  const [amount, setAmount] = useState<number | string>('');
  const [suggestions, setSuggestions] = useState<SplitSuggestion[]>([]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);

    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue > 0) {
      generateSuggestions(numericValue);
    } else {
      setSuggestions([]);
    }
  };
  
  const generateSuggestions = (paymentAmount: number) => {
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    const newSuggestions = accounts.map(account => {
      const percentage = (account.balance / totalBalance);
      const suggestedAmount = Math.min(paymentAmount * percentage, account.balance);
      return {
        accountId: account.id,
        name: account.name,
        type: account.type,
        amount: suggestedAmount,
        percentage: percentage * 100,
      };
    });

    // Adjust for rounding errors and ensure total matches payment amount
    const suggestedTotal = newSuggestions.reduce((sum, s) => sum + s.amount, 0);
    const difference = paymentAmount - suggestedTotal;

    if (difference !== 0 && newSuggestions.length > 0) {
        // Distribute difference to the account with the highest balance
        const accountWithHighestBalance = newSuggestions.sort((a,b) => accounts.find(acc => acc.id === b.accountId)!.balance - accounts.find(acc => acc.id === a.accountId)!.balance)[0]
        if(accountWithHighestBalance) {
            const accIndex = newSuggestions.findIndex(s => s.accountId === accountWithHighestBalance.accountId);
            if(newSuggestions[accIndex].amount + difference <= accounts.find(acc => acc.id === accountWithHighestBalance.accountId)!.balance) {
                newSuggestions[accIndex].amount += difference;
            }
        }
    }

    setSuggestions(newSuggestions);
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-12 shadow-sm border-dashed border-2 hover:border-solid hover:bg-accent/10 hover:text-accent-foreground">
          <WalletCards className="mr-2 h-5 w-5" />
          Make a Smart Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card/90 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>Payment Suggestion</DialogTitle>
          <DialogDescription>
            Enter a payment amount and we&apos;ll suggest how to split it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="e.g. 500000"
              className="col-span-3"
            />
          </div>
        </div>
        {suggestions.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-center">Suggested Split</h4>
            <div className="space-y-2">
              {suggestions.map(s => (
                <div key={s.accountId} className="flex items-center justify-between p-2 rounded-md bg-secondary">
                  <div className="flex items-center gap-2">
                    {s.type === 'bank' ? <BankIcon className="w-5 h-5 text-muted-foreground" /> : <EwalletIcon className="w-5 h-5 text-muted-foreground" />}
                    <span className="text-sm font-medium">{s.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold font-mono">{formatCurrency(s.amount)}</p>
                    <p className="text-xs text-muted-foreground">({s.percentage.toFixed(1)}%)</p>
                  </div>
                </div>
              ))}
            </div>
             <div className="flex items-center justify-end p-2 font-bold text-lg border-t mt-2">
                <span className="text-muted-foreground mr-2">Total:</span>
                <span>{formatCurrency(suggestions.reduce((sum, s) => sum + s.amount, 0))}</span>
             </div>
          </div>
        )}
        <DialogFooter>
          <Button type="button" className="w-full" disabled={!amount || suggestions.length === 0}>
            Proceed with Payment <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
