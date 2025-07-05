
'use client';

import { Plus, Repeat, Link2, Trash2, Edit, Banknote } from "lucide-react";
import React, { useState, useEffect, useRef } from 'react';
import { vaults as initialVaults, type Vault } from '@/lib/data';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";

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

type DisplayVault = Vault & { isNew?: boolean, animatedAmount?: number };
type AnimationPhase = 'idle' | 'scrolling' | 'button_active' | 'show_form' | 'fill_form' | 'create_vault' | 'show_new_vault' | 'resetting';

export default function WelcomeVaultsMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    const [displayVaults, setDisplayVaults] = useState<DisplayVault[]>(initialVaults);
    const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('idle');
    const [formState, setFormState] = useState({ name: '', amount: '', autoSave: false });
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive) {
            setAnimationPhase('idle');
            setDisplayVaults(initialVaults);
            setFormState({ name: '', amount: '', autoSave: false });
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0;
            }
            return;
        }

        const timeouts: NodeJS.Timeout[] = [];
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const animationSequence = () => {
            setAnimationPhase('scrolling');
            timeouts.push(setTimeout(() => {
                scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
            }, 500));

            timeouts.push(setTimeout(() => setAnimationPhase('button_active'), 1500));

            timeouts.push(setTimeout(() => setAnimationPhase('show_form'), 1800));

            timeouts.push(setTimeout(() => {
                setAnimationPhase('fill_form');
                setFormState(prev => ({ ...prev, name: 'European Tour' }));
            }, 2500));
            timeouts.push(setTimeout(() => setFormState(prev => ({ ...prev, amount: '80000000' })), 3000));
            timeouts.push(setTimeout(() => setFormState(prev => ({ ...prev, autoSave: true })), 3500));
            
            timeouts.push(setTimeout(() => setAnimationPhase('create_vault'), 4000));
            
            timeouts.push(setTimeout(() => {
                const newVault: DisplayVault = {
                    id: 'vault-new', name: 'European Tour', icon: 'Holiday',
                    currentAmount: 5000000, targetAmount: 80000000,
                    sourceAccountIds: [], destinationAccountId: '', isNew: true,
                    animatedAmount: 0, roundUpEnabled: true,
                };
                setDisplayVaults(prevVaults => [...prevVaults, newVault]);
                setAnimationPhase('show_new_vault');
            }, 4300));

            timeouts.push(setTimeout(() => {
                setDisplayVaults(prev => prev.map(v => v.id === 'vault-new' ? {...v, animatedAmount: v.currentAmount} : v));
            }, 4800));
            
            timeouts.push(setTimeout(() => {
                setAnimationPhase('resetting');
                 setDisplayVaults(prev => prev.map(v => v.id === 'vault-new' ? {...v, isNew: false} : v));
            }, 8000));

            timeouts.push(setTimeout(() => {
                setFormState({ name: '', amount: '', autoSave: false });
                setDisplayVaults(initialVaults);
                scrollContainer.scrollTo({ top: 0, behavior: 'auto' });
                animationSequence();
            }, 8500));
        };
        
        animationSequence();

        return () => {
            timeouts.forEach(clearTimeout);
        };
    }, [isActive]);

    const showList = animationPhase !== 'show_form' && animationPhase !== 'fill_form' && animationPhase !== 'create_vault';

    return (
        <div className={cn(
            "relative w-full max-w-sm h-[500px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-4 backdrop-blur-sm overflow-hidden flex flex-col",
            className
        )}>
            <div className="flex-shrink-0 mb-4 pointer-events-none">
                <h1 className="text-3xl font-bold mb-1 font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Cuan Vaults
                </h1>
                <p className="text-muted-foreground">Save for all your goals, together.</p>
            </div>
            
            <div className="flex-1 overflow-hidden relative">
                {/* FORM MOCKUP */}
                <div className={cn("absolute inset-0 flex flex-col justify-center p-4 bg-card/80 rounded-xl transition-all duration-300",
                    !showList ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                )}>
                    <h3 className="text-lg font-bold text-center mb-6 font-serif">Create New Vault</h3>
                    <div className="space-y-4">
                        <div className="relative">
                            <Edit className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input value={formState.name} readOnly className="bg-input border-border h-12 pl-10" placeholder="e.g. Japan Trip 2025" />
                        </div>
                        <div className="relative">
                            <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input value={formState.amount ? formatCurrency(Number(formState.amount)) : ''} readOnly className="bg-input border-border h-12 pl-10" placeholder="IDR 0" />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-border p-3 bg-secondary">
                            <label className="text-sm font-medium">Enable Auto-Saving</label>
                            <Switch checked={formState.autoSave} readOnly />
                        </div>
                        <Button className={cn("w-full h-12 text-lg transition-colors duration-200", animationPhase === 'create_vault' ? 'bg-green-500' : 'bg-primary')}>Create Vault</Button>
                    </div>
                </div>

                {/* VAULT LIST */}
                <div ref={scrollContainerRef} className={cn("h-full space-y-4 overflow-y-auto custom-scrollbar pr-2 -mr-4 transition-opacity duration-300",
                    showList ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}>
                    {displayVaults.map(vault => {
                        const progress = (vault.animatedAmount ?? vault.currentAmount) / vault.targetAmount * 100;
                        return (
                            <div key={vault.id} id={vault.id} className={cn("block bg-card p-4 rounded-2xl border border-border transition-all duration-500",
                                vault.isNew === true && 'opacity-0 translate-y-4',
                                vault.isNew === false && 'opacity-0 -translate-y-4'
                            )} ref={el => { if (el && vault.isNew) { setTimeout(() => el.classList.remove('opacity-0', 'translate-y-4'), 50); }}}>
                                <div className="flex items-start justify-between mb-3"><div className="flex items-start gap-3">
                                    <div className="text-2xl mt-1">{icons[vault.icon] || '💰'}</div>
                                    <div><p className="font-semibold text-lg text-white">{vault.name}</p><p className="text-sm"><span className="text-white font-semibold">{formatCurrency(vault.animatedAmount ?? vault.currentAmount)}</span><span className="font-normal text-muted-foreground"> of {formatCurrency(vault.targetAmount)}</span></p>
                                    </div></div>
                                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="mb-3"><Progress value={progress} className="h-2 bg-secondary [&>div]:bg-primary [&>div]:transition-all [&>div]:duration-1000 [&>div]:ease-out" /></div>
                                <div className="flex items-center justify-between min-h-[34px]"><div className="text-xs space-y-1">
                                    {vault.autoSaveEnabled && (<div className="flex items-center gap-2 font-semibold text-green-400"><Repeat className="w-3 h-3" /><span>Auto-saving {formatCurrency(vault.autoSaveAmount || 0)} / {vault.autoSaveFrequency}</span></div>)}
                                    {vault.roundUpEnabled && (<div className="flex items-center gap-2 font-semibold text-green-400"><Link2 className="w-3 h-3" /><span>Round-up savings active</span></div>)}
                                </div>
                                {vault.isShared && (<div className="flex -space-x-3 rtl:space-x-reverse items-center"><div className="w-8 h-8 rounded-full bg-muted border-2 border-card" /><div className="w-8 h-8 rounded-full bg-muted border-2 border-card" /><div className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-primary border-2 border-card rounded-full">+2</div></div>)}
                                </div>
                            </div>
                        )
                    })}
                    <div className={cn("w-full bg-card p-5 rounded-2xl flex items-center justify-center text-muted-foreground border-2 border-dashed border-border transition-all duration-200",
                        animationPhase === 'button_active' && 'border-primary/80 bg-primary/20 text-primary'
                    )}>
                        <Plus className="w-6 h-6 mr-3" />
                        <span className="font-semibold">Create New Vault</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
