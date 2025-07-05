
'use client';

import { Plus, Repeat, Link2 } from "lucide-react";
import Image from "next/image";
import { vaults as allVaults } from '@/lib/data';
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

// Use all vaults for a complete mockup
const vaults = allVaults;

export default function WelcomeVaultsMockup({ className }: { className?: string }) {
    return (
        <div className={cn(
            "relative w-full max-w-sm h-[400px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-4 backdrop-blur-sm overflow-hidden",
            className
        )}>
            <div className="w-full h-full space-y-3 overflow-y-auto custom-scrollbar pr-2 -mr-2">
                {vaults.map(vault => (
                    <div key={vault.id} className="block bg-card/90 backdrop-blur-sm p-4 rounded-xl border border-border/50 group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">{icons[vault.icon] || '💰'}</div>
                                <div>
                                    <p className="font-semibold text-base text-white">{vault.name}</p>
                                    <p className="text-sm text-white font-semibold">{formatCurrency(vault.currentAmount)} <span className="font-normal text-muted-foreground">of {formatCurrency(vault.targetAmount)}</span></p>
                                </div>
                            </div>
                        </div>
                        <Progress value={(vault.currentAmount / vault.targetAmount) * 100} className="h-2 bg-secondary [&>div]:bg-primary" />
                        <div className="flex items-center justify-between mt-3 min-h-[28px]">
                             <div className="text-xs text-muted-foreground space-y-1">
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
                            {vault.isShared && vault.members && (
                                 <TooltipProvider>
                                    <div className="flex -space-x-3 rtl:space-x-reverse items-center">
                                        {vault.members.map(member => (
                                             <Tooltip key={member.id}>
                                                <TooltipTrigger asChild>
                                                    <Image 
                                                        className="w-8 h-8 border-2 border-card rounded-full" 
                                                        src={member.avatarUrl} 
                                                        alt={member.name}
                                                        width={32}
                                                        height={32}
                                                        data-ai-hint="person avatar"
                                                     />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{member.name}</p>
                                                </TooltipContent>
                                             </Tooltip>
                                        ))}
                                        <div className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-primary border-2 border-card rounded-full">
                                            +{vault.members.length}
                                        </div>
                                    </div>
                                 </TooltipProvider>
                            )}
                        </div>
                    </div>
                ))}
                 <div className="w-full bg-card/60 p-4 rounded-xl flex items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 group">
                    <Plus className="w-5 h-5 mr-2 transition-colors" />
                    <span className="font-semibold text-sm transition-colors">Create New Vault</span>
                </div>
            </div>
        </div>
    );
}
