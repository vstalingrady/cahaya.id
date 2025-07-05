'use client';

import { Plus, Repeat, Trash2, Link2 } from "lucide-react";
import { vaults as initialVaults, type Vault } from '@/lib/data';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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

export default function WelcomeVaultsMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    return (
        <div className={cn(
            "relative w-full max-w-sm h-[500px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-4 backdrop-blur-sm overflow-hidden flex flex-col",
            className
        )}>
            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2 pointer-events-none">
                <div>
                    <h1 className="text-2xl font-bold mb-1 font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Cuan Vaults
                    </h1>
                    <p className="text-muted-foreground text-sm">Save for all your goals, together.</p>
                </div>

                <div className="space-y-4">
                    {initialVaults.map(vault => (
                        <div key={vault.id} className="block bg-card p-4 rounded-2xl border border-border">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3">
                                    <div className="text-2xl mt-1">{icons[vault.icon] || '💰'}</div>
                                    <div>
                                        <p className="font-semibold text-lg text-white">{vault.name}</p>
                                        <p className="text-sm">
                                            <span className="text-white font-semibold">{formatCurrency(vault.currentAmount)}</span>
                                            <span className="font-normal text-muted-foreground"> of {formatCurrency(vault.targetAmount)}</span>
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            
                            <div className="mb-3">
                                <Progress value={(vault.currentAmount / vault.targetAmount) * 100} className="h-2 bg-secondary [&>div]:bg-primary" />
                            </div>

                            <div className="flex items-center justify-between min-h-[34px]">
                                <div className="text-xs space-y-1">
                                    {vault.autoSaveEnabled && (
                                        <div className="flex items-center gap-2 font-semibold text-green-400">
                                            <Repeat className="w-3 h-3" />
                                            <span>Auto-saving {formatCurrency(vault.autoSaveAmount || 0)} / {vault.autoSaveFrequency}</span>
                                        </div>
                                    )}
                                    {vault.roundUpEnabled && (
                                        <div className="flex items-center gap-2 font-semibold text-green-400">
                                            <Link2 className="w-3 h-3" />
                                            <span>Round-up savings active</span>
                                        </div>
                                    )}
                                </div>

                                {vault.isShared && (
                                     <div className="flex -space-x-3 rtl:space-x-reverse items-center">
                                        <div className="w-8 h-8 rounded-full bg-muted border-2 border-card" />
                                        <div className="w-8 h-8 rounded-full bg-muted border-2 border-card" />
                                        <div className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-primary border-2 border-card rounded-full">
                                            +2
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full bg-card p-5 rounded-2xl flex items-center justify-center text-muted-foreground border-2 border-dashed border-border group">
                    <Plus className="w-6 h-6 mr-3" />
                    <span className="font-semibold">Create New Vault</span>
                </div>
            </div>
        </div>
    );
}