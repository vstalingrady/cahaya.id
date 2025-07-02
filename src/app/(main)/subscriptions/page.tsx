'use client';

import { useState, useMemo } from 'react';
import { Repeat, Loader2, Sparkles, ReceiptText, Clapperboard, Music, Wifi, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { transactions } from '@/lib/data';
import { getBillSuggestions } from '@/lib/actions';
import { type BillDiscoveryOutput } from '@/ai/flows/bill-discovery';
import { useToast } from '@/hooks/use-toast';
import { addMonths, format, getDate, isBefore } from 'date-fns';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const getSubscriptionIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('netflix')) return Clapperboard;
    if (lowerName.includes('spotify')) return Music;
    if (lowerName.includes('indihome') || lowerName.includes('first media') || lowerName.includes('internet')) return Wifi;
    if (lowerName.includes('bpjs')) return Shield;
    return ReceiptText;
}

const calculateNextBillDate = (firstDateStr: string) => {
    const firstDate = new Date(firstDateStr);
    const today = new Date();
    
    let nextDate = new Date(today.getFullYear(), today.getMonth(), getDate(firstDate));

    if (isBefore(nextDate, today)) {
        nextDate = addMonths(nextDate, 1);
    }

    return format(nextDate, 'd MMM yyyy');
}


export default function SubscriptionsPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [aiResult, setAiResult] = useState<BillDiscoveryOutput | null>(null);
  const { toast } = useToast();

  const handleScanForBills = async () => {
    setIsScanning(true);
    setAiResult(null);
    try {
      const result = await getBillSuggestions(transactions);
      if (result.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
        setAiResult({ potentialBills: [] });
      } else {
        setAiResult(result);
        if (result.potentialBills.length === 0) {
          toast({ title: 'All Clear!', description: "We couldn't find any recurring subscriptions." });
        }
      }
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred.' });
    }
    setIsScanning(false);
  };
  
  const totalMonthlyCost = useMemo(() => {
    if (!aiResult) return 0;
    return aiResult.potentialBills.reduce((acc, bill) => acc + bill.estimatedAmount, 0);
  }, [aiResult]);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold mb-1 text-primary font-serif">
          Subscriptions
        </h1>
        <p className="text-muted-foreground">Track your recurring bills & subscriptions.</p>
      </div>

      <div className="bg-card backdrop-blur-xl p-5 rounded-2xl border border-border shadow-lg">
        <div className="flex items-center justify-between">
            <div>
                <h3 className="font-semibold text-white text-lg font-serif">AI Discovery</h3>
                <p className="text-sm text-muted-foreground">Scan transactions to find subscriptions.</p>
            </div>
            <Button onClick={handleScanForBills} disabled={isScanning} size="sm" className="bg-primary/80 hover:bg-primary text-white font-semibold">
                {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isScanning ? 'Scanning...' : 'Scan'}</span>
            </Button>
        </div>
      </div>

      {aiResult && (
        <>
            <div className="bg-card p-5 rounded-2xl shadow-lg border border-border/50 bg-gradient-to-br from-card to-primary/10">
                <h2 className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Total Monthly Costs</h2>
                <p className="text-3xl font-bold text-white mt-1">{formatCurrency(totalMonthlyCost)}</p>
                <p className="text-muted-foreground text-sm mt-1">from {aiResult.potentialBills.length} subscriptions</p>
            </div>
            
            <div className="space-y-4">
                 <h2 className="text-xl font-semibold text-white font-serif">Detected Subscriptions</h2>
                {aiResult.potentialBills.length > 0 ? aiResult.potentialBills.map(bill => {
                    const Icon = getSubscriptionIcon(bill.name);
                    return (
                      <div key={bill.name} className="w-full text-left bg-card p-5 rounded-2xl flex items-center justify-between border border-border shadow-lg">
                          <div className="flex items-center gap-4">
                              <div className="bg-primary/20 p-3 rounded-xl shadow-lg">
                                  <Icon className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-lg text-white">{bill.name}</p>
                                <p className="text-muted-foreground text-sm font-semibold">{formatCurrency(bill.estimatedAmount)}<span className="font-normal text-muted-foreground/70"> / mo</span></p>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="text-sm text-muted-foreground">Next Bill</p>
                              <p className="font-semibold text-white">{calculateNextBillDate(bill.firstDetectedDate)}</p>
                          </div>
                      </div>
                    )
                }) : (
                     <div className="bg-card p-6 rounded-xl text-center text-muted-foreground border border-border">
                        No recurring subscriptions found in your transaction history.
                    </div>
                )}
            </div>
        </>
      )}

      {!aiResult && !isScanning && (
         <div className="bg-card p-10 rounded-xl text-center text-muted-foreground border-2 border-dashed border-border flex flex-col items-center">
            <Repeat className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Ready to find your subscriptions?</h3>
            <p className="max-w-xs mb-4">Click the scan button to let our AI analyze your transactions and find all your recurring payments.</p>
        </div>
      )}

    </div>
  );
}
