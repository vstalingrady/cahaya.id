
'use client';

import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/auth-provider';
import { verifySecurityPin } from '@/lib/actions';

/**
 * A controlled component for a 6-digit PIN input that masks characters as you type.
 */
const PinInput = ({
  value,
  onChange,
  idPrefix,
  focusedIndex,
  onFocusChange,
  blurOnComplete,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  idPrefix: string;
  focusedIndex: number;
  onFocusChange: (index: number) => void;
  blurOnComplete?: boolean;
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

    if (newPin.join('').length === 6 && blurOnComplete) {
      inputRefs.current[newFocusIndex]?.blur();
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
      } else if (index === 5 && blurOnComplete) {
        inputRefs.current[index]?.blur();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && value[index] === '' && index > 0) {
      onFocusChange(index - 1);
    }
  };
  
  return (
    <div className="flex justify-center items-center gap-2" onPaste={handleWrapperPaste}>
      {Array(6)
        .fill('')
        .map((_, index) => {
            return (
              <React.Fragment key={`${idPrefix}-${index}`}>
                <Input
                  ref={(el) => (inputRefs.current[index] = el)}
                  id={`${idPrefix}-${index}`}
                  type="password"
                  inputMode="text"
                  value={value[index]}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={() => onFocusChange(index)}
                  onBlur={() => onFocusChange(-1)}
                  className="w-12 h-14 text-center text-xl font-mono"
                  autoComplete="one-time-code"
                />
                 {index === 2 && <div className="w-4 h-1 bg-border rounded-full" />}
              </React.Fragment>
            )
        })}
    </div>
  );
};


export default function PinEntryPage() {
  const { user } = useAuth();
  const [pin, setPin] = useState(Array(6).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Auto-focus the first input on page load
    setFocusedIndex(0);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const pinString = pin.join('');

    if (!user) {
      setError('User session not found. Please log in again.');
      setIsLoading(false);
      router.push('/login');
      return;
    }

    if (pinString.length !== 6) {
      setError('PIN must be 6 characters.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await verifySecurityPin(user.uid, pinString);

      if (result.success) {
        document.cookie = "hasEnteredPin=true; path=/";
        toast({
          title: 'PIN Verified',
          description: 'Welcome to your dashboard.',
        });
        router.push('/dashboard');
      } else {
        setError(result.reason || 'Invalid PIN. Please try again.');
        toast({
          title: 'Error',
          description: result.reason || 'Invalid PIN. Please try again.',
          variant: 'destructive',
        });
        setPin(Array(6).fill(''));
        setFocusedIndex(0);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPin = () => {
    toast({
      title: 'Forgot PIN?',
      description: "You would be redirected to a recovery page.",
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-background text-foreground p-6 flex flex-col justify-center min-h-screen relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground font-serif">Enter Your PIN</h1>
          <p className="text-muted-foreground mt-2">
            For your security, please enter your 6-character PIN to access your dashboard.
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-6">
            <PinInput
                idPrefix="pin"
                value={pin}
                onChange={setPin}
                focusedIndex={focusedIndex}
                onFocusChange={setFocusedIndex}
                blurOnComplete={true}
            />
            {error && <p className="text-destructive text-sm mt-2 text-center">{error}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || pin.join('').length < 6}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enter'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={handleForgotPin} className="text-primary/80 hover:text-primary">
            Forgot PIN?
          </Button>
        </div>
      </div>
    </div>
  );
}
