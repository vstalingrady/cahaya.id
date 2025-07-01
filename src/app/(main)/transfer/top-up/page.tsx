'use client';

import Link from 'next/link';
import { ArrowLeft, Wallet, Phone, Wifi, Lightbulb, Gamepad2 } from 'lucide-react';
import NoiseOverlay from '@/components/noise-overlay';

const topUpServices = [
  { name: 'GoPay', icon: Wallet, description: 'Top up your GoPay e-wallet' },
  { name: 'OVO', icon: Wallet, description: 'Top up your OVO e-wallet' },
  { name: 'Pulsa', icon: Phone, description: 'Prepaid mobile credit' },
  { name: 'Paket Data', icon: Wifi, description: 'Mobile data packages' },
  { name: 'Token Listrik', icon: Lightbulb, description: 'Prepaid electricity (PLN)' },
  { name: 'Voucher Game', icon: Gamepad2, description: 'Mobile Legends, Free Fire, etc.' },
];

export default function TopUpPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-center relative">
        <Link href="/transfer" className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-black mx-auto bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
          Top Up
        </h1>
      </header>

      <div className="space-y-4">
        {topUpServices.map((service) => (
          <button
            key={service.name}
            className="w-full text-left bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center gap-5 hover:from-red-800/60 hover:to-red-700/60 transition-all duration-300 border border-red-600/20 shadow-2xl group relative overflow-hidden"
          >
            <NoiseOverlay opacity={0.03} />
            <div className="bg-gradient-to-br from-red-500 to-red-700 p-3 rounded-xl shadow-lg">
              <service.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg text-white">{service.name}</p>
              <p className="text-red-300 text-sm">{service.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
