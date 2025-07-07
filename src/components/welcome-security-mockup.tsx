
'use client';

import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function WelcomeSecurityMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    const [featureIndex, setFeatureIndex] = useState(0);

    const securityFeatures = [
        "Bank-Grade Encryption",
        "Secure Data Handling",
        "Your Privacy is Our Priority",
        "OJK Licensed Partner API"
    ];

    useEffect(() => {
        if (!isActive) {
            setFeatureIndex(0);
            return;
        }

        const timer = setInterval(() => {
            setFeatureIndex(prev => (prev + 1) % securityFeatures.length);
        }, 2500);
        
        return () => clearInterval(timer);
    }, [isActive, securityFeatures.length]);

    return (
        <div className={cn(
            "relative w-full max-w-sm h-[500px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-6 backdrop-blur-sm overflow-hidden flex flex-col justify-center items-center",
            className
        )}>
            
            <div className="relative z-10 flex flex-col items-center justify-center flex-1">
                <ShieldCheck className="w-40 h-40 text-primary animate-slow-pulse" />
            </div>

            <div className="relative h-6 w-full overflow-hidden mt-auto flex-shrink-0">
                 {securityFeatures.map((feature, index) => (
                    <p 
                        key={feature}
                        className={cn(
                            "absolute w-full text-center font-medium text-sm transition-all duration-500",
                            index === featureIndex ? 'opacity-100 translate-y-0 text-foreground' : 'opacity-0 -translate-y-5 text-muted-foreground',
                            index > featureIndex && 'translate-y-5'
                        )}
                    >
                        {feature}
                    </p>
                ))}
            </div>
        </div>
    )
}
