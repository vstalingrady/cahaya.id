'use client';

import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PinInput = ({
  value,
  onChange,
  idPrefix,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  idPrefix: string;
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value: inputValue } = e.target;
    // Allow alphanumeric characters only
    const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');

    if (sanitizedValue.length > 1) {
      handlePaste(sanitizedValue);
      return;
    }
    
    const newPin = [...value];
    newPin[index] = sanitizedValue;
    onChange(newPin);

    // Move to next input if a character is entered
    if (sanitizedValue && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && value[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (pastedValue: string) => {
    const sanitizedValue = pastedValue.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
    const newPin = [...value]; // start with current value
    for (let i = 0; i < sanitizedValue.length; i++) {
        newPin[i] = sanitizedValue[i];
    }
    onChange(newPin);

    const focusIndex = Math.min(sanitizedValue.length, 7);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleWrapperPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      handlePaste(pastedText);
  }

  return (
    <div className="flex justify-between items-center gap-1" onPaste={handleWrapperPaste}>
      {Array(8)
        .fill('')
        .map((_, index) => (
          <React.Fragment key={index}>
            <Input
              ref={(el) => (inputRefs.current[index] = el)}
              id={`${idPrefix}-${index}`}
              type="text"
              inputMode="text"
              maxLength={1}
              value={value[index]}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-12 text-center text-xl font-mono"
              autoComplete="one-time-code"
            />
            {index === 3 && (
              <span className="text-2xl text-muted-foreground font-mono px-1">-</span>
            )}
          </React.Fragment>
        ))}
    </div>
  );
};

export default function SetupSecurityForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [pin, setPin] = useState(Array(8).fill(''));
  const [confirmPin, setConfirmPin] = useState(Array(8).fill(''));

  const handleSetPin = () => {
    const pinString = pin.join('');
    const confirmPinString = confirmPin.join('');

    if (pinString.length < 8) {
      toast({
        variant: 'destructive',
        title: 'PIN is too short',
        description: 'Your Clarity PIN must be 8 characters long.',
      });
      return;
    }
    
    if (pinString !== confirmPinString) {
      toast({
        variant: 'destructive',
        title: 'PIN Mismatch',
        description: 'The PINs you entered do not match. Please try again.',
      });
      return;
    }
    
    setLoading(true);
    // In a real app, you would save the hashed PIN to the database here.
    // For this prototype, we'll just simulate success.
    setTimeout(() => {
        toast({
          title: 'Security Set Up!',
          description: `Your Clarity PIN has been configured.`,
        });
        router.push('/link-account');
        setLoading(false);
    }, 1000);
  };
  
  const isSubmitDisabled = pin.join('').length < 8 || confirmPin.join('').length < 8 || loading;

  return (
    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10 relative z-10">
      <form onSubmit={(e) => { e.preventDefault(); handleSetPin(); }} className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="pin-0">Create 8-Character PIN</Label>
            <PinInput idPrefix="pin" value={pin} onChange={setPin} />
        </div>

        <div className="space-y-2">
            <Label htmlFor="confirmPin-0">Confirm PIN</Label>
            <PinInput idPrefix="confirmPin" value={confirmPin} onChange={setConfirmPin} />
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
