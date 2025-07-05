
'use client';

import { cn } from "@/lib/utils";
import { ClipboardList, Car } from "lucide-react";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
}).format(value);

export default function WelcomeBudgetsMockup({ className }: { className?: string }) {
    const [isAnimating, setIsAnimating] = useState(false);
    
    useEffect(() => {
        // Animate the progress bars once when the component mounts
        const timer = setTimeout(() => setIsAnimating(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const foodProgress = isAnimating ? 110 : 0; // Over budget
    const transportProgress = isAnimating ? 75 : 0; // On track

    return (
        <div className={cn(
            "relative w-full max-w-sm h-[400px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-4 backdrop-blur-sm overflow-hidden flex flex-col justify-center gap-4",
            className
        )}>
            <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <ClipboardList className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-foreground font-medium">Monthly Food & Drink</p>
                        <p className="text-sm text-muted-foreground">Rp 5,500,000 / 5,000,000</p>
                    </div>
                </div>
                <Progress value={foodProgress} className={cn("h-2.5", foodProgress > 100 && "[&>div]:bg-destructive")} />
                <p className="text-sm text-destructive font-semibold mt-2">Rp 500,000 over budget</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                        <Car className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-foreground font-medium">Monthly Transport</p>
                        <p className="text-sm text-muted-foreground">Rp 1,125,000 / 1,500,000</p>
                    </div>
                </div>
                <Progress value={transportProgress} className="h-2.5" />
                <p className="text-sm text-green-400 font-semibold mt-2">Rp 375,000 left</p>
            </div>
        </div>
    )
}
