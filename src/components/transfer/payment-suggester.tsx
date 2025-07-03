'use client';

import { useState } from 'react';
import { BrainCircuit, Loader2, Info, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getPaymentSuggestion } from '@/lib/actions';
import { accounts } from '@/lib/data';
import { type PaymentSuggestionOutput } from '@/ai/flows/payment-suggestion';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { cn } from '@/lib/utils';


const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

export default function PaymentSuggester() {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PaymentSuggestionOutput | null>(null);
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to get a suggestion.',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const suggestionResult = await getPaymentSuggestion(numericAmount, accounts);
      if (suggestionResult.error) {
          toast({ variant: 'destructive', title: 'Error', description: suggestionResult.error });
      }
      setResult(suggestionResult);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card backdrop-blur-xl p-5 rounded-2xl border border-border shadow-lg shadow-primary/10 space-y-4">
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl shadow-lg">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-white font-serif">AI Payment Planner</h3>
          <p className="text-muted-foreground text-sm">Not sure how to pay? Let us help you split it.</p>
        </div>
      </div>
      
      <div className="flex gap-4">
        <Input
          type="number"
          placeholder="Enter payment amount"
          className="bg-input border-border h-12 text-base placeholder:text-muted-foreground"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading}
        />
        <Button onClick={handleGetSuggestion} disabled={isLoading || !amount} className="h-12">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Suggest'}
        </Button>
      </div>
      
      {result && (
        <div className="pt-4 border-t border-border/50 animate-fade-in-up">
            {!result.isSufficient ? (
                 <Alert variant="destructive">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Insufficient Funds</AlertTitle>
                    <AlertDescription>{result.suggestion}</AlertDescription>
                 </Alert>
            ) : (
                <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>AI Payment Plan</AlertTitle>
                    <AlertDescription className="mb-4">{result.suggestion}</AlertDescription>
                    <div className="space-y-2 mt-4">
                        {result.paymentPlan.map(step => (
                            <div key={step.accountId} className="bg-secondary p-3 rounded-lg flex justify-between items-center">
                                <p className="text-white font-medium">Use <span className="font-bold">{step.accountName}</span></p>
                                <p className="text-primary font-bold font-mono">{formatCurrency(step.amountToUse)}</p>
                            </div>
                        ))}
                    </div>
                </Alert>
            )}
        </div>
      )}
    </div>
  );
}
