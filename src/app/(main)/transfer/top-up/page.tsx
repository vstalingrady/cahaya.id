'use client';

import Link from 'next/link';
import { ArrowLeft, Wallet, Phone, Wifi, Lightbulb, Gamepad2 } from 'lucide-react';

const topUpServices = [
  { name: 'GoPay', icon: Wallet, description: 'Top up your GoPay e-wallet' },
  { name: 'OVO', icon: Wallet, description: 'Top up your OVO e-wallet' },
  { name: 'Mobile Credit', icon: Phone, description: 'Prepaid mobile credit' },
  { name: 'Data Package', icon: Wifi, description: 'Mobile data packages' },
  { name: 'Electricity Token', icon: Lightbulb, description: 'Prepaid electricity (PLN)' },
  { name: 'Game Voucher', icon: Gamepad2, description: 'Mobile Legends, Free Fire, etc.' },
];

export default function TopUpPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-center relative">
        <Link href="/transfer" className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-bold mx-auto text-accent font-serif">
          Top Up
        </h1>
      </header>

      <div className="space-y-4">
        {topUpServices.map((service) => (
          <button
            key={service.name}
            className="w-full text-left bg-card p-5 rounded-2xl flex items-center gap-5 hover:bg-secondary transition-all duration-300 border border-border shadow-lg group"
          >
            <div className="bg-primary p-3 rounded-xl shadow-lg">
              <service.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-lg text-white">{service.name}</p>
              <p className="text-muted-foreground text-sm">{service.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
