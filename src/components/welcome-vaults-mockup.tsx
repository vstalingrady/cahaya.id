'use client';

import { Plus, Repeat, Trash2, Link2 } from "lucide-react";
import React, { useState, useEffect, useRef } from 'react';
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

// Extend the Vault type for our animation state
type DisplayVault = Vault & { isNew?: boolean, animatedAmount?: number };

export default function WelcomeVaultsMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    const [displayVaults, setDisplayVaults] = useState<DisplayVault[]>(initialVaults);
    const [createButtonState, setCreateButtonState] = useState<'default' | 'active'>('default');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive) {
            // Reset to initial state when the slide is not active
            setDisplayVaults(initialVaults);
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0;
            }
            return;
        }

        const timeouts: NodeJS.Timeout[] = [];
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const animationSequence = () => {
            // 1. Scroll to bottom
            timeouts.push(setTimeout(() => {
                scrollContainer.scrollTo({
                    top: scrollContainer.scrollHeight,
                    behavior: 'smooth'
                });
            }, 1000));

            // 2. "Press" the create button
            timeouts.push(setTimeout(() => {
                setCreateButtonState('active');
            }, 2500));

            // 3. Add the new vault
            timeouts.push(setTimeout(() => {
                const newVault: DisplayVault = {
                    id: 'vault-new',
                    name: 'European Tour',
                    icon: 'Holiday',
                    currentAmount: 5000000,
                    targetAmount: 80000000,
                    sourceAccountIds: [],
                    destinationAccountId: '',
                    isNew: true,
                    animatedAmount: 0,
                    roundUpEnabled: true,
                };
                setDisplayVaults(prevVaults => [...prevVaults, newVault]);
                setCreateButtonState('default');
            }, 2800));
            
            // 4. Scroll new vault into view and animate progress
            timeouts.push(setTimeout(() => {
                const newVaultElement = scrollContainer.querySelector<HTMLElement>('#vault-new');
                if (newVaultElement) {
                     newVaultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                // Animate the progress bar fill
                setDisplayVaults(prev => prev.map(v => v.id === 'vault-new' ? {...v, animatedAmount: v.currentAmount} : v));
            }, 3000));
            
            // 5. Reset for the next loop
            timeouts.push(setTimeout(() => {
                 // Fade out the new vault before removing
                 setDisplayVaults(prev => prev.map(v => v.id === 'vault-new' ? {...v, isNew: false} : v));
            }, 6000));

            timeouts.push(setTimeout(() => {
                setDisplayVaults(initialVaults);
                scrollContainer.scrollTo({ top: 0, behavior: 'auto' });
                animationSequence(); // Loop the animation
            }, 6500));
        };
        
        animationSequence();

        return () => {
            timeouts.forEach(clearTimeout);
        };
    }, [isActive]);

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
            <div ref={scrollContainerRef} className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-4 pointer-events-none">
                {displayVaults.map(vault => {
                    const progress = (vault.animatedAmount ?? vault.currentAmount) / vault.targetAmount * 100;
                    return (
                        <div 
                            key={vault.id} 
                            id={vault.id}
                            className={cn(
                                "block bg-card p-4 rounded-2xl border border-border transition-all duration-500",
                                vault.isNew === true && 'opacity-0 translate-y-4',
                                vault.isNew === false && 'opacity-0 -translate-y-4' // for fade out
                            )}
                            ref={el => {
                                // Trigger fade-in for new vault
                                if (el && vault.isNew) {
                                    setTimeout(() => el.classList.remove('opacity-0', 'translate-y-4'), 50);
                                }
                            }}
                        >
                             <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3">
                                    <div className="text-2xl mt-1">{icons[vault.icon] || '💰'}</div>
                                    <div>
                                        <p className="font-semibold text-lg text-white">{vault.name}</p>
                                        <p className="text-sm">
                                            <span className="text-white font-semibold">{formatCurrency(vault.animatedAmount ?? vault.currentAmount)}</span>
                                            <span className="font-normal text-muted-foreground"> of {formatCurrency(vault.targetAmount)}</span>
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            
                            <div className="mb-3">
                                <Progress value={progress} className="h-2 bg-secondary [&>div]:bg-primary [&>div]:transition-all [&>div]:duration-1000 [&>div]:ease-out" />
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
                    )
                })}
                <div 
                    className={cn(
                        "w-full bg-card p-5 rounded-2xl flex items-center justify-center text-muted-foreground border-2 border-dashed border-border transition-all duration-200",
                        createButtonState === 'active' && 'border-primary/80 bg-primary/20 text-primary'
                    )}>
                    <Plus className="w-6 h-6 mr-3" />
                    <span className="font-semibold">Create New Vault</span>
                </div>
            </div>
        </div>
    );
}
