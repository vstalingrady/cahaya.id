'use client';

import { useState, useEffect, useRef, memo } from 'react';
import { financialInstitutions } from '@/lib/data';

// Memoized institution card component to prevent unnecessary re-renders
const InstitutionCard = memo(({ institution, index }: { institution: any; index: number }) => (
  <div 
    key={`${institution.id}-${index}`} 
    className="logo-card mx-3 flex flex-col items-center justify-center"
  >
    <div className="w-12 h-12 flex items-center justify-center mb-1">
      {institution.logoUrl ? (
        <img 
          src={institution.logoUrl} 
          alt={institution.name} 
          className="max-w-full max-h-full object-contain"
          loading="lazy"
          onError={(e) => {
            // Fallback to name initials if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextSibling?.classList.remove('hidden');
          }}
        />
      ) : null}
      <div className="hidden w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
        {institution.name.charAt(0)}
      </div>
    </div>
    <span className="text-[10px] text-center leading-tight">{institution.name}</span>
  </div>
));

InstitutionCard.displayName = 'InstitutionCard';

const SeaAnimation = () => {
  // Filter for banks, e-wallets, and investment platforms (main financial institutions)
  // Limit to first 15 institutions to reduce DOM elements
  const filteredInstitutions = financialInstitutions.filter(institution => 
    institution.type === 'bank' || 
    institution.type === 'e-wallet' || 
    institution.type === 'investment'
  ).slice(0, 15);

  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(40); // Reduced default duration for smoother animation

  useEffect(() => {
    // Calculate the animation duration based on the content width
    if (trackRef.current) {
      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = trackRef.current.clientWidth;
      
      // Calculate duration based on width with optimized range
      const calculatedDuration = Math.max(25, Math.min(80, trackWidth / 300));
      setDuration(calculatedDuration);
    }
  }, []);

  // Create two copies for seamless looping (reduced from three)
  const institutions = [...filteredInstitutions, ...filteredInstitutions];

  return (
    <div className="relative w-full h-24 overflow-hidden scroller-wrapper">
      <div 
        ref={trackRef}
        className="scroller-track absolute inset-0 flex items-center"
        style={{ 
          animation: `scroll-left ${duration}s linear infinite`,
        }}
      >
        {institutions.map((institution, index) => (
          <InstitutionCard key={`${institution.id}-${index}`} institution={institution} index={index} />
        ))}
      </div>
    </div>
  );
};

export default SeaAnimation;