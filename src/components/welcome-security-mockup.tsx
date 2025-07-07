'use client';

import { cn } from "@/lib/utils";
import { Shield, Lock } from 'lucide-react';

export default function WelcomeSecurityMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    return (
        <div className={cn(
            "relative w-full max-w-sm h-[400px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-4 backdrop-blur-sm overflow-hidden flex flex-col justify-center items-center text-center gap-4",
            "transition-opacity duration-700 ease-in-out",
            isActive ? "opacity-100" : "opacity-40",
            className
        )}>
             <div className={cn(
                "relative flex items-center justify-center w-48 h-48 transition-transform duration-700 ease-in-out",
                isActive ? "scale-100" : "scale-90"
            )}>
                {/* The soft glow, created by a blurred version of the same icon. This avoids any square artifacts. */}
                <Shield
                    className="absolute w-full h-full text-primary/30 blur-xl"
                    fill="currentColor"
                    strokeWidth={0}
                />
                
                {/* The main solid shield icon */}
                <Shield
                    className="relative w-full h-full text-primary"
                    fill="currentColor"
                    strokeWidth={0}
                />
                
                {/* The white lock icon on top */}
                <Lock
                    className="absolute w-1/2 h-1/2 text-white"
                    strokeWidth={1.5}
                />
            </div>
            
            <p className="text-lg font-semibold text-foreground mt-4">
                Biometric Authentication
            </p>
        </div>
    )
}
