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
  const logoList = institutions.map((inst, index) => (
    <div
      key={`${inst.id}-${index}`}
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
        className="scroller-inner flex flex-nowrap gap-4 py-1"
        data-direction={direction}
        style={
          {
            "--animation-duration":
              speed === "fast" ? "20s" : speed === "slow" ? "80s" : "40s",
          } as React.CSSProperties
        }
      >
        {logoList}
        {/* We add the duplicated logos here, inside an aria-hidden div for accessibility */}
        <div className="flex flex-nowrap gap-4" aria-hidden="true">
            {logoList}
        </div>
      </div>
      
      <style jsx>{`
        .scroller-inner {
          animation: scroll var(--animation-duration) linear infinite;
        }

        .scroller-inner[data-direction="reverse"] {
            animation-direction: reverse;
        }

        .scroller:hover .scroller-inner {
          animation-play-state: paused;
        }

        @keyframes scroll {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
