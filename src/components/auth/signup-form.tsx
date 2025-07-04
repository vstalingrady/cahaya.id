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
  const [phone, setPhone] = useState('+62 ');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const auth = getAuth(app);
    let verifier: RecaptchaVerifier;

    if (!recaptchaVerifierRef.current && recaptchaContainerRef.current) {
      verifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        size: 'invisible',
        callback: () => { console.log('reCAPTCHA challenge solved.') },
        'expired-callback': () => { setError('reCAPTCHA expired. Please try again.') },
      });
      recaptchaVerifierRef.current = verifier;
      
      verifier.render().then(() => {
        console.log("reCAPTCHA rendered.");
      }).catch((err) => {
        console.error("reCAPTCHA render error:", err);
        setError("Failed to render reCAPTCHA. Please refresh and try again.");
      });
    }

    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
      }
    };
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    // Don't let user delete the prefix
    if (!value.startsWith('+62 ')) {
      setPhone('+62 ');
      return;
    }
    
    // Get only numbers after prefix
    const rawNumbers = value.substring(4).replace(/\D/g, '');
    
    // Max 12 digits for Indonesian number part
    const trimmedNumbers = rawNumbers.slice(0, 12);

    const chunks = [];
    if (trimmedNumbers.length > 0) chunks.push(trimmedNumbers.slice(0, 3));
    if (trimmedNumbers.length > 3) chunks.push(trimmedNumbers.slice(3, 7));
    if (trimmedNumbers.length > 7) chunks.push(trimmedNumbers.slice(7));

    setPhone(`+62 ${chunks.join('-')}`);
  };

  const formatPhoneNumberForFirebase = (phoneNumber: string): string => {
    // Just remove all non-digit characters and prepend a '+'
    return `+${phoneNumber.replace(/\D/g, '')}`;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const verifier = recaptchaVerifierRef.current;
    if (!verifier) {
      setError("reCAPTCHA verifier not ready. Please wait a moment and try again.");
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth(app);
      const formattedPhone = formatPhoneNumberForFirebase(phone);
      
      console.log("Attempting to send code to:", formattedPhone);
      
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      window.confirmationResult = confirmationResult;
      
      console.log("Code sent successfully");
      router.push(`/verify-phone?phone=${encodeURIComponent(phone)}`);
    } catch (err: any) {
      console.error("Error sending code:", err);
      
      if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format. Please check your number.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      } else if (err.code === 'auth/captcha-check-failed') {
         setError('reCAPTCHA verification failed. Ensure your domain is authorized in the Firebase Console.');
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
              placeholder="+62 812-3456-7890"
              value={phone}
              onChange={handlePhoneChange}
              required
            />
          </div>
        </div>
        
        <div ref={recaptchaContainerRef}></div>
        
        <SubmitButton pending={loading} />
        
        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
        )}
      </form>
    </div>
  );
}
