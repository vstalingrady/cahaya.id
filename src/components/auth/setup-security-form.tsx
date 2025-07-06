
'use client';

import React, { useState, useRef, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * A controlled component for a 6-digit PIN input that masks characters as you type.
 * Focus and value are controlled by the parent component.
 */
const PinInput = ({
  value,
  onChange,
  idPrefix,
  focusedIndex,
  onFocusChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  idPrefix: string;
  focusedIndex: number;
  onFocusChange: (index: number) => void;
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Effect to handle focusing inputs programmatically when parent state changes
  useEffect(() => {
    inputRefs.current[focusedIndex]?.focus();
  }, [focusedIndex]);

  const handlePaste = (pastedValue: string, startIndex: number) => {
    const sanitizedValue = pastedValue.replace(/[^a-zA-Z0-9]/g, '');
    const newPin = [...value];
    
    for (let i = 0; i < sanitizedValue.length && startIndex + i < 6; i++) {
        newPin[startIndex + i] = sanitizedValue.charAt(i);
    }
    onChange(newPin);

    const newFocusIndex = Math.min(startIndex + sanitizedValue.length, 5);
    onFocusChange(newFocusIndex);
  };

  const handleWrapperPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      // Find the currently active input to determine the paste start index
      const activeIndex = inputRefs.current.findIndex(ref => ref === document.activeElement);
      handlePaste(pastedText, activeIndex >= 0 ? activeIndex : 0);
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value: inputValue } = e.target;
    
    // Handle pasting directly into the input
    if (inputValue.length > 1) {
        handlePaste(inputValue, index);
        return;
    }

    const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');
    const newPin = [...value];
    newPin[index] = sanitizedValue;
    onChange(newPin);

    // Move focus to the next input if a character is entered
    if (sanitizedValue && index < 5) {
      onFocusChange(index + 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move focus backward on backspace if the current input is empty
    if (e.key === 'Backspace' && value[index] === '' && index > 0) {
      onFocusChange(index - 1);
    }
  };
  
  return (
    <div className="flex justify-between items-center gap-2" onPaste={handleWrapperPaste}>
      {Array(6)
        .fill('')
        .map((_, index) => {
            // The character is revealed only if the input is currently focused
            const displayValue = focusedIndex === index ? value[index] : (value[index] ? '●' : '');

            return (
              <React.Fragment key={`${idPrefix}-${index}`}>
                <Input
                  ref={(el) => (inputRefs.current[index] = el)}
                  id={`${idPrefix}-${index}`}
                  type="text" // Using text to control visibility (● vs char)
                  inputMode="text"
                  value={displayValue}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={() => onFocusChange(index)}
                  className="w-12 h-14 text-center text-xl font-mono"
                  autoComplete="one-time-code"
                />
              </React.Fragment>
            )
        })}
    </div>
  );
};

export default function SetupSecurityForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Lifted state for both PIN inputs and their focused indices
  const [pin, setPin] = useState(Array(6).fill(''));
  const [pinFocusedIndex, setPinFocusedIndex] = useState(0);
  const [confirmPin, setConfirmPin] = useState(Array(6).fill(''));
  const [confirmPinFocusedIndex, setConfirmPinFocusedIndex] = useState(0);

  const handleSetPin = () => {
    const pinString = pin.join('');
    const confirmPinString = confirmPin.join('');

    if (pinString.length < 6) {
      toast({
        variant: 'destructive',
        title: 'PIN is too short',
        description: 'Your Clarity PIN must be 6 characters long.',
      });
      return;
    }
    
    if (pinString !== confirmPinString) {
      toast({
        variant: 'destructive',
        title: 'PIN Mismatch',
        description: 'The PINs you entered do not match. Please try again.',
      });
      // Clear the confirmation field and reset its focus for better UX
      setConfirmPin(Array(6).fill(''));
      setConfirmPinFocusedIndex(0);
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
        toast({
          title: 'Security Set Up!',
          description: `Your Clarity PIN has been configured.`,
        });
        router.push('/link-account');
        setLoading(false);
    }, 1000);
  };
  
  const isSubmitDisabled = pin.join('').length < 6 || confirmPin.join('').length < 6 || loading;

  return (
    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10 relative z-10">
      <form onSubmit={(e) => { e.preventDefault(); handleSetPin(); }} className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="pin-0">Create 6-Character PIN</Label>
            <PinInput 
                idPrefix="pin" 
                value={pin} 
                onChange={setPin}
                focusedIndex={pinFocusedIndex}
                onFocusChange={setPinFocusedIndex}
            />
        </div>

        <div className="space-y-2">
            <Label htmlFor="confirmPin-0">Confirm PIN</Label>
            <PinInput 
                idPrefix="confirmPin"
                value={confirmPin}
                onChange={setConfirmPin}
                focusedIndex={confirmPinFocusedIndex}
                onFocusChange={setConfirmPinFocusedIndex}
            />
        </div>
        
        <Button 
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 h-auto"
        >
            {loading ? <Loader2 className="animate-spin" /> : 'Set & Continue'}
        </Button>
      </form>
    </div>
  );
}
