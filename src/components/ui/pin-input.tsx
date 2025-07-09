
'use client';

import React, { useRef, useImperativeHandle } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PinInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string[];
  onChange: (value: string[]) => void;
  pinLength?: number;
  onComplete?: () => void;
}

export const PinInput = React.forwardRef<HTMLDivElement, PinInputProps>(
  ({ value, onChange, pinLength = 6, onComplete, className, ...props }, ref) => {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputsRef.current[0]?.focus();
      },
    }));

    const processPinChange = (newPin: string[]) => {
      onChange(newPin);
      if (newPin.join('').length === pinLength) {
        onComplete?.();
      }
    };

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      // Get the last character typed. This handles overwriting correctly.
      const char = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(-1); 
      
      const newPin = [...value];
      newPin[index] = char;
      processPinChange(newPin);
      
      // If a character was entered, move to the next input
      if (char && index < pinLength - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      index: number
    ) => {
      if (e.key === 'Backspace') {
        // If the input is already empty, move focus to the previous input
        if (!value[index] && index > 0) {
          inputsRef.current[index - 1]?.focus();
        } else {
          // Otherwise, just clear the current input
          const newPin = [...value];
          newPin[index] = '';
          onChange(newPin); // Don't call processPinChange, no onComplete on backspace
        }
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '');
      if (pastedText) {
        const newPin = Array(pinLength).fill('');
        for (let i = 0; i < Math.min(pinLength, pastedText.length); i++) {
          newPin[i] = pastedText[i];
        }
        processPinChange(newPin);
        
        const nextFocusIndex = Math.min(pastedText.length, pinLength - 1);
        inputsRef.current[nextFocusIndex]?.focus();
      }
    };

    return (
      <div className={cn("flex justify-center items-center gap-2", className)} ref={ref} onPaste={handlePaste}>
        {Array(pinLength)
          .fill('')
          .map((_, index) => (
            <React.Fragment key={index}>
              <Input
                ref={(el) => (inputsRef.current[index] = el)}
                type="password"
                inputMode="text"
                value={value[index]}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-xl font-mono"
                autoComplete="one-time-code"
                {...props}
              />
              {index === 2 && <div className="w-4 h-1 bg-border rounded-full" />}
            </React.Fragment>
          ))}
      </div>
    );
  }
);
PinInput.displayName = 'PinInput';
