'use client';

import { cn } from "@/lib/utils";
import { Lock, ShieldCheck } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const TARGET_MESSAGE = "Your Privacy is Our Priority";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

const generateRandomString = (length: number) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return result;
};


export default function WelcomeSecurityMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    const [decryptedText, setDecryptedText] = useState(generateRandomString(TARGET_MESSAGE.length));

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isActive) {
            let iteration = 0;
            intervalId = setInterval(() => {
                const newText = TARGET_MESSAGE
                    .split("")
                    .map((letter, index) => {
                        if(index < iteration) {
                            return TARGET_MESSAGE[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)]
                    })
                    .join("");
                
                setDecryptedText(newText);

                if(iteration >= TARGET_MESSAGE.length + 5) { // Hold the final message for a bit
                    clearInterval(intervalId);
                }
                
                iteration += TARGET_MESSAGE.length / 45; // Speed of reveal
            }, 40); // Speed of scramble effect

        } else {
            // Reset when not active
            setDecryptedText(generateRandomString(TARGET_MESSAGE.length));
        }

        return () => clearInterval(intervalId);

    }, [isActive]);
    

    return (
        <div className={cn(
            "relative w-full max-w-sm h-[400px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-4 backdrop-blur-sm overflow-hidden flex flex-col justify-center items-center text-center gap-4",
            className
        )}>
            <div className="relative flex items-center justify-center">
                <ShieldCheck className="w-48 h-48 text-primary/10" />
                <div className="absolute w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center animate-slow-pulse">
                    <Lock className="w-12 h-12 text-white" />
                </div>
            </div>

            <div className="relative h-6 w-full overflow-hidden mt-4">
                 <p className="w-full text-foreground font-semibold font-mono tracking-wider">
                    {decryptedText}
                 </p>
            </div>
            
        </div>
    )
}
