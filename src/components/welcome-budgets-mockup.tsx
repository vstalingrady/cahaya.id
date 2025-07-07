'use client';

import { cn } from "@/lib/utils";
import { ClipboardList, Car, ShoppingCart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

export default function WelcomeBudgetsMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    const [foodProgress, setFoodProgress] = useState(0);
    const [transportProgress, setTransportProgress] = useState(0);
    const [shoppingProgress, setShoppingProgress] = useState(0);

    useEffect(() => {
        if (isActive) {
            // Trigger animations when the slide is active
            const foodTimer = setTimeout(() => setFoodProgress(110), 300); // 5.5M / 5M
            const shoppingTimer = setTimeout(() => setShoppingProgress(90), 500); // 2.7M / 3M
            const transportTimer = setTimeout(() => setTransportProgress(75), 700); // 1.125M / 1.5M
            return () => {
                clearTimeout(foodTimer);
                clearTimeout(transportTimer);
                clearTimeout(shoppingTimer);
            };
        } else {
            // Reset when slide is not active
            setFoodProgress(0);
            setTransportProgress(0);
            setShoppingProgress(0);
        }
    }, [isActive]);

    const getProgressColor = (progress: number) => {
        if (progress > 100) return '[&>div]:bg-destructive'; // Red if over budget
        if (progress > 85) return '[&>div]:bg-yellow-500'; // Yellow as a warning
        return '[&>div]:bg-primary'; // Default primary color
    }
    
    return (
        <div className={cn(
            "relative w-full max-w-sm h-[450px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-4 backdrop-blur-sm overflow-hidden flex flex-col justify-center gap-4",
            className
        )}>
            {/* Food Budget Card */}
            <div className={cn(
                "bg-secondary/50 rounded-xl p-4 border border-border transition-all duration-500",
                isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/80 rounded-full flex items-center justify-center">
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
                        "h-2.5 transition-all duration-1000 ease-out", 
                        getProgressColor(foodProgress)
                    )} 
                />
                <p className={cn(
                    "text-sm font-semibold mt-2 transition-opacity duration-500 delay-500",
                    isActive ? 'opacity-100' : 'opacity-0',
                    'text-destructive'
                )}>Rp 500,000 over budget</p>
            </div>

            {/* Shopping Budget Card */}
            <div className={cn(
                "bg-secondary/50 rounded-xl p-4 border border-border transition-all duration-500 delay-150",
                isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-foreground font-medium">Monthly Shopping</p>
                        <p className="text-sm text-muted-foreground">Rp 2,700,000 / 3,000,000</p>
                    </div>
                </div>
                <Progress 
                    value={shoppingProgress} 
                    className={cn(
                        "h-2.5 transition-all duration-1000 ease-out",
                        getProgressColor(shoppingProgress)
                    )} 
                />
                <p className={cn(
                    "text-sm font-semibold mt-2 transition-opacity duration-500 delay-500",
                    isActive ? 'opacity-100' : 'opacity-0',
                    'text-yellow-600 dark:text-yellow-500' // Custom color for the warning text
                )}>Rp 300,000 left</p>
            </div>

            {/* Transport Budget Card */}
            <div className={cn(
                "bg-secondary/50 rounded-xl p-4 border border-border transition-all duration-500 delay-300",
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
                    className={cn(
                        "h-2.5 transition-all duration-1000 ease-out",
                        getProgressColor(transportProgress)
                    )}
                />
                <p className={cn(
                    "text-sm text-primary font-semibold mt-2 transition-opacity duration-500 delay-500",
                    isActive ? 'opacity-100' : 'opacity-0'
                )}>Rp 375,000 left</p>
            </div>
        </div>
    )
}
