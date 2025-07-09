
'use client';

import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Loader2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/auth-provider';
import { verifySecurityPin } from '@/lib/actions';

export default function PinEntryPage() {
  const { user } = useAuth();
  const [pin, setPin] = useState(Array(6).fill(''));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPinVisible, setIsPinVisible] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  // --- Multi-input component logic ---
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handlePinChange = (newPin: string[]) => {
    setPin(newPin);
    setError('');
  };

  const handleIndividualInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const inputValue = e.target.value.replace(/[^a-zA-Z0-9]/g, ''); // Sanitize input
    const newPin = [...pin];

    // Handle paste within a single input
    if (inputValue.length > 1) {
        handlePaste(inputValue, index);
        return;
    }

    newPin[index] = inputValue;
    if (inputValue && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
    handlePinChange(newPin);
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (pastedText: string, startIndex: number = 0) => {
    const sanitizedValue = pastedText.replace(/[^a-zA-Z0-9]/g, '');
    const newPin = [...pin];
    for (let i = 0; i < sanitizedValue.length && i < 6; i++) {
        const charIndex = startIndex + i;
        if(charIndex < 6) {
            newPin[charIndex] = sanitizedValue.charAt(i);
        }
    }
    const nextFocus = Math.min(startIndex + sanitizedValue.length, 5);
    inputsRef.current[nextFocus]?.focus();
    handlePinChange(newPin);
  };
  // --- End of multi-input logic ---

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
        // Clear input on failure
        setPin(Array(6).fill(''));
        inputsRef.current[0]?.focus();
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
          <div className="mb-2">
            <div className="flex justify-center items-center gap-2" onPaste={(e) => handlePaste(e.clipboardData.getData('text'))}>
              {Array(6).fill('').map((_, index) => (
                  <React.Fragment key={index}>
                    <Input
                      ref={(el) => (inputsRef.current[index] = el)}
                      type={isPinVisible ? 'text' : 'password'}
                      value={pin[index] || ''}
                      onChange={(e) => handleIndividualInputChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onFocus={(e) => e.target.select()}
                      maxLength={1}
                      className="w-12 h-14 text-center text-xl font-mono"
                      autoComplete="one-time-code"
                      autoFocus={index === 0}
                    />
                    {index === 2 && <div className="w-4 h-1 bg-border rounded-full" />}
                  </React.Fragment>
              ))}
            </div>
            {error && <p className="text-destructive text-sm mt-2 text-center">{error}</p>}
          </div>

          <div className="h-8 flex justify-end items-center pr-1 mb-2">
             <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setIsPinVisible(!isPinVisible)}
                aria-label={isPinVisible ? "Hide PIN" : "Show PIN"}
            >
                {isPinVisible ? <EyeOff size={20} /> : <Eye size={20} />}
             </Button>
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
