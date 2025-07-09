
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
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const entry = e.target.value;
      if (!/^[a-zA-Z0-9]*$/.test(entry)) return; // Allow only alphanumeric

      const newPin = [...value];
      newPin[index] = entry.slice(-1); // Take only the last character
      onChange(newPin);

      // Move to the next input if a character was entered
      if (entry && index < pinLength - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === 'Backspace' && !value[index] && index > 0) {
        // If backspace is pressed on an empty input, move to the previous one
        inputRefs.current[index - 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').slice(0, pinLength);
      
      if (pastedData) {
        const newPin = Array(pinLength).fill('');
        for (let i = 0; i < pastedData.length; i++) {
          newPin[i] = pastedData[i];
        }
        onChange(newPin);
        
        const nextFocusIndex = Math.min(pastedData.length, pinLength - 1);
        inputRefs.current[nextFocusIndex]?.focus();
      }
    };

    // Use the first input as the main ref for the parent component if needed
    React.useImperativeHandle(ref, () => inputRefs.current[0] as HTMLInputElement);

    return (
      <div className="flex justify-center items-center gap-2 w-full h-14">
        {Array(pinLength)
          .fill('')
          .map((_, index) => (
            <React.Fragment key={index}>
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="password"
                inputMode="text"
                value={value[index] || ''}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                maxLength={1}
                className={cn(
                  "w-12 h-14 flex items-center justify-center text-center text-xl font-mono border rounded-md transition-all duration-200 bg-input",
                  "focus:border-primary focus:ring-2 focus:ring-primary/50 focus:shadow-md focus:shadow-primary/20",
                  value[index] ? 'border-primary/50' : 'border-input'
                )}
                autoComplete="one-time-code"
              />
              {index === 2 && <div className="w-4 h-1 bg-border rounded-full" />}
            </React.Fragment>
          ))}
      </div>
    );
  }
);
PinInput.displayName = 'PinInput';
