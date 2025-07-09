
'use client';

import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

interface PinInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  pinLength?: number;
}

export const PinInput = React.forwardRef<HTMLInputElement, PinInputProps>(
  ({ value, onChange, pinLength = 6 }, ref) => {
    
    // Use a ref for the hidden input if an external ref isn't provided.
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

    // Focus the hidden input when the user clicks the container.
    const handleContainerClick = () => {
      inputRef.current?.focus();
    };
    
    // Handle changes from the hidden input.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      // Pad the array with empty strings to ensure it always has `pinLength` elements.
      const newPinArray = inputValue.split('').concat(Array(pinLength).fill('')).slice(0, pinLength);
      onChange(newPinArray);
    };

    return (
      <div 
        className="relative w-full h-14" 
        onClick={handleContainerClick}
      >
        {/* This is the real input, but it's hidden from view. */}
        <input
          ref={inputRef}
          type="text" // Use text to allow alphanumeric, validation is on server
          inputMode="text"
          value={value.join('')}
          onChange={handleChange}
          maxLength={pinLength}
          autoComplete="one-time-code"
          className="absolute inset-0 w-full h-full bg-transparent border-0 opacity-0 cursor-pointer"
          aria-label="PIN Input"
        />

        {/* These are the visual boxes for displaying the PIN. */}
        <div className="flex justify-center items-center gap-2 w-full h-full pointer-events-none" aria-hidden="true">
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
