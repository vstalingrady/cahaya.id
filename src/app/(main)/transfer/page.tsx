'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  ChevronRight,
  QrCode,
  Send,
  Wallet,
  ArrowDownUp,
  User,
  Clapperboard,
  CreditCard,
  ReceiptText,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { type CarouselApi } from '@/components/ui/carousel';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import NoiseOverlay from '@/components/noise-overlay';
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
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  
  const [actionsApi, setActionsApi] = useState<CarouselApi>()
  const [actionsCurrent, setActionsCurrent] = useState(0)
  const [actionsCount, setActionsCount] = useState(0)
  
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    return transactions.filter(t =>
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])
  
  useEffect(() => {
    if (!actionsApi) return
    setActionsCount(actionsApi.scrollSnapList().length)
    setActionsCurrent(actionsApi.selectedScrollSnap())
    actionsApi.on("select", () => {
      setActionsCurrent(actionsApi.selectedScrollSnap())
    })
  }, [actionsApi])

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
          Pay & Transfer
        </h1>
        <p className="text-muted-foreground">Your central hub for all payments.</p>
      </div>

       <Link 
          href="/transfer/qris"
          className="w-full bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-center text-red-200 border-2 border-dashed border-red-600/40 hover:border-red-500/80 transition-all duration-300 relative overflow-hidden group"
      >
          <NoiseOverlay opacity={0.02} />
          <QrCode className="w-8 h-8 mr-4 text-primary group-hover:text-accent transition-colors relative z-10" />
          <span className="font-bold text-xl text-white group-hover:text-red-100 transition-colors relative z-10">Pay with QRIS</span>
      </Link>

       <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white font-serif">Services</h2>
          <Carousel setApi={setActionsApi} className="w-full -ml-4" opts={{ align: 'start' }}>
            <CarouselContent>
              {transferActions.map((action) => {
                return (
                  <CarouselItem key={action.name} className="basis-1/3 pl-4">
                    <Link
                      href={action.href}
                      className="h-full text-left bg-gradient-to-br from-red-900/60 to-red-800/60 backdrop-blur-xl p-5 rounded-2xl flex flex-col justify-between hover:from-red-800/70 hover:to-red-700/70 transition-all duration-300 border border-red-600/20 shadow-lg group relative overflow-hidden"
                    >
                      <NoiseOverlay opacity={0.03} />
                      <div className="flex-1">
                        <div className="bg-gradient-to-br from-red-500 to-red-700 p-3 rounded-xl shadow-lg mb-3 inline-block">
                            <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="font-bold text-lg text-white">{action.name}</p>
                        <p className="text-red-300 text-sm font-light">{action.description}</p>
                      </div>
                    </Link>
                  </CarouselItem>
                )
            })}
            </CarouselContent>
          </Carousel>
          <div className="flex justify-center space-x-2 pt-2">
            {Array.from({ length: actionsCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => actionsApi?.scrollTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${actionsCurrent === i ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/50 hover:bg-muted-foreground'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white font-serif">Recommended</h2>
          <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {recommendedTransactions.map((rec) => {
                const Component = rec.disabled ? 'button' : Link;
                return (
                  <CarouselItem key={rec.id}>
                    <Component
                      href={rec.href}
                      // @ts-ignore
                      disabled={rec.disabled}
                      className="w-full text-left bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center gap-5 hover:from-red-800/60 hover:to-red-700/60 transition-all duration-300 border border-red-600/20 shadow-lg group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <NoiseOverlay opacity={0.03} />
                      <div className="bg-gradient-to-br from-red-500 to-red-700 p-3 rounded-xl shadow-lg">
                        <rec.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-white">{rec.name}</p>
                        <p className="text-red-300 text-sm font-mono">{formatCurrency(rec.amount)}</p>
                      </div>
                    </Component>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
          <div className="flex justify-center space-x-2 pt-2">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${current === i ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/50 hover:bg-muted-foreground'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white font-serif">Recent Transactions</h2>
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-300" />
                <Input
                    type="text"
                    placeholder="Search transactions..."
                    className="bg-red-950/50 border-red-800/50 h-14 pl-12 text-base placeholder:text-red-300/70"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            <TransactionHistory transactions={filteredTransactions} />
        </div>
    </div>
  );
}
