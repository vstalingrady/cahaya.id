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
    const scroller = scrollerRef.current;
    if (scroller) {
      scroller.setAttribute("data-animated", "true");
    }
  }, []);

  const speedMap = {
    slow: '60s',
    normal: '40s',
    fast: '25s',
  };

  return (
    <div
      ref={scrollerRef}
      className={cn(
        "w-full overflow-hidden relative",
        className
      )}
      style={{
        maskImage: 'linear-gradient(to right, transparent, white 20%, white 80%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, white 20%, white 80%, transparent)',
      }}
    >
      <div
        className={cn(
          "flex min-w-full w-max flex-nowrap gap-6",
          direction === 'forward' ? 'animate-scroll-left' : 'animate-scroll-right'
        )}
        style={{ '--animation-duration': speedMap[speed] } as React.CSSProperties}
      >
        {/* We duplicate the institutions list to create the seamless loop effect */}
        {[...institutions, ...institutions].map((institution, index) => (
          <div key={`${institution.name}-${index}`} className="flex flex-shrink-0 flex-col items-center justify-center w-[140px] h-[110px] rounded-2xl bg-white shadow-lg">
            {institution.logo}
            <span className="mt-3 text-sm text-center font-medium text-gray-700 px-1">{institution.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteLogoScroller;
