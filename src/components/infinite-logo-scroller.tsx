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
      <div className="scroller-inner flex gap-4 flex-nowrap w-max py-2">
        {institutions.map(inst => (
          <div key={`${inst.id}-original`} className="flex-shrink-0 w-24 h-24 bg-card/80 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4 border border-border shadow-md transition-all duration-300 hover:shadow-primary/20 hover:bg-white hover:scale-105">
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
        {/* Render the second batch for seamless looping */}
        {institutions.map(inst => (
          <div key={`${inst.id}-duplicate`} aria-hidden="true" className="flex-shrink-0 w-24 h-24 bg-card/80 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4 border border-border shadow-md transition-all duration-300 hover:shadow-primary/20 hover:bg-white hover:scale-105">
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
    </div>
  );
}
