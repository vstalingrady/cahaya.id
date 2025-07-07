'use client';

import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Shield, Lock, Circle } from 'lucide-react';

const securityFeatures = [
    "End-to-End Encryption",
    "Biometric Authentication",
    "Data Privacy Controls",
];

export default function WelcomeSecurityMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setCurrentFeatureIndex(prevIndex => (prevIndex + 1) % securityFeatures.length);
        }, 3000); // Change text every 3 seconds

        return () => clearInterval(interval);
    }, [isActive]);

    return (
        <div className={cn(
            "relative w-full max-w-sm h-[400px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-4 backdrop-blur-sm overflow-hidden flex flex-col justify-center items-center text-center gap-6",
            "transition-opacity duration-700 ease-in-out",
            isActive ? "opacity-100" : "opacity-40",
            className
        )}>
            <div className={cn(
                "relative flex items-center justify-center w-48 h-48 transition-transform duration-700 ease-in-out",
                isActive ? "scale-100" : "scale-90"
            )}>
                {/* 1. Background Glow */}
                <Circle
                    strokeWidth={0}
                    fill="currentColor"
                    className="absolute w-full h-full text-primary/10 blur-2xl animate-slow-pulse"
                />
                
                {/* 2. Shield Stroke Outline */}
                <Shield 
                    className="absolute w-full h-full text-primary/60" 
                    strokeWidth={1.5} 
                    fill="none" 
                />
                
                {/* 3. Inner Circle containing the Lock */}
                <div className="relative w-2/3 h-2/3 bg-background/50 rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm">
                    <Lock className="w-1/2 h-1/2 text-primary" strokeWidth={1.5} />
                </div>
            </div>
            
            <div className="relative h-6 w-full overflow-hidden text-center">
                {securityFeatures.map((feature, index) => (
                    <p
                        key={feature}
                        className={cn(
                            "absolute w-full text-lg font-semibold text-foreground transition-opacity duration-500",
                            currentFeatureIndex === index ? 'opacity-100' : 'opacity-0'
                        )}
                    >
                        {feature}
                    </p>
                ))}
            </div>
        </div>
    )
}
