
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

const HexScramble = ({ isActive, lines = 4 }: { isActive: boolean; lines?: number }) => {
    const [hexStrings, setHexStrings] = useState<string[]>([]);
    
    useEffect(() => {
        if (!isActive) {
            setHexStrings([]); // Clear when not active to save resources
            return;
        }

        const generateHexString = () => Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join('');

        const intervalId = setInterval(() => {
            setHexStrings(Array.from({ length: lines }, generateHexString));
        }, 100);

        // Initial set to avoid blank screen on activation
        setHexStrings(Array.from({ length: lines }, generateHexString));

        return () => clearInterval(intervalId);
    }, [isActive, lines]);

    return (
        <div className="font-mono text-primary/80 text-lg leading-relaxed text-center">
            {hexStrings.map((hex, i) => (
                <p key={i} className="truncate select-none">{hex}</p>
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
        }, 2000);
        
        return () => clearInterval(timer);
    }, [isActive]);

    return (
        <div className={cn(
            "relative w-full max-w-sm rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-4 backdrop-blur-sm overflow-hidden flex flex-col justify-between items-center text-center h-[500px]",
            className
        )}>

            <div className="relative z-10 flex flex-col items-center justify-center gap-4 mt-12">
                <div className="relative flex items-center justify-center">
                    <ShieldCheck className="w-48 h-48 text-primary/10" />
                    <div className="absolute w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center animate-slow-pulse">
                        <Lock className="w-16 h-16 text-white" />
                    </div>
                </div>
            </div>
            
            <div className="relative z-10 w-full px-6">
                 <HexScramble isActive={isActive} lines={4} />
            </div>

            <div className="relative z-10 h-6 w-full overflow-hidden mb-12">
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
