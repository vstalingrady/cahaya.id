'use client';

import { useState } from 'react';
import CaharayaIcon from '@/components/icons/caharaya-icon';
import CaharayaIconText from '@/components/icons/caharaya-icon-text';
import CaharayaWebIcon from '@/components/icons/caharaya-web-icon';

export default function IconTestPage() {
  const [isPulsing, setIsPulsing] = useState(true);
  
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Caharaya Icons Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Caharaya Icon</h2>
            <div className="flex flex-wrap items-center gap-4">
              <CaharayaIcon className="h-10 w-10" />
              <CaharayaIcon className={`h-12 w-12 text-primary ${isPulsing ? 'animate-pulse' : ''}`} />
              <CaharayaIcon className="h-16 w-16 text-accent" />
            </div>
            <button 
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              onClick={() => setIsPulsing(!isPulsing)}
            >
              {isPulsing ? 'Stop Pulse' : 'Start Pulse'}
            </button>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Caharaya Icon with Text</h2>
            <div className="flex flex-col items-center gap-4">
              <CaharayaIconText className="h-8" />
              <CaharayaIconText className="h-10 text-primary" />
              <CaharayaIconText className="h-12 text-accent" />
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Caharaya Web Icon</h2>
            <div className="flex flex-wrap items-center gap-4">
              <CaharayaWebIcon className="h-10 w-10" />
              <CaharayaWebIcon className="h-12 w-12 text-primary" />
              <CaharayaWebIcon className="h-16 w-16 text-accent" />
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-lg bg-primary"></div>
              <span className="mt-2 text-sm">Primary<br/>(2A2865)</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-lg bg-accent"></div>
              <span className="mt-2 text-sm">Accent<br/>(E6992B)</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-lg bg-secondary"></div>
              <span className="mt-2 text-sm">Secondary</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-lg bg-muted"></div>
              <span className="mt-2 text-sm">Muted</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-lg bg-destructive"></div>
              <span className="mt-2 text-sm">Destructive</span>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-8 mb-4">Caharaya Brand Colors</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-lg bg-[#2A2865]"></div>
              <span className="mt-2 text-sm">Dark Blue<br/>(#2A2865)</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-lg bg-[#E6992B]"></div>
              <span className="mt-2 text-sm">Yellow<br/>(#E6992B)</span>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-8 mb-4">Extended Caharaya Palette</h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div key={`blue-${shade}`} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded bg-caharaya-${shade}`}></div>
                <span className="mt-1 text-xs">Blue {shade}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mt-4">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div key={`yellow-${shade}`} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded bg-caharaya-yellow-${shade}`}></div>
                <span className="mt-1 text-xs">Yellow {shade}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}