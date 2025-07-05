'use client';

import Link from 'next/link';
import { ArrowLeft, Wallet, Phone, Wifi, Lightbulb, Gamepad2, Laptop } from 'lucide-react';

const topUpServices = [
  { name: 'GoPay', icon: Wallet, description: 'Top up your GoPay e-wallet' },
  { name: 'OVO', icon: Wallet, description: 'Top up your OVO e-wallet' },
  { name: 'DANA', icon: Wallet, description: 'Top up your DANA e-wallet' },
  { name: 'ShopeePay', icon: Wallet, description: 'Top up your ShopeePay e-wallet' },
  { name: 'Mobile Credit (Pulsa)', icon: Phone, description: 'Telkomsel, Indosat, XL, etc.' },
  { name: 'Data Package (Paket Data)', icon: Wifi, description: 'Mobile data packages' },
  { name: 'Electricity Token (PLN)', icon: Lightbulb, description: 'Prepaid electricity' },
  { name: 'Game Vouchers', icon: Gamepad2, description: 'Mobile Legends, Steam, Garena' },
  { name: 'Google Play Vouchers', icon: Laptop, description: 'Buy apps, games, and content' },
];

export default function TopUpPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-center relative">
        <Link href="/transfer" className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <h1 className="text-2xl font-bold mx-auto font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Top Up & Vouchers
        </h1>
      </header>

      <div className="space-y-4">
        {topUpServices.map((service) => (
          <button
            key={service.name}
            className="w-full text-left bg-card p-5 rounded-2xl flex items-center gap-5 hover:bg-secondary transition-all duration-300 border border-border shadow-lg group"
          >
            <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl shadow-lg">
              <service.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-lg text-card-foreground">{service.name}</p>
              <p className="text-muted-foreground text-sm">{service.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
