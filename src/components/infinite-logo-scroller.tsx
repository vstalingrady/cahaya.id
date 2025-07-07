'use client';

import React from 'react';
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

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    scrollerRef.current?.setAttribute('data-animated', 'true');
  }, []);

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
        className={cn(
            "scroller-track",
            direction === 'forward' ? 'animate-scroll-left' : 'animate-scroll-right'
        )}
      >
        {[...institutions, ...institutions].map((institution, index) => (
          <div key={`${institution.name}-${index}`} className="logo-card">
            {institution.logo}
            <span>{institution.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteLogoScroller;
