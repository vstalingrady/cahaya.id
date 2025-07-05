'use client';

import { Repeat, Link2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const icons: { [key: string]: string } = {
  "Emergency": "🚨",
  "Holiday": "✈️", 
  "New Gadget": "📱",
  "Home": "🏠",
  "Wedding": "💍",
};

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
}).format(value);

// Data to match the design
const vaults = [
  {
    id: 1,
    name: "Emergency Fund",
    icon: "Emergency",
    currentAmount: 2000000,
    targetAmount: 50000000,
    autoSaveEnabled: true,
    autoSaveAmount: 250000,
    autoSaveFrequency: "weekly",
    roundUpEnabled: true,
  },
  {
    id: 2,
    name: "Bali Holiday",
    icon: "Holiday",
    currentAmount: 3200000,
    targetAmount: 15000000,
    autoSaveEnabled: false,
    roundUpEnabled: false,
  },
  {
    id: 3,
    name: "New Phone",
    icon: "New Gadget",
    currentAmount: 850000,
    targetAmount: 25000000,
    autoSaveEnabled: true,
    autoSaveAmount: 1000000,
    autoSaveFrequency: "monthly",
    roundUpEnabled: false,
  },
   {
    id: 4,
    name: "Honeymoon Fund",
    icon: "Wedding",
    currentAmount: 7500000,
    targetAmount: 75000000,
    autoSaveEnabled: false,
    roundUpEnabled: false,
  }
];

export default function WelcomeVaultsMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    return (
        <div className={cn(
            "relative w-full max-w-sm h-[500px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-background text-white p-6 flex flex-col gap-4",
            className
        )}>
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-1 font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Cuan Vaults
                </h1>
                <p className="text-muted-foreground">Save for all your goals, together.</p>
            </div>

            {/* Vaults List */}
            <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 -mr-2 pr-2">
                {vaults.map((vault) => (
                    <div key={vault.id} className="bg-card p-5 rounded-2xl border border-border">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl pt-1">{icons[vault.icon] || '💰'}</div>
                            <div className="flex-1 space-y-2">
                                <p className="font-semibold text-lg text-white">{vault.name}</p>
                                <p className="text-sm">
                                    <span className="text-white font-semibold">{formatCurrency(vault.currentAmount)}</span>
                                    <span className="text-muted-foreground ml-1">of {formatCurrency(vault.targetAmount)}</span>
                                </p>
                                <Progress 
                                    value={(vault.currentAmount / vault.targetAmount) * 100} 
                                    className="h-2 bg-secondary [&>div]:bg-primary"
                                />
                                <div className="flex flex-col gap-1.5 pt-1">
                                    {vault.autoSaveEnabled && (
                                        <div className="flex items-center gap-2 text-xs text-green-400 font-medium">
                                            <Repeat className="w-3 h-3" />
                                            <span>Auto-saving {formatCurrency(vault.autoSaveAmount || 0)} / {vault.autoSaveFrequency}</span>
                                        </div>
                                    )}
                                    {vault.roundUpEnabled && (
                                        <div className="flex items-center gap-2 text-xs text-green-400 font-medium">
                                            <Link2 className="w-3 h-3" />
                                            <span>Round-up savings active</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
