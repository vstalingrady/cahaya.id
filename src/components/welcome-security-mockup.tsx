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

const DECRYPTION_TARGET = "YOUR PRIVACY IS OUR PRIORITY";
const GIBBERISH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+=";

const generateGibberish = (length: number) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += GIBBERISH_CHARS[Math.floor(Math.random() * GIBBERISH_CHARS.length)];
    }
    return result;
};


export default function WelcomeSecurityMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    const [featureIndex, setFeatureIndex] = useState(0);
    const [scrambledTitle, setScrambledTitle] = useState(generateGibberish(DECRYPTION_TARGET.length));

    // Effect for the cycling text at the bottom
    useEffect(() => {
        if (!isActive) {
            setFeatureIndex(0); // Reset when not active
            return;
        };

        const timer = setInterval(() => {
            setFeatureIndex(prev => (prev + 1) % securityFeatures.length);
        }, 2500);
        return () => clearInterval(timer);
    }, [isActive]);
    
    // Effect for the decryption text at the top
    useEffect(() => {
        if (!isActive) {
            setScrambledTitle(generateGibberish(DECRYPTION_TARGET.length));
            return;
        }

        const unrevealedIndices = [...Array(DECRYPTION_TARGET.length).keys()];
        // Initialize with gibberish
        setScrambledTitle(generateGibberish(DECRYPTION_TARGET.length));

        const interval = setInterval(() => {
            if (unrevealedIndices.length === 0) {
                clearInterval(interval);
                // Ensure the final state is perfect, in case of timing issues.
                setScrambledTitle(DECRYPTION_TARGET);
                return;
            }

            const randomIndex = Math.floor(Math.random() * unrevealedIndices.length);
            const indexToReveal = unrevealedIndices.splice(randomIndex, 1)[0];

            setScrambledTitle(prev => {
                const chars = prev.split('');
                chars[indexToReveal] = DECRYPTION_TARGET[indexToReveal];
                return chars.join('');
            });

        }, 80); // Speed of character reveal

        return () => clearInterval(interval);
    }, [isActive]);

    return (
        <div className={cn(
            "relative w-full max-w-sm h-[400px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-4 backdrop-blur-sm overflow-hidden flex flex-col justify-center items-center text-center gap-4",
            className
        )}>
            <p className="h-4 font-mono text-sm tracking-widest text-primary font-semibold">
                {scrambledTitle}
            </p>

            <div className="relative flex items-center justify-center">
                <ShieldCheck className="w-48 h-48 text-primary/10" />
                <div className="absolute w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center animate-slow-pulse">
                    <Lock className="w-12 h-12 text-white" />
                </div>
            </div>

            <div className="relative h-6 w-full overflow-hidden mt-4">
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
