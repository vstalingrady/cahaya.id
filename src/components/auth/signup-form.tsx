'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Phone, Loader2 } from 'lucide-react';

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 h-auto"
    >
      {pending ? <Loader2 className="animate-spin" /> : 'Send Verification Code'}
    </Button>
  );
}

declare global {
  interface Window {
    confirmationResult: ConfirmationResult;
  }
}

export default function SignupForm() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const auth = getAuth(app);
    
    // Initialize reCAPTCHA only once
    if (!recaptchaVerifierRef.current && recaptchaContainerRef.current) {
        const verifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
            'size': 'normal',
            'callback': (response: any) => {
                console.log("reCAPTCHA challenge successfully solved.");
                setError(null);
            },
            'expired-callback': () => {
                setError('reCAPTCHA expired. Please try again.');
            }
        });
        
        verifier.render().catch(err => {
            console.error("Recaptcha render error:", err);
            setError("Failed to render reCAPTCHA. Check your browser's ad-blocker or privacy settings.");
        });

        recaptchaVerifierRef.current = verifier;
    }

    // Cleanup on component unmount
    return () => {
        if (recaptchaVerifierRef.current) {
            recaptchaVerifierRef.current.clear();
        }
    };
  }, []); // Empty dependency array ensures this runs only once

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const verifier = recaptchaVerifierRef.current;
    if (!verifier) {
        setError("reCAPTCHA verifier not initialized. Please refresh the page.");
        setLoading(false);
        return;
    }

    try {
      const auth = getAuth(app);
      const confirmationResult = await signInWithPhoneNumber(auth, phone, verifier);
      window.confirmationResult = confirmationResult;
      router.push(`/verify-phone?phone=${encodeURIComponent(phone)}`);
    } catch (err: any) {
      if (err.code === 'auth/invalid-api-key') {
        setError('Firebase configuration is invalid. Please check your .env file.');
      } else if (err.code === 'auth/captcha-check-failed') {
         setError('reCAPTCHA check failed. Please check two things in your Firebase project: 1) "localhost" is in "Authentication > Settings > Authorized domains". 2) The "Phone" provider is enabled in "Authentication > Sign-in method".');
      } else if (err.code === 'auth/invalid-phone-number') {
        setError('The phone number is not valid. Please use the E.164 format (e.g., +6281234567890).');
      } else {
        setError(err.message || 'Failed to send verification code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
      <form onSubmit={handleSendCode} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
           <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              id="phone" 
              name="phone" 
              type="tel" 
              className="bg-input h-14 text-lg pl-12"
              placeholder="e.g., +6281234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>
        
        {/* The ref is attached here */}
        <div ref={recaptchaContainerRef} className="flex justify-center"></div>

        <SubmitButton pending={loading} />

        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
        )}
      </form>
    </div>
  );
}
