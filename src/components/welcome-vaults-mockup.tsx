'use client';

import { Repeat, Link2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Helper function for currency formatting
const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
}).format(value);

// Custom SVG Icons to match the design
const SirenIcon = () => (
    <div className="w-10 h-10 flex items-center justify-center bg-secondary rounded-lg">
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 36.9922H37" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 42.9922H34" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M24 37V22" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M24 22C30.0751 22 35 17.0751 35 11C35 4.92487 30.0751 0 24 0C17.9249 0 13 4.92487 13 11C13 17.0751 17.9249 22 24 22Z" fill="#F87171"/>
            <path d="M24 16L24 5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M30 11L25 11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 11L22 11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </div>
);

const AirplaneIcon = () => (
    <div className="w-10 h-10 flex items-center justify-center bg-secondary rounded-lg">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.6569 6.34315L19.0711 4.92893C19.8521 4.14788 21 4.70956 21 5.65685V10.2764M17.6569 6.34315L11.0858 12.9142C10.6953 13.3047 10.0621 13.3047 9.67157 12.9142L6.84315 10.0858C6.45262 9.69526 6.45262 9.0621 6.84315 8.67157L13.4142 2.10051C14.1953 1.31946 15.4616 1.40176 16.1422 2.27645L17.6569 6.34315Z" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17.6569 6.34315L13.7236 10.2765" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 15.7236L8.67157 10.0858" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </div>
);

const NewPhoneIcon = () => (
    <div className="w-10 h-10 flex items-center justify-center bg-secondary rounded-lg">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="5" width="4" height="4" rx="1" fill="#9CA3AF"/>
            <rect x="5" y="10" width="4" height="4" rx="1" fill="#9CA3AF"/>
            <rect x="5" y="15" width="4" height="4" rx="1" fill="#9CA3AF"/>
            <rect x="10" y="5" width="4" height="4" rx="1" fill="#9CA3AF"/>
            <rect x="10" y="10" width="4" height="4" rx="1" fill="#9CA3AF"/>
            <rect x="10" y="15" width="4" height="4" rx="1" fill="#9CA3AF"/>
            <rect x="15" y="5" width="4" height="4" rx="1" fill="#9CA3AF"/>
            <rect x="15" y="10" width="4" height="4" rx="1" fill="#9CA3AF"/>
            <rect x="15" y="15" width="4" height="4" rx="1" fill="#9CA3AF"/>
        </svg>
    </div>
);

// Mock data structure
const vaultsData = [
  {
    name: "Emergency Fund",
    icon: <SirenIcon />,
    currentAmount: 2000000,
    targetAmount: 50000000,
    features: [
      { text: "Auto-saving Rp 250.000 / weekly", icon: <Repeat className="w-3 h-3" /> },
      { text: "Round-up savings active", icon: <Link2 className="w-3 h-3" /> },
    ],
  },
  {
    name: "Bali Holiday",
    icon: <AirplaneIcon />,
    currentAmount: 3200000,
    targetAmount: 15000000,
    features: [],
  },
];

export default function WelcomeVaultsMockup({ className }: { className?: string }) {
    return (
        <div className={cn(
            "relative w-full max-w-sm h-[500px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-background text-white p-6 flex flex-col gap-4 pointer-events-none",
            className
        )}>
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-1 font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Cuan Vaults
                </h2>
                <p className="text-muted-foreground text-sm">Save for all your goals, together.</p>
            </div>

            {/* Vaults List */}
            <div className="space-y-4 flex-1">
                {vaultsData.map((vault) => (
                    <div key={vault.name} className="bg-card p-4 rounded-xl border border-border">
                        <div className="flex items-center gap-4 mb-3">
                            {vault.icon}
                            <div className="flex-1">
                                <p className="font-semibold text-white">{vault.name}</p>
                                <p className="text-sm">
                                    <span className="font-semibold text-white">{formatCurrency(vault.currentAmount)}</span>
                                    <span className="text-muted-foreground"> of {formatCurrency(vault.targetAmount)}</span>
                                </p>
                            </div>
                        </div>

                        <Progress 
                            value={(vault.currentAmount / vault.targetAmount) * 100} 
                            className="h-1 bg-secondary [&>div]:bg-primary"
                        />

                        {vault.features.length > 0 && (
                            <div className="mt-3 space-y-1.5">
                                {vault.features.map(feature => (
                                    <div key={feature.text} className="flex items-center gap-2 text-xs text-green-400 font-medium">
                                        {feature.icon}
                                        <span>{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* New Phone special card */}
                 <div className="bg-card p-4 rounded-xl border border-border flex items-center gap-4">
                    <NewPhoneIcon />
                    <p className="font-semibold text-white">New Phone</p>
                </div>
            </div>
        </div>
    );
}
