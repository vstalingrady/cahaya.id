
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

const HexScramble = ({ isActive, lines = 8 }: { isActive: boolean; lines?: number }) => {
    const [hexStrings, setHexStrings] = useState<string[]>([]);
    
    useEffect(() => {
        if (!isActive) {
            setHexStrings([]);
            return;
        }

        const generateHexString = () => Array(24).fill(0).map(() => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join('');

        const intervalId = setInterval(() => {
            setHexStrings(Array.from({ length: lines }, generateHexString));
        }, 100);

        setHexStrings(Array.from({ length: lines }, generateHexString));

        return () => clearInterval(intervalId);
    }, [isActive, lines]);

    return (
        <div className="font-mono text-sm text-primary/70 leading-relaxed select-none text-center break-all">
            {hexStrings.map((hex, i) => (
                <p key={i}>{hex}</p>
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
            "relative w-full max-w-sm h-full rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-6 backdrop-blur-sm overflow-hidden flex flex-col justify-center items-center",
            className
        )}>

            <div className="relative w-full h-72 flex items-center justify-center">
                {/* Hex scramble in the background, slightly blurred for depth */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden blur-[1px] opacity-80">
                    <HexScramble isActive={isActive} lines={8} />
                </div>

                {/* Shield and lock icon on top */}
                <div className="relative z-10 flex items-center justify-center">
                    <ShieldCheck className="w-48 h-48 text-primary/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center animate-slow-pulse">
                            <Lock className="w-12 h-12 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative h-6 w-full overflow-hidden mb-8">
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
