
'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { PinInput } from '@/components/ui/pin-input';


// Helper to format the phone number for Firebase
const formatPhoneNumberForFirebase = (phone: string) => {
  if (phone.startsWith('+')) {
    return phone;
  }
  // Remove leading zeros if present, and prepend country code
  return `+62${phone.replace(/^0+/, '')}`;
};


// Mask the phone number for display
const maskPhoneNumber = (phone: string) => {
    const formattedPhone = formatPhoneNumberForFirebase(phone);
    if (formattedPhone.length < 7) return formattedPhone;
    const prefix = formattedPhone.slice(0, 4); // e.g., +628
    const suffix = formattedPhone.slice(-2);
    const masked = '.'.repeat(formattedPhone.length - 6);
    return `${prefix}${masked}${suffix}`;
}


declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: any;
  }
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" className="w-full h-14 text-lg font-semibold" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : 'Verify Phone Number'}
    </Button>
  );
}


export default function VerifyPhoneForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const phone = searchParams.get('phone') || '';
  const next = searchParams.get('next');
  
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [maskedPhone, setMaskedPhone] = useState('');

  const resendVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    if (!phone) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Phone number not provided. Please go back and try again.',
      });
      router.push('/signup');
      return;
    }
    setMaskedPhone(maskPhoneNumber(phone));
  }, [phone, router, toast]);
  

  // Initialize RecaptchaVerifier on component mount
  useEffect(() => {
    const auth = getAuth(app);
    // Ensure this runs only once
    if (!window.recaptchaVerifier) {
      // Position the reCAPTCHA element off-screen
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("reCAPTCHA solved, user can proceed.");
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          toast({
              variant: 'destructive',
              title: 'reCAPTCHA Expired',
              description: 'Please try again.',
          });
        }
      });
    }
    
    // Setup a separate verifier for the resend button
    if (!resendVerifierRef.current) {
        resendVerifierRef.current = new RecaptchaVerifier(auth, 'resend-recaptcha-container', {
            'size': 'invisible',
        });
    }

  }, [toast]);


  // Send the initial verification code
  useEffect(() => {
    const sendVerificationCode = async () => {
      try {
        const auth = getAuth(app);
        const verifier = window.recaptchaVerifier;
        if (!verifier) {
            console.error("Recaptcha verifier not initialized.");
            toast({
                variant: 'destructive',
                title: 'Initialization Error',
                description: 'Could not set up verification. Please refresh and try again.',
            });
            return;
        }

        const formattedPhone = formatPhoneNumberForFirebase(phone);
        const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
        window.confirmationResult = confirmationResult;

        toast({
          title: 'Code Sent!',
          description: `We've sent a 6-digit code to ${maskedPhone}.`,
        });

        // Start the resend cooldown timer
        setResendCooldown(60);

      } catch (error: any) {
        console.error("Error sending verification code:", error);
        let description = 'Could not send verification code. Please try again later.';
        if (error.code === 'auth/invalid-phone-number') {
            description = 'The phone number you entered is not valid. Please go back and correct it.';
        } else if (error.code === 'auth/too-many-requests') {
            description = 'You have requested too many codes. Please try again later.';
        }
        toast({
          variant: 'destructive',
          title: 'Failed to Send Code',
          description: description,
        });
      }
    };

    if (phone) {
        sendVerificationCode();
    }
  }, [phone, maskedPhone, toast]);


  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);


  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
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
          
          if (user) {
            toast({
              title: 'Phone Verified!',
              description: 'Your phone number has been successfully verified.',
            });
            
            // On successful verification, redirect to the next step
            router.push(next || '/complete-profile');
          } else {
              throw new Error("User not found after confirmation.");
          }
    
        } catch (error: any) {
          console.error("Error verifying code:", error);
          let description = 'An unexpected error occurred. Please try again.';
          if (error.code === 'auth/invalid-verification-code') {
            description = 'The code you entered is invalid. Please check the code and try again.';
          } else if (error.code === 'auth/code-expired') {
            description = 'The verification code has expired. Please request a new one.';
          }
          toast({
            variant: "destructive",
            title: "Verification Failed",
            description: description,
          });
        } finally {
          setLoading(false);
        }
  };


    const handleResendCode = async () => {
        if (resendCooldown > 0) return;
        if (!resendVerifierRef.current) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Cannot resend code. Please refresh the page.'
            });
            return;
        }

    setIsResending(true);
        
        try {
            const auth = getAuth(app);
            const formattedPhone = formatPhoneNumberForFirebase(phone);
            const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, resendVerifierRef.current);
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
                description = 'You have requested too many codes. Please try again later.';
            }
            toast({
              variant: "destructive",
              title: "Resend Failed",
              description: description,
            });
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
                  {isResending ? 'Sending...' : (resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code')}
                </Button>
              </p>
           </div>
           {/* These containers are required for Firebase Auth reCAPTCHA */}
           <div id="recaptcha-container" style={{ position: 'absolute', bottom: '-100px', right: '0' }}></div>
           <div id="resend-recaptcha-container" style={{ position: 'absolute', bottom: '-200px', right: '0' }}></div>
        </div>
    );
}
