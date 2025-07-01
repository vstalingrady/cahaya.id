'use client';

import { useState } from 'react';
import { Cable, Phone, Droplets, Lightbulb, Shield, Car, CreditCard, Sparkles, Loader2, Plus, X } from 'lucide-react';
import NoiseOverlay from '@/components/noise-overlay';
import { Button } from '@/components/ui/button';
import { transactions } from '@/lib/data';
import { getBillSuggestions } from '@/lib/actions';
import { type BillDiscoveryOutput } from '@/ai/flows/bill-discovery';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const billers = [
  { name: 'PLN', subtext: 'Token & Tagihan', icon: Lightbulb },
  { name: 'Pulsa & Data', subtext: 'Telkomsel, XL, etc.', icon: Phone },
  { name: 'Air PDAM', subtext: 'Tagihan Air', icon: Droplets },
  { name: 'Internet & TV', subtext: 'IndiHome, First Media', icon: Cable },
  { name: 'BPJS', subtext: 'Kesehatan', icon: Shield },
  { name: 'E-Samsat', subtext: 'Pajak Kendaraan', icon: Car },
  { name: 'Kartu Kredit', subtext: 'Tagihan Kartu', icon: CreditCard },
];

export default function BillsPage() {
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

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
          Pusat Tagihan
        </h1>
        <p className="text-muted-foreground">Bayar semua tagihan dari satu tempat.</p>
      </div>

      <div className="bg-gradient-to-r from-red-950/50 to-red-900/50 backdrop-blur-xl p-5 rounded-2xl border border-red-600/20 shadow-2xl relative overflow-hidden">
        <NoiseOverlay opacity={0.03} />
        <div className="flex items-center gap-4 mb-4">
          <Sparkles className="w-8 h-8 text-accent" />
          <div>
            <h3 className="font-bold text-white text-lg font-serif">AI Bill Discovery</h3>
            <p className="text-sm text-red-300">Find recurring subscriptions & bills automatically.</p>
          </div>
        </div>

        {aiResult === null && !isScanning && (
          <Button onClick={handleScanForBills} className="w-full bg-accent/80 hover:bg-accent text-white font-bold">
            <Sparkles className="w-4 h-4 mr-2" />
            Scan for Recurring Bills
          </Button>
        )}

        {isScanning && (
          <Button disabled className="w-full bg-accent/80 text-white font-bold">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Scanning Transactions...
          </Button>
        )}

        {aiResult && aiResult.potentialBills.length > 0 && (
          <div className="space-y-3 mt-4">
            {aiResult.potentialBills.map(bill => (
              <div key={bill.name} className="bg-red-950/70 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{bill.name}</p>
                  <p className="text-xs text-red-300">~{formatCurrency(bill.estimatedAmount)} / month</p>
                </div>
                <div className="flex gap-2">
                   <Button size="sm" variant="outline" className="bg-red-800/50 border-red-700 hover:bg-red-800" onClick={() => addBill(bill.name)}>
                     <Plus className="w-4 h-4" />
                   </Button>
                   <Button size="sm" variant="destructive" className="bg-red-900/80 hover:bg-red-900" onClick={() => dismissSuggestion(bill.name)}>
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
  );
}
