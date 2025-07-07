
'use client';

import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Shield, Lock } from 'lucide-react';

const securityFeatures = [
    "End-to-End Encryption",
    "Biometric Authentication",
    "Data Privacy Controls",
];

export default function WelcomeSecurityMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    // Clone first item to the end for seamless transition
    const featuresToLoop = [...securityFeatures, securityFeatures[0]]; 

    useEffect(() => {
        if (!isActive) {
            setCurrentIndex(0);
            return;
        }

        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => prevIndex + 1);
        }, 2500);

        return () => clearInterval(interval);
    }, [isActive]);

    // Effect to handle the loop reset
    useEffect(() => {
        // When the index goes to the last (cloned) item
        if (currentIndex === featuresToLoop.length -1) {
            // Set a timer to reset the index back to 0.
            // This happens after the transition to the cloned item is complete.
            const timer = setTimeout(() => {
                setCurrentIndex(0);
            }, 2500); // This should be equal to the interval time.
            return () => clearTimeout(timer);
        }
    }, [currentIndex, featuresToLoop.length]);

    return (
        <div className={cn(
            "relative w-full max-w-sm h-[400px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-4 backdrop-blur-sm overflow-hidden flex flex-col justify-center items-center text-center gap-6",
            "transition-opacity duration-700 ease-in-out",
            isActive ? "opacity-100" : "opacity-40",
            className
        )}>
             <div className="relative w-48 h-48 flex items-center justify-center">
                {/* 1. Background Glow */}
                <div className="absolute w-full h-full bg-primary/10 rounded-full blur-2xl" />

                {/* 2. Shield Stroke Outline */}
                <Shield 
                    className="absolute w-[90%] h-[90%] text-primary" 
                    strokeWidth={3}
                    fill="none" 
                />
                
                {/* 3. Inner Circle */}
                <div className="absolute w-[60%] h-[60%] bg-background/20 rounded-full backdrop-blur-sm" />

                {/* 4. Inner Lock Icon */}
                <Lock className="w-1/3 h-1/3 text-white relative" strokeWidth={3} />
            </div>
            
            <div className="relative h-7 w-full overflow-hidden text-center">
                <div
                    className={cn(
                        "ease-in-out",
                        // When at index 0, there is no transition as it was just snapped back.
                        // For all others, apply the transition.
                        currentIndex === 0 ? 'transition-none' : 'transition-transform duration-700'
                    )}
                    style={{ transform: `translateY(-${currentIndex * 1.75}rem)` }}
                >
                    {featuresToLoop.map((feature, index) => (
                        <p
                            key={`${feature}-${index}`}
                            className="h-7 flex items-center justify-center text-lg font-semibold text-foreground"
                        >
                            {feature}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    )
}
