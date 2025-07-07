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
  // --- IMPORTANT NOTE ON DUPLICATION ---
  // The list is duplicated exactly once (`[...institutions, ...institutions]`).
  // Triplicating it will break the animation logic, which is designed to
  // move the container by exactly 50% of its total width.
  // With duplicated content, the container is 200% wide, so a 50% translation
  // moves it by one full set of logos, creating a perfect loop.
  const allLogos = React.useMemo(() => [...institutions, ...institutions].map((inst, index) => (
    <div
      key={`logo-${inst.id}-${index}`}
      className="flex-shrink-0 w-24 h-24 bg-card/80 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4 border border-border shadow-md"
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
      style={{
        maskImage: 'linear-gradient(to right, transparent, white 20%, white 80%, transparent)'
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
          padding-block: 0.25rem;
          width: max-content;
        }
        
        /* --- THE FIX IS HERE --- */
        /* We define two separate, explicit animations for full control. */

        /* Animation for scrolling LEFT (forward) */
        @keyframes scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            /* Moves the entire container left by half its width (one full set of logos) */
            transform: translateX(-50%);
          }
        }

        /* Animation for scrolling RIGHT (reverse) */
        @keyframes scroll-right {
          from {
            /* Starts from the looped position */
            transform: translateX(-50%);
          }
          to {
            /* Ends at the initial position */
            transform: translateX(0);
          }
        }

        /* Apply the FORWARD animation */
        .scroller-inner[data-direction="forward"] {
          animation: scroll-left var(--animation-duration) linear infinite;
        }
        
        /* Apply the REVERSE animation */
        .scroller-inner[data-direction="reverse"] {
          /* This is the key: We set the element's starting position *before* the animation begins.
             This ensures that when the 'scroll-right' animation starts, the element is already
             at \`translateX(-50%)\`, so there is no jump from 0 to -50%. */
          transform: translateX(-50%);
          animation: scroll-right var(--animation-duration) linear infinite;
        }
      `}</style>
    </div>
  );
}
