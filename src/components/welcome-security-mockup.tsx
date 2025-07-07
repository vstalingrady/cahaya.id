
'use client';

import { cn } from "@/lib/utils";
import { Lock, Fingerprint } from "lucide-react";
import { useEffect, useState } from "react";

const BiometricsAnimation = ({ isActive }: { isActive?: boolean }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
             <Fingerprint className={cn("w-72 h-72 text-primary/10 transition-opacity duration-500", isActive ? 'opacity-100' : 'opacity-0')} />
             <div className={cn(
                "absolute w-64 h-1 bg-accent rounded-full shadow-[0_0_15px_2px] shadow-accent/70 transition-opacity",
                isActive ? "animate-biometric-scan" : "opacity-0"
             )}/>
        </div>
    );
};


export default function WelcomeSecurityMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    const [featureIndex, setFeatureIndex] = useState(0);

    const securityFeatures = [
        "Biometric Authentication",
        "256-bit AES Encryption",
        "OJK Licensed Partner API",
        "Your Privacy is Our Priority"
    ];

    useEffect(() => {
        if (!isActive) {
            setFeatureIndex(0);
            return;
        }

        const timer = setInterval(() => {
            setFeatureIndex(prev => (prev + 1) % securityFeatures.length);
        }, 2000);
        
        return () => clearInterval(timer);
    }, [isActive]);

    return (
        <div className={cn(
            "relative w-full max-w-sm h-[500px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-6 backdrop-blur-sm overflow-hidden flex flex-col justify-center items-center",
            className
        )}>

            <BiometricsAnimation isActive={isActive} />

            <div className="relative z-10 flex items-center justify-center">
                <div className="w-24 h-24 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center animate-slow-pulse shadow-lg">
                    <Lock className="w-12 h-12 text-primary" />
                </div>
            </div>

            <div className="relative h-6 w-full overflow-hidden mt-auto">
                 {securityFeatures.map((feature, index) => (
                    <p 
                        key={feature}
                        className={cn(
                            "absolute w-full text-center text-foreground font-semibold transition-all duration-500",
                            index === featureIndex ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5',
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
