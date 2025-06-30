import { Cable, Phone, Droplets, Lightbulb, Shield, Car, CreditCard } from 'lucide-react';
import NoiseOverlay from '@/components/noise-overlay';

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
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
          Pusat Tagihan
        </h1>
        <p className="text-muted-foreground">Bayar semua tagihan dari satu tempat.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {billers.map((biller) => (
          <button key={biller.name} className="w-full text-left bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center gap-5 hover:from-red-800/60 hover:to-red-700/60 transition-all duration-300 border border-red-600/20 shadow-2xl group relative overflow-hidden">
            <NoiseOverlay opacity={0.03} />
            <div className="bg-gradient-to-br from-red-500 to-red-700 p-3 rounded-xl shadow-lg">
                <biller.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-black text-lg text-white">{biller.name}</p>
              <p className="text-red-300 text-sm">{biller.subtext}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
