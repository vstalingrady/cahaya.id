
'use client';

import { cn } from "@/lib/utils";
import { Lock, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

const securityFeatures = [
    "256-bit AES Encryption",
    "Biometric Authentication",
    "OJK Licensed Partner API",
    "Your Privacy is Our Priority"
];

const HexScramble = ({ isActive, count = 8 }: { isActive: boolean, count?: number }) => {
    const [hexStrings, setHexStrings] = useState<string[]>([]);
    
    useEffect(() => {
        if (!isActive) {
            setHexStrings([]); // Clear when not active to save resources
            return;
        }

        const generateHexString = () => Array(32).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');

        const intervalId = setInterval(() => {
            setHexStrings(Array.from({ length: count }, generateHexString));
        }, 100);

        // Initial set to avoid blank screen on activation
        setHexStrings(Array.from({ length: count }, generateHexString));

        return () => clearInterval(intervalId);
    }, [isActive, count]);

    return (
        <div className="absolute inset-0 z-0 flex justify-around items-center overflow-hidden font-mono text-primary/20 text-[10px] [text-orientation:mixed] [writing-mode:vertical-rl] opacity-50">
            {hexStrings.map((hex, i) => (
                <p key={i} className="truncate select-none">{hex}{hex}</p>
            ))}
        </div>
    );
};

export default function WelcomeSecurityMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    const [featureIndex, setFeatureIndex] = useState(0);

    useEffect(() => {
        if (!isActive) {
            setFeatureIndex(0);
            return;
        }

        const timer = setInterval(() => {
            setFeatureIndex(prev => (prev + 1) % securityFeatures.length);
        }, 2000); // Animation speed set to 2 seconds
        
        return () => clearInterval(timer);
    }, [isActive]);

    return (
        <div className={cn(
            "relative w-full max-w-sm rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-4 backdrop-blur-sm overflow-hidden flex flex-col justify-around items-center text-center",
            className
        )}>
            <HexScramble isActive={isActive} />

            <div className="relative z-10 flex flex-col items-center justify-center gap-4">
                <div className="relative flex items-center justify-center">
                    <ShieldCheck className="w-48 h-48 text-primary/10" />
                    <div className="absolute w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center animate-slow-pulse">
                        <Lock className="w-12 h-12 text-white" />
                    </div>
                </div>
            </div>
            
            <div className="relative z-10 h-6 w-full overflow-hidden mt-4">
                 {securityFeatures.map((feature, index) => (
                    <p 
                        key={feature}
                        className={cn(
                            "absolute w-full text-foreground font-semibold transition-all duration-500",
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
