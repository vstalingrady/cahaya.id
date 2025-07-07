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
  // We need to duplicate the logos to create the seamless illusion
  const allLogos = React.useMemo(() => 
    [...institutions, ...institutions].map((inst, index) => (
      <div
        key={`logo-${inst.id}-${index}`}
        className="flex-shrink-0 w-32 h-24 bg-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4 border border-white/10 shadow-md transition-all duration-300 hover:shadow-primary/20 hover:bg-white/20 hover:scale-105"
      >
        <Image
          src={inst.logoUrl}
          alt={inst.name}
          width={80}
          height={80}
          className="object-contain w-full h-full"
        />
      </div>
    )),
    [institutions]
  );
  
  return (
    <div
      className={cn("w-full overflow-hidden", className)}
      style={{
        maskImage: 'linear-gradient(to right, transparent, white 20%, white 80%, transparent)',
      }}
    >
      <div
        className={cn(
            "flex gap-6 w-max",
            // Apply the correct animation based on direction
            direction === 'forward' ? 'animate-scroll-left' : 'animate-scroll-right'
        )}
        style={
          {
            // CSS custom property for animation duration
            '--animation-duration': speed === 'fast' ? '30s' : speed === 'slow' ? '90s' : '60s',
          } as React.CSSProperties
        }
      >
        {allLogos}
      </div>
    </div>
  );
};

export default InfiniteLogoScroller;
