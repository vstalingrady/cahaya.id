
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

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      const { value: inputValue } = e.target;
      const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');

      if (!sanitizedValue) return;
      
      const newPin = [...value];

      if (sanitizedValue.length > 1) { // Handle paste
          handlePaste(sanitizedValue, index);
          return;
      }
      
      newPin[index] = sanitizedValue;
      onChange(newPin);

      if (index < pinLength - 1) {
        inputsRef.current[index + 1]?.focus();
      } else if (index === pinLength - 1) {
        onComplete?.();
      }
    };
    
    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      index: number
    ) => {
      if (e.key === 'Backspace' && !value[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      } else if (e.key === 'Backspace' && value[index]) {
        const newPin = [...value];
        newPin[index] = '';
        onChange(newPin);
      }
    };

    const handlePaste = (pastedValue: string, startIndex: number) => {
        const sanitizedValue = pastedValue.replace(/[^a-zA-Z0-9]/g, '');
        const newPin = [...value];
        
        for (let i = 0; i < sanitizedValue.length && startIndex + i < pinLength; i++) {
            newPin[startIndex + i] = sanitizedValue.charAt(i);
        }
        onChange(newPin);
    
        const newFocusIndex = Math.min(startIndex + sanitizedValue.length, pinLength - 1);
        inputsRef.current[newFocusIndex]?.focus();

        if (newPin.join('').length === pinLength) {
            onComplete?.();
        }
    };

    const handleWrapperPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const activeInput = document.activeElement as HTMLInputElement;
        const activeIndex = inputsRef.current.indexOf(activeInput);
        handlePaste(pastedText, activeIndex >= 0 ? activeIndex : 0);
    }

    return (
      <div className={cn("flex justify-center items-center gap-2", className)} onPaste={handleWrapperPaste} ref={ref}>
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
