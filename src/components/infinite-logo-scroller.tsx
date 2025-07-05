
'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { type FinancialInstitution } from '@/lib/data';
import { cn } from '@/lib/utils';

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
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    
    // Prevent re-running the duplication logic on re-renders, especially during development with HMR
    if (scroller.hasAttribute("data-animated")) return;

    scroller.setAttribute('data-animated', 'true');

    const scrollerInner = scroller.querySelector('.scroller__inner');
    if (scrollerInner) {
      const scrollerContent = Array.from(scrollerInner.children);
      scrollerContent.forEach(item => {
        const duplicatedItem = item.cloneNode(true) as HTMLElement;
        duplicatedItem.setAttribute('aria-hidden', 'true');
        scrollerInner.appendChild(duplicatedItem);
      });
    }
    // Using an empty dependency array ensures this effect runs only once after the component mounts.
  }, []);

  return (
    <div
      className={cn("scroller w-full overflow-hidden", className)}
      ref={scrollerRef}
      data-speed={speed}
      data-direction={direction}
    >
      <div className="scroller__inner flex gap-4 flex-nowrap w-max py-2">
        {institutions.map(inst => (
          <div key={inst.id} className="flex-shrink-0 w-24 h-24 bg-card/80 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4 border border-border shadow-md transition-all duration-300 hover:shadow-primary/20 hover:bg-white hover:scale-105">
            <Image
              src={inst.logoUrl}
              alt={inst.name}
              width={80}
              height={80}
              className="object-contain h-full w-auto"
              data-ai-hint={`${inst.name} logo`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
