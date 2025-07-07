
'use client';

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Shield, Lock } from "lucide-react";

const securityFeatures = [
    "256-bit AES Encryption",
    "Biometric Authentication",
    "OJK Licensed Partner API",
    "Your Privacy is Our Priority",
];

export default function WelcomeSecurityMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    const [featureIndex, setFeatureIndex] = useState(0);

    useEffect(() => {
        if (!isActive) {
            setFeatureIndex(0);
            return;
        }
        const timer = setInterval(() => {
            setFeatureIndex(prev => (prev + 1) % securityFeatures.length);
        }, 2500); // Change text every 2.5 seconds
        return () => clearInterval(timer);
    }, [isActive]);

    return (
        <div className={cn(
            "relative w-full max-w-sm h-[400px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-4 backdrop-blur-sm overflow-hidden flex flex-col justify-center items-center text-center gap-4",
            className
        )}>
            <div className={cn(
                "relative flex items-center justify-center w-64 h-64 transition-opacity duration-1000",
                isActive ? 'opacity-100' : 'opacity-0'
            )}>
                 {/* Big blurry background glow in the shape of a shield */}
                 <Shield
                    className="absolute w-full h-full text-primary blur-3xl opacity-60"
                    fill="currentColor"
                 />
                 {/* Smaller, sharp shield icon in the center */}
                 <div className="relative animate-slow-pulse">
                     <Shield
                        className="w-32 h-32 text-primary"
                        fill="currentColor"
                    />
                    <Lock
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 text-background"
                        strokeWidth={2}
                    />
                </div>
            </div>

            {/* The text ticker animation */}
            <div className="relative h-6 w-full overflow-hidden mt-4">
                <div 
                    className="transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateY(-${featureIndex * 1.5}rem)` }}
                >
                    {securityFeatures.map((feature) => (
                        <p key={feature} className="h-6 text-foreground font-semibold flex items-center justify-center">
                            {feature}
                        </p>
                    ))}
                    {/* Add the first item again at the end for a seamless loop */}
                    <p className="h-6 text-foreground font-semibold flex items-center justify-center">
                        {securityFeatures[0]}
                    </p>
                </div>
            </div>
        </div>
    )
}
