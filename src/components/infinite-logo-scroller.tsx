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
      // A data attribute is used to scope the CSS for the animation direction.
      data-direction={direction}
      className={cn(
        "scroller w-full overflow-hidden",
        className
      )}
    >
      <div
        className="scroller-inner flex flex-nowrap gap-4 py-1"
        style={
          {
            "--animation-duration":
              speed === "fast" ? "20s" : speed === "slow" ? "80s" : "40s",
          } as React.CSSProperties
        }
      >
        {/* The list is duplicated to create the seamless loop effect. */}
        {institutions.map((inst, index) => (
          <div
            key={`logo-${inst.id}-${index}`}
            className="flex-shrink-0 w-24 h-24 bg-card/80 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4 border border-border shadow-md transition-all duration-300 hover:shadow-primary/20 hover:bg-white hover:scale-105"
          >
            <Image
              src={inst.logoUrl}
              alt={inst.name}
              width={80}
              height={80}
              // These classes ensure the image scales to fit without distortion.
              className="object-contain w-full h-full"
              data-ai-hint={`${inst.name} logo`}
            />
          </div>
        ))}
        {/* The duplicated content, aria-hidden for accessibility. */}
        {institutions.map((inst, index) => (
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
        ))}
      </div>

      <style jsx>{`
        .scroller-inner {
          /* Default animation (scrolling left) */
          animation: scroll-left var(--animation-duration) linear infinite;
        }

        .scroller[data-direction="reverse"] > .scroller-inner {
          /* Reverse animation (scrolling right) */
          animation-name: scroll-right;
        }

        .scroller:hover .scroller-inner {
          animation-play-state: paused;
        }
        
        /* Keyframes for scrolling left (forward) */
        @keyframes scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        /* Keyframes for scrolling right (reverse) */
        @keyframes scroll-right {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
