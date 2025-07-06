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
  // Create a single array with original and cloned logos for the animation
  const allLogos = React.useMemo(() => [...institutions, ...institutions].map((inst, index) => (
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
      className={cn("w-full overflow-hidden relative", className)}
      // This mask creates the fade-out effect on the edges
      style={{
        maskImage: 'linear-gradient(to right, transparent, white 20%, white 80%, transparent)'
      }}
    >
      <div
        className="scroller-inner group-hover:[animation-play-state:paused]"
        data-direction={direction}
        style={
          {
            "--animation-duration":
              speed === "fast" ? "20s" : speed === "slow" ? "80s" : "40s",
          } as React.CSSProperties
        }
      >
        {allLogos}
      </div>

      <style jsx>{`
        .scroller-inner {
          display: flex;
          gap: 1rem; /* The space between logos */
          padding: 0.25rem 0;
          width: max-content;
          animation: scroll var(--animation-duration) linear infinite;
        }
        
        /* The animation moves from its starting position to the left by 50% of its total width. 
           Since the inner container is 200% of the original logos' width, this results
           in a perfect, seamless loop. */
        @keyframes scroll {
          to {
            transform: translateX(-50%);
          }
        }
        
        .scroller-inner[data-direction="reverse"] {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
}
