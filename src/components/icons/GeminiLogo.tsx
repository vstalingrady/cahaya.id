import React from 'react';
import { cn } from '@/lib/utils';

const GeminiLogo = ({ className, size = 56 }: { className?: string, size?: number | string }) => (
  <svg
    fill={'none'}
    shapeRendering={'geometricPrecision'}
    width={size}
    height={size}
    className={cn(className)}
    xmlns={'http://www.w3.org/2000/svg'}
    viewBox={'0 0 100 100'}
  >
    <defs>
      <linearGradient
        gradientUnits={'userSpaceOnUse'}
        id={'gemini-gradient-a'}
        x1={22.0003}
        x2={89.9203}
        y1={7.5002}
        y2={54.2602}
      >
        <stop offset={0.05} stopColor={'#9B5DE5'} />
        <stop offset={1} stopColor={'#F15BB5'} />
      </linearGradient>
      <linearGradient
        gradientUnits={'userSpaceOnUse'}
        id={'gemini-gradient-b'}
        x1={6.5}
        x2={74.42}
        y1={50}
        y2={96.76}
      >
        <stop offset={0.16} stopColor={'#00BBF9'} />
        <stop offset={0.87} stopColor={'#3461FD'} />
      </linearGradient>
      <linearGradient
        gradientUnits={'userSpaceOnUse'}
        id={'gemini-gradient-c'}
        x1={64.5}
        x2={95.5}
        y1={64}
        y2={93.5}
      >
        <stop offset={0.34} stopColor={'#00F5D4'} />
        <stop offset={1} stopColor={'#3461FD'} />
      </linearGradient>
    </defs>
    <path
      d={
        'M50 7.5a6.25 6.25 0 0 0-4.42 1.83l-34.16 34.16A6.25 6.25 0 0 0 13.25 50h73.5A6.25 6.25 0 0 0 82.33 39.07l-27.91-27.9A6.25 6.25 0 0 0 50 7.5Z'
      }
      fill={'url(#gemini-gradient-a)'}
    />
    <path
      d={'M13.25 50a6.25 6.25 0 0 0-1.83 4.42v27.91a6.25 6.25 0 0 0 10.68 4.42l34.16-34.16A6.25 6.25 0 0 0 50 50H13.25Z'}
      fill={'url(#gemini-gradient-b)'}
    />
    <path d={'M50 50h36.75a6.25 6.25 0 0 1 4.42 10.68l-34.16 34.16A6.25 6.25 0 0 1 50 92.5V50Z'} fill={'url(#gemini-gradient-c)'} />
  </svg>
);

export default GeminiLogo;
