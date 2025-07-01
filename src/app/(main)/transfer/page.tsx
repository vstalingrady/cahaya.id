'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  ChevronRight,
  Cable,
  Phone,
  Droplets,
  Lightbulb,
  Shield,
  Car,
  CreditCard,
  QrCode,
  Send,
  Wallet,
  ArrowDownUp,
  User,
  Clapperboard,
} from 'lucide-react';
import Link from 'next/link';
import { type CarouselApi } from '@/components/ui/carousel';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

import NoiseOverlay from '@/components/noise-overlay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionHistory from '@/components/dashboard/transaction-history';
import { transactions } from '@/lib/data';

const transferActions = [
  { name: 'Transfer', icon: Send, href: '/transfer/recipients', disabled: false },
  { name: 'Top Up', icon: Wallet, href: '/transfer/top-up', disabled: false },
  { name: 'Tarik/Setor', icon: ArrowDownUp, href: '#', disabled: true },
]

const billers = [
  { name: 'PLN', subtext: 'Token & Tagihan', icon: Lightbulb },
  { name: 'Pulsa & Data', subtext: 'Telkomsel, XL, etc.', icon: Phone },
  { name: 'Air PDAM', subtext: 'Tagihan Air', icon: Droplets },
  { name: 'Internet & TV', subtext: 'IndiHome, First Media', icon: Cable },
  { name: 'BPJS', subtext: 'Kesehatan', icon: Shield },
  { name: 'E-Samsat', subtext: 'Pajak Kendaraan', icon: Car },
  { name: 'Kartu Kredit', subtext: 'Tagihan Kartu', icon: CreditCard },
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

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
          Pay & Transfer
        </h1>
        <p className="text-muted-foreground">Your central hub for all payments.</p>
      </div>

      <Tabs defaultValue="transfer" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-red-950/50 border-red-800/50 mb-6">
          <TabsTrigger value="transfer" className="data-[state=active]:bg-red-700/50 data-[state=active]:text-white">Transfer</TabsTrigger>
          <TabsTrigger value="recents" className="data-[state=active]:bg-red-700/50 data-[state=active]:text-white">Recents</TabsTrigger>
        </TabsList>
        <TabsContent value="transfer" className="space-y-8 mt-0">
          <Link href="/transfer/qris" className="w-full text-left bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center gap-5 hover:from-red-800/60 hover:to-red-700/60 transition-all duration-300 border border-red-600/20 shadow-2xl group relative overflow-hidden">
            <NoiseOverlay opacity={0.03} />
            <div className="bg-gradient-to-br from-red-500 to-red-700 p-3 rounded-xl shadow-lg">
                <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg text-white">Pay with QRIS</p>
              <p className="text-red-300 text-sm">Scan any QR code to pay instantly</p>
            </div>
          </Link>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white font-serif">Transfer</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {transferActions.map((action) => {
                  const Component = action.disabled ? 'button' : Link;
                  return (
                      <Component
                          key={action.name}
                          href={action.href!}
                          disabled={action.disabled}
                          className="text-center bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex flex-col items-center justify-center hover:from-red-800/60 hover:to-red-700/60 transition-all duration-300 border border-red-600/20 shadow-2xl group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          <NoiseOverlay opacity={0.03} />
                          <div className="bg-gradient-to-br from-red-500 to-red-700 p-3 rounded-xl shadow-lg mb-3">
                              <action.icon className="w-6 h-6 text-white" />
                          </div>
                          <p className="font-semibold text-white text-sm">{action.name}</p>
                      </Component>
                  )
              })}
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
                        className="w-full text-left bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center gap-5 hover:from-red-800/60 hover:to-red-700/60 transition-all duration-300 border border-red-600/20 shadow-2xl group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
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
        </TabsContent>
        <TabsContent value="recents" className="mt-0">
          <TransactionHistory transactions={transactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
