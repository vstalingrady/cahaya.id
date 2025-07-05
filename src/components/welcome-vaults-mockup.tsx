
'use client';

import { cn } from "@/lib/utils";
import { PiggyBank, Target } from "lucide-react";

export default function WelcomeVaultsMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    const holidayProgress = isActive ? 68 : 0;
    const laptopProgress = isActive ? 45 : 0;

    return (
        <div className={cn(
            "relative w-full max-w-sm h-[400px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-4 backdrop-blur-sm overflow-hidden flex flex-col justify-center gap-4",
            className
        )}>
            {/* Holiday Fund Card */}
            <div className={cn(
                "bg-secondary/50 rounded-xl p-4 border border-border transition-all duration-500", 
                isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-foreground font-medium">Holiday Fund</p>
                        <p className="text-sm text-muted-foreground">Rp 15,000,000 goal</p>
                    </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                        className="bg-gradient-to-r from-primary to-accent h-2.5 rounded-full transition-all duration-1000 ease-out delay-300" 
                        style={{ width: `${holidayProgress}%` }}
                    />
                </div>
                <p className={cn(
                    "text-sm text-muted-foreground mt-2 transition-opacity duration-500 delay-500",
                    isActive ? 'opacity-100' : 'opacity-0'
                )}>Rp 10,200,000 saved ({holidayProgress.toFixed(0)}%)</p>
            </div>

            {/* New Laptop Card */}
            <div className={cn(
                "bg-secondary/50 rounded-xl p-4 border border-border transition-all duration-500 delay-150", 
                isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                        <PiggyBank className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-foreground font-medium">New Laptop</p>
                        <p className="text-sm text-muted-foreground">Rp 20,000,000 goal</p>
                    </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                        className="bg-gradient-to-r from-accent to-red-500 h-2.5 rounded-full transition-all duration-1000 ease-out delay-300" 
                        style={{ width: `${laptopProgress}%` }}
                    />
                </div>
                <p className={cn(
                    "text-sm text-muted-foreground mt-2 transition-opacity duration-500 delay-500",
                     isActive ? 'opacity-100' : 'opacity-0'
                )}>Rp 9,000,000 saved ({laptopProgress.toFixed(0)}%)</p>
            </div>
        </div>
    )
}
