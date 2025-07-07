'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface InfiniteLogoScrollerProps {
  institutions: { name: string; logo: React.ReactNode }[];
  direction?: 'forward' | 'reverse';
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

const InfiniteLogoScroller: React.FC<InfiniteLogoScrollerProps> = ({
  institutions,
  direction = 'forward',
  speed = 'normal',
  className,
}) => {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    scrollerRef.current?.setAttribute('data-animated', 'true');
  }, []);

  const handleClick = (index: number) => {
    if (isPaused && activeIndex === index) {
      setIsPaused(false);
      setActiveIndex(null);
    } else {
      setIsPaused(true);
      setActiveIndex(index);
    }
  };

  const speedMap = {
    slow: '60s',
    normal: '40s',
    fast: '25s',
  };

  return (
    <div
      className={cn('scroller-wrapper', className)}
      style={
        {
          '--animation-duration': speedMap[speed],
        } as React.CSSProperties
      }
    >
      <div
        ref={scrollerRef}
        data-paused={isPaused}
        className={cn(
          'scroller-track',
          direction === 'forward' ? 'animate-scroll-left' : 'animate-scroll-right'
        )}
      >
        {[...institutions, ...institutions].map((institution, index) => (
          <button
            key={`${institution.name}-${index}`}
            className="logo-card"
            data-active={isPaused && activeIndex === index}
            onClick={() => handleClick(index)}
            aria-label={`Pause on ${institution.name}`}
          >
            {institution.logo}
            <span>{institution.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default InfiniteLogoScroller;
