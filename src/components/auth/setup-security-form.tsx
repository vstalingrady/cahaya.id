
'use client';

import React, { useState, useRef, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setSecurityPin } from '@/lib/actions';
import { auth } from '@/lib/firebase';

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
  onComplete,
  blurOnComplete,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  idPrefix: string;
  focusedIndex: number;
  onFocusChange: (index: number) => void;
  onComplete?: () => void;
  blurOnComplete?: boolean;
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Effect to handle focusing inputs programmatically when parent state changes
  useEffect(() => {
    if (focusedIndex >= 0 && focusedIndex < 6) {
      inputRefs.current[focusedIndex]?.focus();
    }
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

    if (newPin.join('').length === 6) {
      onComplete?.();
      if (blurOnComplete) {
        inputRefs.current[newFocusIndex]?.blur();
      }
    }
  };

  const handleWrapperPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      const activeIndex = inputRefs.current.findIndex(ref => ref === document.activeElement);
      handlePaste(pastedText, activeIndex >= 0 ? activeIndex : 0);
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value: inputValue } = e.target;
    
    if (inputValue.length > 1) {
        handlePaste(inputValue, index);
        return;
    }

    const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');
    const newPin = [...value];
    newPin[index] = sanitizedValue;
    onChange(newPin);

    if (sanitizedValue) {
      if (index < 5) {
        onFocusChange(index + 1);
      } else if (index === 5) {
        onComplete?.();
        if (blurOnComplete) {
          inputRefs.current[index]?.blur();
        }
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && value[index] === '' && index > 0) {
      onFocusChange(index - 1);
    }
  };
  
  return (
    <div className="flex justify-between items-center gap-2" onPaste={handleWrapperPaste}>
      {Array(6)
        .fill('')
        .map((_, index) => {
            const displayValue = focusedIndex === index ? value[index] : (value[index] ? '●' : '');

            return (
              <React.Fragment key={`${idPrefix}-${index}`}>
                <Input
                  ref={(el) => (inputRefs.current[index] = el)}
                  id={`${idPrefix}-${index}`}
                  type="text" 
                  inputMode="text"
                  value={displayValue}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={() => onFocusChange(index)}
                  onBlur={() => onFocusChange(-1)}
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

  const [pin, setPin] = useState(Array(6).fill(''));
  const [pinFocusedIndex, setPinFocusedIndex] = useState(0);
  const [confirmPin, setConfirmPin] = useState(Array(6).fill(''));
  const [confirmPinFocusedIndex, setConfirmPinFocusedIndex] = useState(-1);

  const handleSetPin = async () => {
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
      setConfirmPin(Array(6).fill(''));
      setConfirmPinFocusedIndex(0);
      return;
    }
    
    setLoading(true);

    const currentUser = auth.currentUser;
    if (!currentUser) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'User session not found. Please try logging in again.',
        });
        setLoading(false);
        router.push('/login');
        return;
    }

    try {
        await setSecurityPin(currentUser.uid, pinString);
        toast({
          title: 'Security Set Up!',
          description: `Your Clarity PIN has been configured.`,
        });
        router.push('/dashboard');
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error setting PIN',
            description: error.message || 'Could not save your PIN.',
        });
    } finally {
        setLoading(false);
    }
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
                onComplete={() => {
                    setPinFocusedIndex(-1);
                    setConfirmPinFocusedIndex(0);
                }}
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
                blurOnComplete={true}
                onComplete={() => {
                    setConfirmPinFocusedIndex(-1);
                }}
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
