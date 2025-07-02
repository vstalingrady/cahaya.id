'use client';

import { cn } from "@/lib/utils";

type WelcomePhoneMockupProps = {
  src: string;
  className?: string;
};

export default function WelcomePhoneMockup({ src, className }: WelcomePhoneMockupProps) {
  return (
    <div className={cn("relative mx-auto border-neutral-800 bg-neutral-900 border-[8px] rounded-t-[2.5rem] h-[600px] w-[300px] shadow-2xl shadow-primary/20", className)}>
      <div className="w-[120px] h-[18px] bg-neutral-900 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-10"></div>
      <div className="rounded-t-[2rem] w-full h-full overflow-hidden bg-background">
        <iframe
          src={src}
          className="w-full h-full scale-[1.01] origin-top border-0 pointer-events-none"
          scrolling="no"
          // Sandbox to prevent any actions from within the iframe
          sandbox="" 
        />
      </div>
    </div>
  );
}
