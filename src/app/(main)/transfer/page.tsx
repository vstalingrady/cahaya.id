'use client';

import { Plus, ChevronRight, Cable, Phone, Droplets, Lightbulb, Shield, Car, CreditCard, QrCode } from 'lucide-react';
import Link from 'next/link';

import NoiseOverlay from '@/components/noise-overlay';
import { beneficiaries } from '@/lib/data';

const getBankLogo = (bankName: string) => {
    const lowerName = bankName.toLowerCase();
    const initials = bankName.split(' ').map(n => n[0]).join('');

    if (lowerName.includes('bca')) return <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">BCA</div>;
    if (lowerName.includes('mandiri')) return <div className="w-12 h-12 bg-gradient-to-br from-sky-600 to-sky-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">MDR</div>;
    if (lowerName.includes('bni')) return <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">BNI</div>;
    return <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">{initials.substring(0, 3)}</div>;
}

const billers = [
  { name: 'PLN', subtext: 'Token & Tagihan', icon: Lightbulb },
  { name: 'Pulsa & Data', subtext: 'Telkomsel, XL, etc.', icon: Phone },
  { name: 'Air PDAM', subtext: 'Tagihan Air', icon: Droplets },
  { name: 'Internet & TV', subtext: 'IndiHome, First Media', icon: Cable },
  { name: 'BPJS', subtext: 'Kesehatan', icon: Shield },
  { name: 'E-Samsat', subtext: 'Pajak Kendaraan', icon: Car },
  { name: 'Kartu Kredit', subtext: 'Tagihan Kartu', icon: CreditCard },
];


export default function TransferPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
          Pay & Transfer
        </h1>
        <p className="text-muted-foreground">Your central hub for all payments.</p>
      </div>

      <button className="w-full text-left bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center gap-5 hover:from-red-800/60 hover:to-red-700/60 transition-all duration-300 border border-red-600/20 shadow-2xl group relative overflow-hidden">
        <NoiseOverlay opacity={0.03} />
        <div className="bg-gradient-to-br from-red-500 to-red-700 p-3 rounded-xl shadow-lg">
            <QrCode className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-bold text-lg text-white">Pay with QRIS</p>
          <p className="text-red-300 text-sm">Scan any QR code to pay instantly</p>
        </div>
      </button>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white font-serif">Transfer</h2>
            <Link href="/transfer/add-recipient" className="text-sm font-semibold text-accent hover:text-accent/90 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add New
            </Link>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {beneficiaries.map((beneficiary) => (
             <Link key={beneficiary.id} href={`/transfer/${beneficiary.id}`} className="w-full text-left bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between hover:from-red-800/60 hover:to-red-700/60 transition-all duration-300 border border-red-600/20 shadow-2xl group relative overflow-hidden">
                <NoiseOverlay opacity={0.03} />
                <div className="flex items-center gap-3">
                    {getBankLogo(beneficiary.bankName)}
                    <div>
                        <p className="font-bold text-lg text-white">{beneficiary.name}</p>
                        <p className="text-red-300 text-sm">{beneficiary.bankName} &bull; {beneficiary.accountNumber}</p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
            </Link>
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

    </div>
  );
}
