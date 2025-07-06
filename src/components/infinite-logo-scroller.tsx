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
  // Memoize the logo list to prevent re-renders unless the institutions prop changes.
  const allLogos = React.useMemo(
    () =>
      // Create two copies of the logos for seamless looping
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
      )),
    [institutions]
  );

  return (
    <div
      className={cn("w-full overflow-hidden", className)}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, white 20%, white 80%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, white 20%, white 80%, transparent)",
      }}
    >
      <div
        className="scroller-inner"
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
          gap: 1rem;
          padding: 0.25rem 0;
          width: max-content;
        }

        .scroller-inner[data-direction="forward"] {
          animation: scroll-left var(--animation-duration) linear infinite;
        }

        .scroller-inner[data-direction="reverse"] {
          animation: scroll-right var(--animation-duration) linear infinite;
        }

        /* Keyframes for scrolling from right to left */
        @keyframes scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-50% - 0.5rem));
          }
        }

        /* Keyframes for scrolling from left to right */
        @keyframes scroll-right {
          from {
            transform: translateX(calc(-50% - 0.5rem));
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
