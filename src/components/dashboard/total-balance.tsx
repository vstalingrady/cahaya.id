import { Wallet } from "lucide-react";
import NoiseOverlay from "../noise-overlay";

type TotalBalanceProps = {
  amount: number;
};

export default function TotalBalance({ amount }: TotalBalanceProps) {
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <div className="bg-gradient-to-r from-accent via-emerald-500 to-accent p-8 rounded-3xl shadow-2xl border border-accent/30 relative overflow-hidden">
      <NoiseOverlay opacity={0.1} />
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-transparent"></div>
      <div className="relative z-10">
        <h2 className="text-sm text-teal-100 mb-2 font-bold uppercase tracking-wide flex items-center gap-2"><Wallet className="w-4 h-4" /> Total Net Worth</h2>
        <div className="text-4xl font-black mb-3 text-white">{formattedAmount}</div>
        <div className="flex items-center text-teal-100">
          <span className="text-lg mr-2">↗</span>
          <span className="font-bold">+ Rp 1.200.000 today</span>
        </div>
      </div>
    </div>
  );
}
