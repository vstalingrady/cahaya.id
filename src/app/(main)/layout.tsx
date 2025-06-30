'use client';

import MainNav from '@/components/main-nav';
import NoiseOverlay from '@/components/noise-overlay';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const mainRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const mainEl = mainRef.current;

    const handleScroll = () => {
      if (!mainEl) return;
      const currentScrollY = mainEl.scrollTop;

      // Hide nav bar only when scrolling down past a certain threshold
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsNavVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Show nav bar when scrolling up
        setIsNavVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    if (mainEl) {
      mainEl.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (mainEl) {
        mainEl.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-black via-red-950 to-black text-white min-h-screen relative overflow-hidden flex flex-col">
      <NoiseOverlay />
      
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <main ref={mainRef} className="flex-1 overflow-y-auto p-6 relative z-10 pb-24">
        {children}
      </main>
      
      <div className={cn(
        "absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 ease-in-out",
        isNavVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-70"
      )}>
        <MainNav />
      </div>
    </div>
  );
}
