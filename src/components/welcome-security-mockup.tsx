
'use client';

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Shield, Lock } from 'lucide-react';

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
                "relative flex items-center justify-center w-72 h-72 transition-opacity duration-1000",
                isActive ? 'opacity-100' : 'opacity-0'
            )}>
                {/* 1. The circular glow, animated to scale with the shield */}
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-slow-pulse"></div>

                {/* 2. The main shield icon, now solid */}
                <Shield
                    className="w-48 h-48 text-primary animate-slow-pulse"
                    strokeWidth={1.5}
                    fill="hsl(var(--primary))"
                 />
                
                {/* 3. The lock icon, centered on top with a contrasting color */}
                 <Lock
                    className="absolute w-20 h-20 text-white animate-slow-pulse"
                    strokeWidth={1.5}
                 />
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
