
'use client';

import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

interface PinInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  pinLength?: number;
}

export function PinInput({ value, onChange, pinLength = 6 }: PinInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = [...value];
    const { value: inputValue } = e.target;
    
    // Only take the first character if more than one is pasted
    newValue[index] = inputValue.charAt(0);
    onChange(newValue);
    
    // Move to the next input if a character is entered
    if (inputValue && index < pinLength - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, pinLength);
    const newPin = Array(pinLength).fill('');
    for (let i = 0; i < pasteData.length; i++) {
        newPin[i] = pasteData[i];
    }
    onChange(newPin);
  };

  return (
    <div className="flex justify-center space-x-2" onPaste={handlePaste}>
      {Array(pinLength).fill('').map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          maxLength={1}
          value={value[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={cn(
            "w-12 h-14 text-center text-lg font-semibold bg-input border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors",
            {
              "border-primary": value[index],
              "border-border": !value[index],
            }
          )}
        />
      ))}
    </div>
  );
}
