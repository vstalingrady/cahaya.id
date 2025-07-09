'use client';

import React, { useRef, useImperativeHandle } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PinInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string[];
  onChange: (value: string[]) => void;
  pinLength?: number;
  onComplete?: (pin: string) => void;
}

export const PinInput = React.forwardRef<HTMLDivElement, PinInputProps>(
  ({ value, onChange, pinLength = 6, onComplete, className, ...props }, ref) => {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    // Expose a 'focus' method to the parent component
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputsRef.current[0]?.focus();
      },
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const entry = e.target.value.slice(-1); // Only take the last character
      // Basic validation: only allow alphanumeric characters
      if (!/^[a-zA-Z0-9]$/.test(entry) && entry !== '') return;

      const newPin = [...value];
      newPin[index] = entry;
      onChange(newPin);

      // If a character was entered, move to the next input
      if (entry && index < pinLength - 1) {
        inputsRef.current[index + 1]?.focus();
      }
      
      // If all inputs are filled, call onComplete
      const pinString = newPin.join('');
      if(pinString.length === pinLength) {
        onComplete?.(pinString);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === 'Backspace' && !value[index] && index > 0) {
        // If backspace is pressed on an empty input, move focus to the previous one
        inputsRef.current[index - 1]?.focus();
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
        onChange(newPin);
        
        const nextFocusIndex = Math.min(pastedText.length, pinLength - 1);
        inputsRef.current[nextFocusIndex]?.focus();

        const pinString = newPin.join('');
        if(pinString.length === pinLength) {
            onComplete?.(pinString);
        }
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
                maxLength={1} // Important: enforce single character
                value={value[index]}
                onChange={(e) => handleChange(e, index)}
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