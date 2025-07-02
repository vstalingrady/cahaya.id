'use client';

import { useState, useMemo } from 'react';
import {
  ChevronRight,
  QrCode,
  Send,
  Wallet,
  User,
  Clapperboard,
  CreditCard,
  ReceiptText,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import TransactionHistory from '@/components/dashboard/transaction-history';
import { transactions } from '@/lib/data';

const transferActions = [
  { name: 'Transfer', icon: Send, href: '/transfer/recipients', description: "To any bank account" },
  { name: 'Pay Bills', icon: ReceiptText, href: '/bills', description: "PLN, BPJS, TV, etc." },
  { name: 'Top Up', icon: Wallet, href: '/transfer/top-up', description: "GoPay, OVO, Credit" },
];

const recommendedTransactions = [
  {
    id: 'rec1',
    name: 'Transfer to Mom',
    amount: 1000000,
    href: '/transfer/ben3', // Corresponds to Mom's beneficiary ID
    icon: User,
    disabled: false,
  },
  {
    id: 'rec2',
    name: 'Pay Netflix',
    amount: 186000,
    href: '#', // In a real app, this would link to a pre-filled bill payment
    icon: Clapperboard,
    disabled: true,
  },
  {
    id: 'rec3',
    name: 'Pay Kredivo',
    amount: 1250000,
    href: '#',
    icon: CreditCard,
    disabled: true,
  },
];

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);


export default function TransferPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    return transactions.filter(t =>
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold mb-1 text-primary font-serif">
          Pay & Transfer
        </h1>
        <p className="text-muted-foreground">Your central hub for all payments.</p>
      </div>

       <Link 
          href="/transfer/qris"
          className="w-full bg-card p-5 rounded-2xl flex items-center justify-center text-muted-foreground border-2 border-dashed border-border hover:border-primary/80 hover:text-primary transition-all duration-300 group"
      >
          <QrCode className="w-8 h-8 mr-4 text-primary group-hover:text-primary/80 transition-colors relative z-10" />
          <span className="font-semibold text-xl text-white group-hover:text-primary transition-colors relative z-10">Pay with QRIS</span>
      </Link>

       <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white font-serif">Services</h2>
          <div className="grid grid-cols-1 gap-4">
            {transferActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="w-full text-left bg-card p-5 rounded-2xl flex items-center gap-5 hover:bg-secondary transition-all duration-300 border border-border shadow-lg group"
              >
                <div className="bg-primary p-3 rounded-xl shadow-lg">
                    <action.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg text-white">{action.name}</p>
                  <p className="text-muted-foreground text-sm">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white font-serif">Recommended</h2>
           <div className="grid grid-cols-1 gap-4">
              {recommendedTransactions.map((rec) => {
                const Component = rec.disabled ? 'button' : Link;
                return (
                  <Component
                    key={rec.id}
                    href={rec.href}
                    // @ts-ignore
                    disabled={rec.disabled}
                    className="w-full text-left bg-card p-5 rounded-2xl flex items-center justify-between hover:bg-secondary transition-all duration-300 border border-border shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-3 rounded-xl shadow-lg">
                          <rec.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg text-white">{rec.name}</p>
                          <p className="text-muted-foreground text-sm font-mono">{formatCurrency(rec.amount)}</p>
                        </div>
                    </div>
                     <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Component>
                );
              })}
          </div>
        </div>
      
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white font-serif">Recent Transactions</h2>
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search transactions..."
                    className="bg-input border-border h-14 pl-12 text-base placeholder:text-muted-foreground"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            <TransactionHistory transactions={filteredTransactions} />
        </div>
    </div>
  );
}
