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
  // Prepare logo lists for cleaner rendering
  const originalLogos = institutions.map((inst, index) => (
    <div
      key={`logo-${inst.id}-${index}`}
      className="flex-shrink-0 w-24 h-24 bg-card/80 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4 border border-border shadow-md transition-all duration-300 hover:shadow-primary/20 hover:bg-white hover:scale-105"
    >
      <Image
        src={inst.logoUrl}
        alt={inst.name}
        width={80}
        height={80}
        className="object-contain w-full h-full"
        data-ai-hint={`${inst.name} logo`}
      />
    </div>
  ));

  const clonedLogos = institutions.map((inst, index) => (
    <div
      key={`logo-clone-${inst.id}-${index}`}
      aria-hidden="true"
      className="flex-shrink-0 w-24 h-24 bg-card/80 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4 border border-border shadow-md transition-all duration-300 hover:shadow-primary/20 hover:bg-white hover:scale-105"
    >
      <Image
        src={inst.logoUrl}
        alt={inst.name}
        width={80}
        height={80}
        className="object-contain w-full h-full"
        data-ai-hint={`${inst.name} logo`}
      />
    </div>
  ));

  return (
    <div
      className={cn("scroller w-full overflow-hidden", className)}
    >
      <div
        className={cn(
          "scroller-inner flex flex-nowrap gap-4 py-1",
          direction === 'reverse' && 'scroller-inner-reverse'
        )}
        style={
          {
            "--animation-duration":
              speed === "fast" ? "20s" : speed === "slow" ? "80s" : "40s",
            "--animation-direction": direction === "reverse" ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {direction === 'reverse' ? (
          <>
            {clonedLogos}
            {originalLogos}
          </>
        ) : (
          <>
            {originalLogos}
            {clonedLogos}
          </>
        )}
      </div>
      
      <style jsx>{`
        .scroller-inner {
          animation: scroll var(--animation-duration) linear infinite;
          animation-direction: var(--animation-direction);
        }

        .scroller-inner-reverse {
          /* This is the crucial part for the reverse animation.
             It sets the starting position to the halfway point. */
          transform: translateX(-50%);
        }

        .scroller:hover .scroller-inner {
          animation-play-state: paused;
        }

        @keyframes scroll {
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
