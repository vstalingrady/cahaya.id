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
  // Create two copies of the logos for seamless looping
  const allLogos = [...institutions, ...institutions].map((inst, index) => (
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

  const getDuration = () => {
    switch (speed) {
      case 'fast': return '20s';
      case 'slow': return '80s';
      default: return '40s';
    }
  };

  return (
    <div className={cn("w-full overflow-hidden relative", className)}>
      <div
        className={cn(
          "flex gap-4 w-max",
          direction === 'forward' ? 'animate-scroll-left' : 'animate-scroll-right'
        )}
        style={{ '--animation-duration': getDuration() } as React.CSSProperties}
      >
        {allLogos}
      </div>
      <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
      <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>
    </div>
  );
}
