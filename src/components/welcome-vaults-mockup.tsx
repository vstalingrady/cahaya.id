
'use client';

import { Plus, Repeat, Link2, Trash2, Edit, Banknote, Check, ChevronDown, Coins, ChevronsUpDown, ArrowUpFromLine, ArrowDownToLine } from "lucide-react";
import React, { useState, useEffect, useRef } from 'react';
import { vaults as initialVaults, type Vault, accounts } from '@/lib/data';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

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
    const [formState, setFormState] = useState({
        name: '',
        targetAmount: '',
        fundingSources: [] as string[],
        destinationAccount: '',
        autoSaveEnabled: false,
        autoSaveFrequency: '',
        autoSaveAmount: '',
        roundUpEnabled: false,
    });
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const formScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive) {
            setAnimationPhase('idle');
            setDisplayVaults(initialVaults);
            setFormState({ name: '', targetAmount: '', fundingSources: [], destinationAccount: '', autoSaveEnabled: false, autoSaveFrequency: '', autoSaveAmount: '', roundUpEnabled: false });
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0;
            }
            if (formScrollRef.current) {
                formScrollRef.current.scrollTop = 0;
            }
            return;
        }

        const timeouts: NodeJS.Timeout[] = [];
        const scrollContainer = scrollContainerRef.current;
        const formScroller = formScrollRef.current;
        if (!scrollContainer || !formScroller) return;
        
        const type = (text: string, updater: (newText: string) => void, onComplete?: () => void) => {
            let currentText = '';
            const interval = setInterval(() => {
                currentText = text.slice(0, currentText.length + 1);
                updater(currentText);
                if (currentText === text) {
                    clearInterval(interval);
                    if (onComplete) onComplete();
                }
            }, 50);
            timeouts.push(interval as unknown as NodeJS.Timeout);
        };

        const animationSequence = () => {
            setAnimationPhase('scrolling');
            timeouts.push(setTimeout(() => { scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' }); }, 500));
            timeouts.push(setTimeout(() => setAnimationPhase('button_active'), 1500));
            timeouts.push(setTimeout(() => setAnimationPhase('show_form'), 1800));

            timeouts.push(setTimeout(() => {
                setAnimationPhase('fill_form');
                type('European Tour', (t) => setFormState(p => ({...p, name: t})), 
                    () => timeouts.push(setTimeout(() => {
                        type('80000000', (t) => setFormState(p => ({...p, targetAmount: t})),
                            () => {
                                timeouts.push(setTimeout(() => setFormState(p => ({...p, fundingSources: ['bca1']})), 300));
                                timeouts.push(setTimeout(() => setFormState(p => ({...p, fundingSources: ['bca1', 'gopay1']})), 600));
                                timeouts.push(setTimeout(() => {
                                    setFormState(p => ({...p, destinationAccount: 'BCA Main Account'}));
                                    formScroller.scrollTo({ top: formScroller.scrollHeight, behavior: 'smooth' });
                                }, 900));
                                timeouts.push(setTimeout(() => setFormState(p => ({...p, autoSaveEnabled: true})), 1200));
                                timeouts.push(setTimeout(() => setFormState(p => ({...p, autoSaveFrequency: 'weekly'})), 1500));
                                timeouts.push(setTimeout(() => type('250000', (t) => setFormState(p => ({...p, autoSaveAmount: t}))), 1800));
                                timeouts.push(setTimeout(() => setFormState(p => ({...p, roundUpEnabled: true})), 2300));

                                timeouts.push(setTimeout(() => setAnimationPhase('create_vault'), 2800));
                                timeouts.push(setTimeout(() => {
                                    const newVault: DisplayVault = {
                                        id: 'vault-new', name: 'European Tour', icon: 'Holiday',
                                        currentAmount: 5000000, targetAmount: 80000000,
                                        sourceAccountIds: ['bca1', 'gopay1'],
                                        destinationAccountId: 'bca1',
                                        isNew: true,
                                        animatedAmount: 0, roundUpEnabled: true, autoSaveEnabled: true,
                                        autoSaveAmount: 250000, autoSaveFrequency: 'weekly'
                                    };
                                    setDisplayVaults(prevVaults => [...prevVaults, newVault]);
                                    setAnimationPhase('show_new_vault');
                                }, 3100));

                                timeouts.push(setTimeout(() => {
                                    setDisplayVaults(prev => prev.map(v => v.id === 'vault-new' ? {...v, animatedAmount: v.currentAmount} : v));
                                }, 3600));
                                
                                timeouts.push(setTimeout(() => {
                                    setAnimationPhase('resetting');
                                    setDisplayVaults(prev => prev.map(v => v.id === 'vault-new' ? {...v, isNew: false} : v));
                                }, 6600));

                                timeouts.push(setTimeout(() => {
                                    setFormState({ name: '', targetAmount: '', fundingSources: [], destinationAccount: '', autoSaveEnabled: false, autoSaveFrequency: '', autoSaveAmount: '', roundUpEnabled: false });
                                    setDisplayVaults(initialVaults);
                                    scrollContainer.scrollTo({ top: 0, behavior: 'auto' });
                                    formScroller.scrollTo({ top: 0, behavior: 'auto' });
                                    animationSequence();
                                }, 7100));
                            }
                        );
                    }, 300))
                );
            }, 2500));
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
            </div>
            
            <div className="flex-1 overflow-hidden relative">
                {/* FORM MOCKUP */}
                 <div className={cn("absolute inset-0 flex flex-col justify-start p-2 bg-card/80 rounded-xl transition-all duration-300 overflow-hidden",
                    !showList ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                )}>
                    <h3 className="text-base font-bold text-center mb-2 font-serif flex-shrink-0">Create New Vault</h3>
                    <div ref={formScrollRef} className="space-y-1.5 text-xs overflow-y-auto custom-scrollbar pr-1 flex-1">
                        {/* Name and Amount */}
                        <div className="relative">
                            <Edit className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                            <Input value={formState.name} readOnly className="bg-input border-border h-9 pl-7 text-xs" placeholder="e.g. European Tour" />
                        </div>
                        <div className="relative">
                            <Banknote className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                            <Input value={formState.targetAmount ? formatCurrency(Number(formState.targetAmount)) : ''} readOnly className="bg-input border-border h-9 pl-7 text-xs" placeholder="Target Amount" />
                        </div>

                        {/* Funding Sources */}
                        <div>
                            <label className="text-muted-foreground font-semibold text-xs">Funding Sources</label>
                            <div className={cn("flex h-9 w-full items-center justify-between rounded-md border bg-input px-3 py-2 mt-1 transition-colors", formState.fundingSources.length > 0 ? "border-primary" : "border-border")}>
                                <span className={cn(
                                    "truncate",
                                    formState.fundingSources.length > 0 ? "text-white" : "text-muted-foreground"
                                )}>
                                    {formState.fundingSources.length > 0
                                        ? formState.fundingSources.map(id => id === 'bca1' ? 'BCA Main Account' : 'GoPay').join(', ')
                                        : "Select funding sources"}
                                </span>
                                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                            </div>
                        </div>

                        {/* Destination Account */}
                        <div>
                            <label className="text-muted-foreground font-semibold text-xs">Destination Account</label>
                            <div className={cn("flex h-9 w-full items-center justify-between rounded-md border bg-input px-3 py-2 mt-1 transition-colors", formState.destinationAccount ? "border-primary" : "border-border")}>
                                <span className={cn(formState.destinationAccount ? "text-white" : "text-muted-foreground")}>
                                    {formState.destinationAccount ? formState.destinationAccount : 'Select an account'}
                                </span>
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </div>
                        </div>
                        
                        {/* Auto-saving */}
                        <div className="flex flex-row items-center justify-between rounded-lg border border-border p-2 bg-secondary">
                            <label className="text-xs text-white">Enable Auto-Saving</label>
                            <Switch checked={formState.autoSaveEnabled} readOnly className="scale-[0.6]" />
                        </div>

                        {/* Auto-saving details */}
                        <div className={cn("pl-2 border-l-2 border-primary/50 space-y-1 transition-all duration-300", formState.autoSaveEnabled ? "max-h-40 opacity-100" : "max-h-0 opacity-0 pointer-events-none")}>
                            <div className="grid grid-cols-3 gap-1">
                                <div className={cn("relative flex items-center justify-center rounded-md border-2 p-1.5 transition-colors", formState.autoSaveFrequency === 'daily' ? 'border-accent bg-accent/20' : 'border-border')}>
                                    <label className="font-normal cursor-pointer text-xs">Daily</label>
                                </div>
                                <div className={cn("relative flex items-center justify-center rounded-md border-2 p-1.5 transition-colors", formState.autoSaveFrequency === 'weekly' ? 'border-accent bg-accent/20' : 'border-border')}>
                                    <label className="font-normal cursor-pointer text-xs">Weekly</label>
                                </div>
                                <div className={cn("relative flex items-center justify-center rounded-md border-2 p-1.5 transition-colors", formState.autoSaveFrequency === 'monthly' ? 'border-accent bg-accent/20' : 'border-border')}>
                                    <label className="font-normal cursor-pointer text-xs">Monthly</label>
                                </div>
                            </div>
                            <div className="relative pt-0.5">
                                <Banknote className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                                <Input value={formState.autoSaveAmount ? formatCurrency(Number(formState.autoSaveAmount)) : ''} readOnly className="bg-input border-border h-9 pl-7 text-xs" placeholder="Auto-save amount" />
                            </div>
                        </div>

                        {/* Round up */}
                        <div className="flex flex-row items-center justify-between rounded-lg border border-border p-2 bg-secondary">
                            <label className="text-xs text-white">Enable Round-Ups</label>
                            <Switch checked={formState.roundUpEnabled} readOnly className="scale-[0.6]" />
                        </div>
                    </div>
                     <Button className={cn("w-full h-10 text-base mt-2 flex-shrink-0 transition-colors duration-200", animationPhase === 'create_vault' ? 'bg-green-500' : 'bg-primary')}>
                        {animationPhase === 'create_vault' ? <Check className="w-5 h-5"/> : 'Create Vault'}
                     </Button>
                </div>


                {/* VAULT LIST */}
                <div ref={scrollContainerRef} className={cn("h-full space-y-4 overflow-y-auto custom-scrollbar pr-2 -mr-4 transition-opacity duration-300",
                    showList ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}>
                    {displayVaults.map(vault => {
                        const progress = (vault.animatedAmount ?? vault.currentAmount) / vault.targetAmount * 100;
                        const sourceNames = vault.sourceAccountIds
                            .map(id => accounts.find(acc => acc.id === id)?.name)
                            .filter(Boolean)
                            .join(', ');
                        const destinationName = accounts.find(acc => acc.id === vault.destinationAccountId)?.name;
                        
                        return (
                            <div key={vault.id} id={vault.id} className={cn("block bg-card p-4 rounded-2xl border border-border transition-all duration-500",
                                vault.isNew === true && 'opacity-0 translate-y-4',
                                vault.isNew === false && animationPhase === 'resetting' && 'opacity-0 -translate-y-4'
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
                                    {vault.roundUpEnabled && (<div className="flex items-center gap-2 font-semibold text-green-400"><Coins className="w-3 h-3" /><span>Round-up savings active</span></div>)}
                                    {sourceNames && (
                                        <div className="flex items-center gap-2 font-medium text-muted-foreground pt-1">
                                            <ArrowUpFromLine className="w-3 h-3" />
                                            <span className="truncate">From: {sourceNames}</span>
                                        </div>
                                    )}
                                    {destinationName && (
                                        <div className="flex items-center gap-2 font-medium text-muted-foreground">
                                            <ArrowDownToLine className="w-3 h-3" />
                                            <span>To: {destinationName}</span>
                                        </div>
                                    )}
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
