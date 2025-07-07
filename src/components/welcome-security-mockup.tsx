'use client';

import { cn } from "@/lib/utils";
import { Lock, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

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
            {/* The main animated graphic */}
            <div className="relative flex items-center justify-center w-48 h-48">
                {/* Radiating rings for a techy pulse effect */}
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={cn(
                            'absolute w-full h-full rounded-full border-2 border-primary/50',
                            // The animation is only applied when the slide is active
                            isActive ? 'animate-ring-pulse' : 'opacity-0'
                        )}
                        style={{ animationDelay: `${i * 0.8}s` }}
                    />
                ))}

                {/* The static background shield */}
                <ShieldCheck className="w-48 h-48 text-primary/10" />

                {/* The pulsing lock icon in the center */}
                <div className="absolute w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center animate-slow-pulse">
                    <Lock className="w-12 h-12 text-white" />
                </div>
            </div>

            {/* The text ticker animation */}
            <div className="relative h-6 w-full overflow-hidden mt-4">
                <div 
                    className="transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateY(-${featureIndex * 1.5}rem)` }} // 1.5rem = h-6
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
