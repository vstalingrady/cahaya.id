'use client'

import { Plus } from "lucide-react";
import { vaults } from '@/lib/data';
import { Progress } from "@/components/ui/progress";
import NoiseOverlay from "@/components/noise-overlay";

const icons: { [key: string]: string } = {
  "Emergency": "🚨",
  "Holiday": "✈️",
  "New Gadget": "📱",
};

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
}).format(value);


export default function VaultsPage() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-black mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
                    Cuan Vaults
                </h1>
                <p className="text-muted-foreground">Simpan untuk semua tujuanmu.</p>
            </div>

            <div className="space-y-4">
                {vaults.map(vault => (
                    <div key={vault.id} className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl border border-red-600/20 shadow-2xl relative overflow-hidden">
                        <NoiseOverlay opacity={0.03} />
                         <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl">{icons[vault.icon] || '💰'}</div>
                                <div>
                                    <p className="font-bold text-lg text-white">{vault.name}</p>
                                    <p className="text-sm text-red-300 font-bold">{formatCurrency(vault.currentAmount)} <span className="font-normal text-red-400">of {formatCurrency(vault.targetAmount)}</span></p>
                                </div>
                            </div>
                        </div>
                        <Progress value={(vault.currentAmount / vault.targetAmount) * 100} className="h-2 bg-red-900/80 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" />
                    </div>
                ))}
            </div>

             <button className="w-full bg-gradient-to-r from-red-900/30 to-red-800/30 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-center text-red-300 border-2 border-dashed border-red-600/40 hover:border-red-600/60 transition-all duration-300 relative overflow-hidden group">
                <NoiseOverlay opacity={0.02} />
                <Plus className="w-6 h-6 mr-3 group-hover:text-red-200 transition-colors relative z-10" />
                <span className="font-semibold group-hover:text-red-200 transition-colors relative z-10">Create New Vault</span>
            </button>
        </div>
    );
}
