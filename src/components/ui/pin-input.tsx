
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PinInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  pinLength?: number;
}

export const PinInput = React.forwardRef<HTMLInputElement, PinInputProps>(
  ({ value, onChange, pinLength = 6 }, ref) => {
    
    // Focus the hidden input when the component is clicked.
    const handleContainerClick = () => {
      if (ref && typeof ref === 'object' && ref.current) {
        ref.current.focus();
      }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitizedValue = e.target.value.slice(0, pinLength);
      // Pad the array with empty strings to ensure it always has `pinLength` elements.
      const newPinArray = sanitizedValue.split('').concat(Array(pinLength).fill('')).slice(0, pinLength);
      onChange(newPinArray);
    };

    return (
      <div 
        className="relative w-full h-14" 
        onClick={handleContainerClick}
      >
        {/* This is the real input, but it's hidden. */}
        <input
          ref={ref}
          type="text"
          inputMode="text"
          value={value.join('')}
          onChange={handleChange}
          maxLength={pinLength}
          autoComplete="one-time-code"
          className="absolute inset-0 w-full h-full bg-transparent border-0 opacity-0 cursor-pointer"
        />

        {/* These are the visual boxes for the PIN. */}
        <div className="flex justify-center items-center gap-2 w-full h-full pointer-events-none">
          {Array(pinLength)
            .fill('')
            .map((_, index) => (
              <React.Fragment key={index}>
                <div
                  className={cn(
                    "w-12 h-14 flex items-center justify-center text-center text-xl font-mono border-2 rounded-md transition-all duration-200",
                    // The box is "active" if it's the next one to be typed in.
                    index === value.filter(Boolean).length ? 'border-primary shadow-md shadow-primary/20' : 'border-input',
                     // Filled boxes have a different border color.
                    value[index] ? 'border-primary/50' : 'border-input'
                  )}
                >
                  {/* Display the character or a placeholder dot */}
                  {value[index] ? <span className="transform -translate-y-1">●</span> : null}
                </div>
                {index === 2 && <div className="w-4 h-1 bg-border rounded-full" />}
              </React.Fragment>
            ))}
        </div>
      </div>
    );
  }
);
PinInput.displayName = 'PinInput';
