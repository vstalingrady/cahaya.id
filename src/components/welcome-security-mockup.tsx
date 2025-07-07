
'use client';

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import React from 'react';

const securityFeatures = [
    "256-bit AES Encryption",
    "Biometric Authentication",
    "OJK Licensed Partner API",
    "Your Privacy is Our Priority",
];

/**
 * A self-contained, animated shield component to signify security.
 * It features a pulsating glow and a moving gradient on the stroke.
 *
 * How it works:
 * 1.  SVG Paths: Defines the shapes for the shield and the inner padlock.
 * 2.  CSS Animation (`@keyframes`): Creates the "pulsating energy" effect by
 *     animating the `transform: scale` and `filter: drop-shadow` properties.
 * 3.  SVG Animation (SMIL): Creates the moving gradient stroke. A <linearGradient>
 *     is defined and its position is animated over time using <animate> tags,
 *     which is a robust, native way to animate SVG properties.
 * 4.  Layering: The SVG elements are layered correctly: the pulsating fill is at the
 *     bottom, the animated stroke is on top of it, and the padlock icon is at the very top.
 */
const ShieldAnimation: React.FC = () => {
    // A standard heater shield path. ViewBox: 0 0 100 120
    const shieldPath = "M 50,5 L 95,35 V 75 C 95,105 50,115 50,115 C 50,115 5,105 5,75 V 35 L 50,5 Z";
    
    // A path for a padlock icon, designed to be centered within the shield.
    const padlockPath = "M 60 55 V 47 C 60 40.37 55.52 35 50 35 C 44.48 35 40 40.37 40 47 V 55 M 38 55 H 62 V 75 H 38 V 55 Z";

    // All necessary styles and animations are encapsulated here.
    const styles = `
        /* The group containing the shield fill, which will pulse */
        .shield-pulse-group {
            /* The animation property applies our keyframes */
            animation: pulse 3s infinite ease-in-out;
            /* Set the origin for scaling to the center of the shield */
            transform-origin: 50% 60%;
        }
        
        .shield-fill {
            fill: hsla(var(--primary), 0.25);
        }

        .padlock-icon {
            stroke: hsl(var(--destructive-foreground)); /* Safest white color from theme */
            stroke-width: 4;
            stroke-linecap: round;
            stroke-linejoin: round;
            fill: none;
        }

        .shield-stroke {
            fill: none;
            stroke: url(#shield-stroke-gradient);
            stroke-width: 2.5;
        }
        
        /* Keyframes for the pulsating glow effect */
        @keyframes pulse {
            0% {
                transform: scale(0.95);
                filter: drop-shadow(0 0 4px hsla(var(--primary), 0.7));
            }
            70% {
                transform: scale(1.03);
                filter: drop-shadow(0 0 15px hsla(var(--primary), 0.7));
            }
            100% {
                transform: scale(0.95);
                filter: drop-shadow(0 0 4px hsla(var(--primary), 0.7));
            }
        }
    `;

    return (
        <>
            {/* The <style> tag ensures the component is self-contained */}
            <style>{styles}</style>
            
            {/* 
              The main SVG element. It's recommended to wrap this component
              in a div and set the width/height on that div.
            */}
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 120"
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: 'visible' }} // Allows the glow (drop-shadow) to render outside the SVG's boundaries
            >
                <defs>
                    {/* 
                      This gradient definition creates a seamless loop for the stroke animation.
                      The gradient is twice the width (x2="200%") and transitions from orange -> gold -> orange.
                      We then animate the x-coordinates (x1, x2) to slide the gradient, creating a moving shine.
                    */}
                    <linearGradient id="shield-stroke-gradient" x1="0%" y1="0%" x2="200%" y2="0%">
                        <stop offset="0%"   stopColor="hsl(var(--accent))" />
                        <stop offset="50%"  stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" />
                        <animate attributeName="x1" from="0%" to="-200%" dur="2.5s" repeatCount="indefinite" />
                        <animate attributeName="x2" from="200%" to="0%" dur="2.5s" repeatCount="indefinite" />
                    </linearGradient>
                </defs>

                {/* Layer 1: Group for the pulsating fill. The CSS animation is applied here. */}
                <g className="shield-pulse-group">
                    <path className="shield-fill" d={shieldPath} />
                </g>
                
                {/* Layer 2: The animated gradient stroke, drawn on top of the fill */}
                <path
                    className="shield-stroke"
                    d={shieldPath}
                />
                
                {/* Layer 3: The static padlock icon, drawn on top of everything else */}
                <path
                    className="padlock-icon"
                    d={padlockPath}
                />
            </svg>
        </>
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
        }, 2500); // Change text every 2.5 seconds
        return () => clearInterval(timer);
    }, [isActive]);

    return (
        <div className={cn(
            "relative w-full max-w-sm h-[400px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-4 backdrop-blur-sm overflow-hidden flex flex-col justify-center items-center text-center gap-4",
            className
        )}>
            <div className={cn(
                "relative flex items-center justify-center w-80 h-80 transition-opacity duration-1000",
                isActive ? 'opacity-100' : 'opacity-0'
            )}>
                 <ShieldAnimation />
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
