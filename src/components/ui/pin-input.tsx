'use client';

import React, { useRef, useState, useImperativeHandle, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PinInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  pinLength?: number;
}

export const PinInput = React.forwardRef<HTMLInputElement, PinInputProps>(
  ({ value, onChange, pinLength = 6 }, ref) => {
    const localInputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Expose the ref to the parent for focusing
    useImperativeHandle(ref, () => localInputRef.current as HTMLInputElement);

    const handleContainerClick = () => {
      localInputRef.current?.focus();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const entry = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, pinLength);
      const newPin = entry.split('');
      // Pad with empty strings to maintain the array length
      while (newPin.length < pinLength) {
        newPin.push('');
      }
      onChange(newPin);
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    // Calculate the index of the current active character for the cursor
    const activeIndex = value.findIndex(v => v === '');
    const finalIndex = activeIndex === -1 ? pinLength - 1 : activeIndex;

    return (
      <div 
        className="relative w-full h-14" 
        onClick={handleContainerClick}
        role="button"
        tabIndex={-1}
        aria-label="PIN input container"
      >
        {/* Hidden input that handles all the logic */}
        <input
          ref={localInputRef}
          type="text" // Use text to allow alphanumeric, but display dots
          value={value.join('')}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={pinLength}
          className="absolute inset-0 w-full h-full bg-transparent border-none outline-none text-transparent [caret-color:transparent] p-0 m-0"
          autoComplete="one-time-code"
        />
        
        {/* Visible display boxes */}
        <div className="flex justify-center items-center gap-2 w-full h-full pointer-events-none">
          {Array(pinLength)
            .fill('')
            .map((_, index) => (
              <React.Fragment key={index}>
                <div 
                  className={cn(
                    "w-12 h-14 flex items-center justify-center text-xl font-mono border rounded-md transition-all duration-200 relative",
                    value[index] ? 'border-primary/50' : 'border-input',
                    isFocused && index === finalIndex && 'border-primary shadow-md shadow-primary/20'
                  )}
                >
                  {value[index] ? '●' : ''}
                  {isFocused && index === finalIndex && !value[index] && (
                      <div className="absolute w-px h-6 bg-primary cursor-blink"></div>
                  )}
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