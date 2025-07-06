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
      className={cn("scroller w-full overflow-hidden -mx-6 sm:-mx-8 md:-mx-12 lg:-mx-16", className)}
    >
      <div
        className="scroller-inner flex flex-nowrap gap-4 py-1 px-6 sm:px-8 md:px-12 lg:px-16"
        data-direction={direction}
        style={
          {
            "--animation-duration":
              speed === "fast" ? "20s" : speed === "slow" ? "80s" : "40s",
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
          animation-duration: var(--animation-duration);
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .scroller-inner[data-direction="forward"] {
          animation-name: scroll-left;
        }

        .scroller-inner[data-direction="reverse"] {
          animation-name: scroll-right;
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
