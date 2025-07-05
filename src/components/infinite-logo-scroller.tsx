
'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { financialInstitutions } from '@/lib/data';

export default function InfiniteLogoScroller() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller) {
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
    }
  }, []);

  return (
    <div className="scroller w-full overflow-hidden" ref={scrollerRef}>
      <div className="scroller__inner flex gap-6 flex-nowrap w-max py-4">
        {financialInstitutions.map(inst => (
          <div key={inst.id} className="flex-shrink-0 w-36 h-16 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center p-3 shadow-md transition-all duration-300 hover:shadow-primary/20 hover:bg-white hover:scale-105">
            <Image
              src={inst.logoUrl}
              alt={inst.name}
              width={100}
              height={40}
              className="object-contain h-full w-auto"
              data-ai-hint={`${inst.name} logo`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
