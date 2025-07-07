'use client';

import React from 'react';
import Image from 'next/image';
import { type FinancialInstitution } from '@/lib/data';
import { cn } from '@/lib/utils';

interface InfiniteLogoScrollerProps {
  institutions: FinancialInstitution[];
  speed?: 'fast' | 'normal' | 'slow';
  direction?: 'forward' | 'reverse';
  className?: string;
}

const InfiniteLogoScroller: React.FC<InfiniteLogoScrollerProps> = ({
  institutions,
  speed = 'normal',
  direction = 'forward',
  className,
}) => {
  const allLogos = React.useMemo(() => 
    [...institutions, ...institutions].map((inst, index) => (
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
  )), [institutions]);

  return (
    <div
      className={cn("w-full overflow-hidden relative group", className)}
      style={{
        maskImage: 'linear-gradient(to right, transparent, white 20%, white 80%, transparent)'
      }}
    >
      <div
        className={cn(
          "flex gap-4 p-1 w-max group-hover:[animation-play-state:paused]",
          direction === 'reverse' ? 'animate-scroll-right' : 'animate-scroll-left'
        )}
        style={
          {
            "--animation-duration":
              speed === "fast" ? "20s" : speed === "slow" ? "80s" : "40s",
          } as React.CSSProperties
        }
      >
        {allLogos}
      </div>
    </div>
  );
};

export default InfiniteLogoScroller;
