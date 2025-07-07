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

  const css = `
    .scroller-wrapper {
      width: 100%;
      overflow: hidden;
      -webkit-mask: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
      mask: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
    }

    .scroller-track {
      display: flex;
      width: max-content;
      flex-wrap: nowrap;
      gap: 1.5rem;
    }

    .scroller-track[data-animated="true"] {
      animation: scroll var(--animation-duration, 40s) linear infinite;
      animation-direction: var(--animation-direction, normal);
    }
    
    @keyframes scroll {
      to {
        transform: translate(calc(-50% - 0.75rem));
      }
    }

    .logo-card {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 140px;
      height: 110px;
      background-color: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      border-radius: 1rem;
      box-shadow: 0 4px 15px hsla(var(--primary) / 0.07);
      flex-shrink: 0;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .logo-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px hsla(var(--primary) / 0.1);
    }

    .logo-card span {
      margin-top: 12px;
      font-size: 0.875rem;
      color: hsl(var(--muted-foreground));
      font-weight: 500;
      text-align: center;
      line-height: 1.2;
      padding: 0 4px;
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div 
        className={cn('scroller-wrapper', className)}
        style={{
          '--animation-duration': speedMap[speed],
          '--animation-direction': direction === 'reverse' ? 'reverse' : 'normal',
        } as React.CSSProperties}
      >
        <div ref={scrollerRef} className="scroller-track">
          {[...institutions, ...institutions].map((institution, index) => (
            <div key={`${institution.name}-${index}`} className="logo-card">
              {institution.logo}
              <span>{institution.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InfiniteLogoScroller;
