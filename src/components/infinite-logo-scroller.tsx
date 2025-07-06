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

  const getAnimationDelay = () => {
    if (direction !== 'reverse') return '0s';
    switch (speed) {
      case 'fast':
        return '-10s';
      case 'slow':
        return '-40s';
      default:
        return '-20s';
    }
  };

  return (
    <div
      className={cn("scroller w-full overflow-hidden", className)}
    >
      <div
        className="scroller-inner"
        data-direction={direction}
        style={
          {
            "--animation-duration":
              speed === "fast" ? "20s" : speed === "slow" ? "80s" : "40s",
            "animationDelay": getAnimationDelay(),
          } as React.CSSProperties
        }
      >
        {originalLogos}
        {clonedLogos}
      </div>
      
      <style jsx>{`
        .scroller-inner {
          display: flex;
          gap: 1rem; /* 1rem = gap-4 */
          padding-top: 0.25rem; /* py-1 */
          padding-bottom: 0.25rem; /* py-1 */
          animation: scroll var(--animation-duration) linear infinite;
        }

        .scroller-inner[data-direction="reverse"] {
          animation-direction: reverse;
        }

        @keyframes scroll {
          to {
            /* We need to account for the gap between the last original and first cloned item */
            transform: translateX(calc(-50% - 0.5rem));
          }
        }
      `}</style>
    </div>
  );
}
