
'use client';

import { cn } from "@/lib/utils";
import { ClipboardList, Car } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function WelcomeBudgetsMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    const foodProgress = isActive ? 110 : 0; // Over budget
    const transportProgress = isActive ? 75 : 0; // On track

    return (
        <div className={cn(
            "relative w-full max-w-sm h-[400px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-4 backdrop-blur-sm overflow-hidden flex flex-col justify-center gap-4",
            className
        )}>
            {/* Food Budget Card */}
            <div className={cn(
                "bg-secondary/50 rounded-xl p-4 border border-border transition-all duration-500",
                isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <ClipboardList className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-foreground font-medium">Monthly Food & Drink</p>
                        <p className="text-sm text-muted-foreground">Rp 5,500,000 / 5,000,000</p>
                    </div>
                </div>
                <Progress 
                    value={foodProgress} 
                    className={cn(
                        "h-2.5 transition-all duration-1000 ease-out delay-300", 
                        foodProgress > 100 && "[&>div]:bg-destructive"
                    )} 
                />
                <p className={cn(
                    "text-sm text-destructive font-semibold mt-2 transition-opacity duration-500 delay-500",
                    isActive ? 'opacity-100' : 'opacity-0'
                )}>Rp 500,000 over budget</p>
            </div>

            {/* Transport Budget Card */}
            <div className={cn(
                "bg-secondary/50 rounded-xl p-4 border border-border transition-all duration-500 delay-150",
                isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                        <Car className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-foreground font-medium">Monthly Transport</p>
                        <p className="text-sm text-muted-foreground">Rp 1,125,000 / 1,500,000</p>
                    </div>
                </div>
                <Progress 
                    value={transportProgress} 
                    className="h-2.5 transition-all duration-1000 ease-out delay-300" 
                />
                <p className={cn(
                    "text-sm text-green-400 font-semibold mt-2 transition-opacity duration-500 delay-500",
                    isActive ? 'opacity-100' : 'opacity-0'
                )}>Rp 375,000 left</p>
            </div>
        </div>
    )
}
