
/**
 * @file src/components/auth/verify-phone-form.tsx
 * @fileoverview A form component for users to enter the 6-digit OTP (One-Time Password)
 * sent to their phone to verify their identity. It includes a developer bypass
 * using a "master code" for easier testing and a functional "Resend" button.
 */

'use client';

// React hooks for state management.
import React, { useState, useRef, ChangeEvent, KeyboardEvent, useEffect } from 'react';
// Next.js router for navigation.
import { useRouter } from 'next/navigation';
// UI components from ShadCN.
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Icons from lucide-react.
import { Loader2 } from 'lucide-react';
// Custom hook for displaying toast notifications.
import { useToast } from '@/hooks/use-toast';
// Firebase imports for phone auth and reCAPTCHA
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { app, auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

/**
 * A submit button component that shows a loading spinner when a request is pending.
 * @param {object} props - The component props.
 * @param {boolean} props.pending - Whether the form submission is in progress.
 * @returns {JSX.Element} The rendered button.
 */
function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 h-auto"
    >
      {/* Show a loading spinner if pending, otherwise show the button text. */}
      {pending ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify Phone Number'}
    </Button>
  );
}

/**
 * A component for a 6-digit PIN input, with individual boxes.
 * Handles focus shifting, backspacing, and pasting.
 */
const PinInput = ({
  value,
  onChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value: inputValue } = e.target;
    // Allow digits only
    const sanitizedValue = inputValue.replace(/\D/g, '');

    if (sanitizedValue.length > 1) {
      handlePaste(sanitizedValue);
      return;
    }
    
    const newPin = [...value];
    newPin[index] = sanitizedValue;
    onChange(newPin);

    // Move to next input if a character is entered
    if (sanitizedValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && value[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (pastedValue: string) => {
    const sanitizedValue = pastedValue.replace(/\D/g, '').slice(0, 6);
    const newPin = [...value]; // start with current value
    for (let i = 0; i < sanitizedValue.length; i++) {
        newPin[i] = sanitizedValue[i];
    }
    onChange(newPin);

    const focusIndex = Math.min(sanitizedValue.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleWrapperPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      handlePaste(pastedText);
  }

  return (
    <div className="flex justify-between items-center gap-2" onPaste={handleWrapperPaste}>
      {Array(6)
        .fill('')
        .map((_, index) => (
          <React.Fragment key={index}>
            <Input
              ref={(el) => (inputRefs.current[index] = el)}
              id={`code-${index}`}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={value[index]}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-center text-xl font-mono"
              autoComplete="one-time-code"
            />
            {index === 2 && <div className="text-muted-foreground font-semibold">-</div>}
          </React.Fragment>
        ))}
    </div>
  );
};

// Extend the global Window interface to include the confirmationResult for Firebase Auth.
declare global {
  interface Window {
    confirmationResult: ConfirmationResult;
  }
}

/**
 * The main component for the phone verification form.
 */
export default function VerifyPhoneForm({ phone, next }: { phone: string | null, next: string | null }) {
  const router = useRouter();
  const { toast } = useToast();
  const [code, setCode] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [resendVerifier, setResendVerifier] = useState<RecaptchaVerifier | null>(null);

  
  // Cooldown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);
  
  // Verifier setup effect
  useEffect(() => {
    const auth = getAuth(app);
    if (typeof window !== 'undefined' && !resendVerifier) {
      const verifier = new RecaptchaVerifier(auth, 'resend-recaptcha-container', {
        'size': 'invisible'
      });
      setResendVerifier(verifier);
    }
  }, [resendVerifier]);


  const formatPhoneNumberForFirebase = (phoneNumber: string): string => {
    return `+${phoneNumber.replace(/\D/g, '')}`;
  };

  /**
   * Handles the form submission to verify the entered OTP code.
   */
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const pinString = code.join('');

    // This is a developer bypass to skip OTP verification with a "master code".
    if (pinString === '000000') {
      toast({
        title: 'Dev Bypass Activated',
        description: 'Skipping phone verification.',
      });
      sessionStorage.setItem('devBypass', 'true');
      router.push(next || '/complete-profile');
      return;
    }

    try {
      if (!window.confirmationResult) {
        toast({
          variant: 'destructive',
          title: 'Verification Expired',
          description: 'The verification session was not found. Please go back and try sending the code again.',
        });
        setLoading(false);
        return;
      }
      
      const result = await window.confirmationResult.confirm(pinString);
      const user = result.user;

      if (next === '/dashboard') {
         // This is a 2FA login, so log the event
        await setDoc(doc(db, "users", user.uid, "login_history", new Date().toISOString()), {
            timestamp: new Date(),
            ipAddress: "Client-side Login",
            userAgent: "Client-side Login (browser)",
        });
        toast({
            title: 'Login Successful!',
            description: `Welcome back, ${user.displayName || 'User'}!`,
        });
        router.push('/dashboard');
      } else {
        // This is part of the initial signup flow
        toast({
            title: 'Success!',
            description: 'Your phone number has been verified.',
        });
        console.log("Phone verification successful, user:", user);
        router.push('/complete-profile');
      }

    } catch (err: any) {
      console.error("Error verifying code:", err);
      let description = 'Failed to verify code. Please try again.';
      if (err.code === 'auth/invalid-verification-code') {
        description = 'The code you entered is invalid. Please try again.';
      } else if (err.code === 'auth/code-expired') {
        description = 'The verification code has expired. Please request a new one.';
      }
      
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description,
      });

      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isResending) return;
    if (!phone) {
        toast({ variant: 'destructive', title: 'Error', description: 'Phone number not found.' });
        return;
    }
    if (!resendVerifier) {
      toast({ variant: 'destructive', title: 'Error', description: 'reCAPTCHA not ready. Please try again in a moment.' });
      return;
    }

    setIsResending(true);
    
    try {
        const auth = getAuth(app);
        const formattedPhone = formatPhoneNumberForFirebase(phone);
        const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, resendVerifier);
        window.confirmationResult = confirmationResult; // Update the global confirmationResult

        toast({
          title: "Code Resent",
          description: "A new SMS verification code has been sent.",
        });
        setResendCooldown(60); // Reset cooldown to 60 seconds
    } catch (error: any) {
        console.error("Error resending code:", error);
        let description = 'Could not send a new code. Please try again later.';

        if (error.code === 'auth/too-many-requests') {
            description = 'Too many requests have been sent. Please try again later.';
        } else if (error.code === 'auth/internal-error' || error.code === 'auth/operation-not-allowed') {
            description = "A Firebase configuration error occurred. Please check your project settings in the Firebase Console.";
        }
        
        toast({ variant: 'destructive', title: 'Resend Failed', description });
    } finally {
        setIsResending(false);
    }
  };

  return (
    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
      <form onSubmit={handleVerifyCode} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="code-0">Verification Code</Label>
          <PinInput value={code} onChange={setCode} />
        </div>
        
        <SubmitButton pending={loading} />
      </form>
       <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Didn't get a code?{' '}
            <Button
              type="button"
              variant="link"
              onClick={handleResendCode}
              disabled={resendCooldown > 0 || isResending}
              className="font-semibold text-primary/80 hover:text-primary p-0 h-auto disabled:no-underline disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
              {isResending ? 'Sending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend'}
            </Button>
          </p>
      </div>
      {/* This div is the container for the invisible reCAPTCHA widget for resending. */}
      <div id="resend-recaptcha-container"></div>
    </div>
  );
}
