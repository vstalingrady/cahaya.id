
'use client';

import { cn } from "@/lib/utils";
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
            {/* The main animated graphic using a custom inline SVG */}
            <div className={cn(
                "relative flex items-center justify-center w-48 h-48",
                isActive ? 'opacity-100' : 'opacity-0',
                "transition-opacity duration-1000"
            )}>
                 <svg
                    viewBox="0 0 24 24"
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* This SVG filter creates the glow effect */}
                        <filter id="shield-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
                             <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                        </filter>
                    </defs>

                    {/* Layer 1: The Glow. This path is blurred by the filter. */}
                    <path
                        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                        className="text-primary animate-glow-fade"
                        fill="currentColor"
                        filter="url(#shield-glow-filter)"
                    />
                    
                    {/* Layer 2: The sharp, breathing Shield & Lock on top */}
                    <g className="animate-slow-pulse">
                        <path
                            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                            fill="hsl(var(--primary))"
                        />
                        <path
                            d="M14 10.5v-1a2 2 0 0 0-4 0v1 M9 11.5h6v4a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-4z"
                            stroke="hsl(var(--background))"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                    </g>
                </svg>
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
