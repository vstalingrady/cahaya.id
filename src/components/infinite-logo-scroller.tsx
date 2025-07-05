'use client';

import Image from 'next/image';
import { type FinancialInstitution } from '@/lib/data';
import { cn } from '@/lib/utils';
import React from 'react';

interface InfiniteLogoScrollerProps {
  institutions: FinancialInstitution[];
  speed?: 'fast' | 'normal' | 'slow';
  direction?: 'forward' | 'reverse';
  className?: string;
}

export default function InfiniteLogoScroller({
  institutions,
  speed = 'normal',
  direction = 'forward',
  className,
}: InfiniteLogoScrollerProps) {
  return (
    <div
      className={cn("scroller w-full overflow-hidden", className)}
      style={
        {
          "--animation-duration":
            speed === "fast" ? "20s" : speed === "slow" ? "80s" : "40s",
          "--animation-direction": direction === "reverse" ? "reverse" : "normal",
        } as React.CSSProperties
      }
    >
      {/* The animate-scroll class now triggers the JSX style animation */}
      <div className="scroller-inner flex flex-nowrap gap-4 py-1 animate-scroll">
        {/* Render the first set of logos */}
        {institutions.map((inst, index) => (
          <div key={`logo-${inst.id}-${index}`} className="flex-shrink-0 w-24 h-24 bg-card/80 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4 border border-border shadow-md transition-all duration-300 hover:shadow-primary/20 hover:bg-white hover:scale-105">
            <Image
              src={inst.logoUrl}
              alt={inst.name}
              width={80}
              height={80}
              className="object-contain h-full w-auto"
              data-ai-hint={`${inst.name} logo`}
            />
          </div>
        ))}
        {/* Render the second set of logos for the seamless loop */}
        {institutions.map((inst, index) => (
          <div key={`logo-clone-${inst.id}-${index}`} aria-hidden="true" className="flex-shrink-0 w-24 h-24 bg-card/80 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4 border border-border shadow-md transition-all duration-300 hover:shadow-primary/20 hover:bg-white hover:scale-105">
            <Image
              src={inst.logoUrl}
              alt={inst.name}
              width={80}
              height={80}
              className="object-contain h-full w-auto"
              data-ai-hint={`${inst.name} logo`}
            />
          </div>
        ))}
      </div>
      
      {/* 
        This JSX style block defines the animation locally. 
        This can help ensure the animation styles are applied immediately, 
        preventing the "flash of unstyled content" where items wrap before animating.
      */}
      <style jsx>{`
        @keyframes scroll {
          to {
            /* 
              We translate by -50% to move the entire duplicated list.
              We also subtract half of the gap (0.5rem for gap-4) to ensure a seamless transition.
            */
            transform: translateX(calc(-50% - 0.5rem));
          }
        }

        .animate-scroll {
          animation: scroll var(--animation-duration) linear infinite;
          animation-direction: var(--animation-direction);
        }
        
        /* Pause animation on hover */
        .scroller:hover .animate-scroll {
            animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
