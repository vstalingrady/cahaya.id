'use client';

import Image from 'next/image';
import { type FinancialInstitution } from '@/lib/data';
import { cn } from '@/lib/utils';
import React, { useRef } from 'react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

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

  // Calculate animation duration
  const getDuration = () => {
    switch (speed) {
      case 'fast': return '20s';
      case 'slow': return '80s';
      default: return '40s';
    }
  };

  return (
    <div 
      className={cn("w-full overflow-hidden relative", className)}
      ref={containerRef}
    >
      <div
        ref={innerRef}
        className="scroller-inner"
        style={
          {
            "--animation-duration": getDuration(),
            "--animation-direction": direction === 'reverse' ? 'reverse' : 'normal',
          } as React.CSSProperties
        }
      >
        {allLogos}
      </div>
      <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
      <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>

      <style jsx>{`
        .scroller-inner {
          display: flex;
          gap: 1rem;
          padding: 0.25rem 0;
          width: max-content;
          animation: scroll var(--animation-duration) linear infinite;
          animation-play-state: paused;
          animation-direction: var(--animation-direction);
        }
        
        .scroller-inner {
          animation-play-state: running;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          95% {
            transform: translateX(-50%);
            animation-timing-function: linear;
          }
          100% {
            transform: translateX(-50%);
            animation-timing-function: cubic-bezier(0.8, 0, 0.2, 1);
          }
        }
      `}</style>
    </div>
  );
}