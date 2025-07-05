
'use client';

import { Plus, Repeat, Link2, Trash2 } from "lucide-react";
import Image from "next/image";
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

// Mock data that matches your target design
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
    isShared: false,
    members: []
  },
  {
    id: 2,
    name: "Bali Holiday",
    icon: "Holiday",
    currentAmount: 3200000,
    targetAmount: 15000000,
    autoSaveEnabled: false,
    roundUpEnabled: false,
    isShared: false,
    members: []
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
    isShared: false,
    members: []
  },
  {
    id: 4,
    name: "Honeymoon Fund",
    icon: "Wedding",
    currentAmount: 7500000,
    targetAmount: 75000000,
    autoSaveEnabled: false,
    roundUpEnabled: false,
    isShared: true,
    members: [
      { id: 1, name: "You", avatarUrl: "https://placehold.co/32x32.png" },
      { id: 2, name: "Partner", avatarUrl: "https://placehold.co/32x32.png" }
    ]
  }
];

export default function WelcomeVaultsMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    return (
        <div className={cn(
            "relative w-full max-w-sm h-[500px] rounded-2xl border border-gray-700 shadow-2xl bg-gray-900 text-white overflow-hidden",
            className
        )}>
            {/* Header */}
            <div className="p-6 pb-4 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-1">Cuan Vaults</h2>
                <p className="text-gray-400 text-sm">Save for all your goals, together.</p>
            </div>

            {/* Vaults List */}
            <div className="p-4 space-y-3 h-[calc(100%-120px)] overflow-y-auto custom-scrollbar">
                {vaults.map((vault, index) => (
                    <div key={vault.id} className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 relative group">
                        {/* Delete button */}
                        <button className="absolute top-3 right-3 p-1 rounded-full bg-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>

                        {/* Vault info */}
                        <div className="flex items-start gap-3 mb-3">
                            <div className="text-2xl">{icons[vault.icon] || '💰'}</div>
                            <div className="flex-1">
                                <p className="font-semibold text-base text-white mb-1">{vault.name}</p>
                                <p className="text-sm">
                                    <span className="text-white font-semibold">{formatCurrency(vault.currentAmount)}</span>
                                    <span className="text-gray-400 ml-1">of {formatCurrency(vault.targetAmount)}</span>
                                </p>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-3">
                            <Progress 
                                value={(vault.currentAmount / vault.targetAmount) * 100} 
                                className="h-2 bg-gray-700 [&>div]:bg-primary"
                            />
                        </div>

                        {/* Auto-save and round-up indicators */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
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

                            {/* Shared vault members */}
                            {vault.isShared && vault.members && vault.members.length > 0 && (
                                <TooltipProvider>
                                    <div className="flex -space-x-2 items-center">
                                        {vault.members.slice(0, 2).map(member => (
                                            <Tooltip key={member.id}>
                                                <TooltipTrigger asChild>
                                                    <div className="w-8 h-8 border-2 border-gray-800 rounded-full bg-gray-600 flex items-center justify-center text-xs font-medium text-white">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{member.name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ))}
                                        <div className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-purple-600 border-2 border-gray-800 rounded-full">
                                            +{vault.members.length}
                                        </div>
                                    </div>
                                </TooltipProvider>
                            )}
                        </div>
                    </div>
                ))}

                {/* Create New Vault Button */}
                <div className="w-full bg-gray-800/30 p-4 rounded-xl flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/50 transition-all cursor-pointer group">
                    <Plus className="w-5 h-5 mr-2 transition-colors group-hover:text-white" />
                    <span className="font-medium text-sm transition-colors group-hover:text-white">Create New Vault</span>
                </div>
            </div>
        </div>
    );
}
