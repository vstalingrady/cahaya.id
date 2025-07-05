
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Cable, Phone, Droplets, Lightbulb, Shield, Car, CreditCard, Sparkles, Loader2, Plus, X, Landmark, Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDashboardData, getBillSuggestions } from '@/lib/actions';
import { type Transaction } from '@/lib/data';
import { type BillDiscoveryOutput } from '@/ai/flows/bill-discovery';
import { useToast } from '@/hooks/use-toast';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const billers = [
  { name: 'PLN', subtext: 'Token & Postpaid Bills', icon: Lightbulb },
  { name: 'BPJS', subtext: 'Kesehatan Insurance', icon: Shield },
  { name: 'PDAM Water', subtext: 'Regional Water Bill', icon: Droplets },
  { name: 'IndiHome', subtext: 'Internet & TV Bill', icon: Tv },
  { name: 'First Media', subtext: 'Internet & Cable TV', icon: Cable },
  { name: 'Credit Card Bill', subtext: 'Pay Your Cicilan', icon: CreditCard },
  { name: 'E-Samsat', subtext: 'Vehicle Tax (PKB)', icon: Car },
  { name: 'PBB', subtext: 'Property Tax', icon: Landmark },
];

export default function BillsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [aiResult, setAiResult] = useState<BillDiscoveryOutput | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { transactions } = await getDashboardData(user.uid);
            setTransactions(transactions);
        } catch (error) {
            console.error("Failed to fetch transaction data:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not load your transaction data.'
            });
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, [user, toast]);

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
          toast({ title: 'All Clear!', description: "We couldn't find any new recurring bills." });
        }
      }
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred.' });
    }
    setIsScanning(false);
  };
  
  const dismissSuggestion = (billName: string) => {
    if (!aiResult) return;
    setAiResult({
      ...aiResult,
      potentialBills: aiResult.potentialBills.filter(b => b.name !== billName)
    });
  }
  
  const addBill = (billName: string) => {
    toast({ title: 'Success!', description: `${billName} has been added to your tracked bills.` });
    dismissSuggestion(billName);
  }
  
  if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full pt-24">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold mb-1 font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Bill Center
        </h1>
        <p className="text-muted-foreground">Pay all your bills from one place.</p>
      </div>

      <div className="bg-card backdrop-blur-xl p-5 rounded-2xl border border-border shadow-lg shadow-primary/10">
        <div className="flex items-center gap-4 mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
          <div>
            <h3 className="font-semibold text-white text-lg font-serif">AI Bill Discovery</h3>
            <p className="text-sm text-muted-foreground">Find recurring subscriptions & bills automatically.</p>
          </div>
        </div>

        {aiResult === null && !isScanning && (
          <Button onClick={handleScanForBills} disabled={transactions.length === 0} className="w-full bg-primary/80 hover:bg-primary text-white font-semibold">
            <Sparkles className="w-4 h-4 mr-2" />
            Scan for Recurring Bills
          </Button>
        )}

        {isScanning && (
          <Button disabled className="w-full bg-primary/80 text-white font-semibold">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Scanning Transactions...
          </Button>
        )}

        {aiResult && aiResult.potentialBills.length > 0 && (
          <div className="space-y-3 mt-4">
            {aiResult.potentialBills.map(bill => (
              <div key={bill.name} className="bg-secondary p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{bill.name}</p>
                  <p className="text-xs text-muted-foreground">~{formatCurrency(bill.estimatedAmount)} / month</p>
                </div>
                <div className="flex gap-2">
                   <Button size="sm" variant="outline" className="bg-primary/20 border-primary/50 text-primary hover:bg-primary/30" onClick={() => addBill(bill.name)}>
                     <Plus className="w-4 h-4" />
                   </Button>
                   <Button size="sm" variant="ghost" className="hover:bg-secondary" onClick={() => dismissSuggestion(bill.name)}>
                     <X className="w-4 h-4" />
                   </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {billers.map((biller) => (
          <button key={biller.name} className="w-full text-left bg-card p-5 rounded-2xl flex items-center gap-5 hover:bg-secondary transition-all duration-300 border border-border shadow-lg shadow-primary/10 group">
            <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl shadow-lg">
                <biller.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-lg text-white">{biller.name}</p>
              <p className="text-muted-foreground text-sm">{biller.subtext}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
