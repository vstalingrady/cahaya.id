'use client';

import React from 'react';
import { cn } from '@/lib/utils';

const GlowingShield = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="shield-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
        </filter>
      </defs>

      {/* Glow Layer */}
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        className="text-primary/80"
        fill="currentColor"
        filter="url(#shield-glow)"
      />

      {/* Main Shield Icon */}
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        fill="hsl(var(--primary))"
      />

      {/* Lock Icon */}
      <path
        d="M14 10.5v-1a2 2 0 0 0-4 0v1 M9 11.5h6v4a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-4z"
        stroke="hsl(var(--background))"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export default GlowingShield;
