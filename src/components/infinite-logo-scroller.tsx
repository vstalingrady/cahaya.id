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
      data-speed={speed}
      data-direction={direction}
    >
      <div className="scroller-inner flex flex-nowrap gap-4 py-1">
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
        .scroller[data-direction="forward"] .scroller-inner {
          animation: scroll-left linear infinite;
        }

        .scroller[data-direction="reverse"] .scroller-inner {
          animation: scroll-right linear infinite;
        }
        
        .scroller[data-speed="fast"] .scroller-inner {
            animation-duration: 20s;
        }
        .scroller[data-speed="normal"] .scroller-inner {
            animation-duration: 40s;
        }
        .scroller[data-speed="slow"] .scroller-inner {
            animation-duration: 80s;
        }

        .scroller:hover .scroller-inner {
          animation-play-state: paused;
        }

        @keyframes scroll-left {
          from { transform: translateX(0%); }
          to { transform: translateX(-50%); }
        }

        @keyframes scroll-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
}
