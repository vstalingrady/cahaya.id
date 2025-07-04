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
  const [recaptchaInitialized, setRecaptchaInitialized] = useState(false);
  
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    let verifier: RecaptchaVerifier;

    if (!recaptchaVerifierRef.current) {
        try {
            verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': () => {
                    console.log("reCAPTCHA challenge solved.");
                },
                'expired-callback': () => {
                    setError('reCAPTCHA expired. Please try again.');
                }
            });

            recaptchaVerifierRef.current = verifier;
            setRecaptchaInitialized(true);
        } catch (err: any) {
            console.error("Error initializing reCAPTCHA:", err);
            setError("Failed to initialize reCAPTCHA. Please refresh the page.");
        }
    }

    // Cleanup function
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
      }
    };
  }, []);

  const formatPhoneNumber = (phoneNumber: string): string => {
    // Remove any non-digit characters except the leading +
    let formatted = phoneNumber.replace(/[^\d+]/g, '');
    
    // If it doesn't start with +, add +62 for Indonesia
    if (!formatted.startsWith('+')) {
      // Remove leading 0 if present
      if (formatted.startsWith('0')) {
        formatted = formatted.substring(1);
      }
      formatted = '+62' + formatted;
    }
    
    return formatted;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!recaptchaInitialized) {
      setError("reCAPTCHA not initialized. Please refresh the page.");
      setLoading(false);
      return;
    }

    const verifier = recaptchaVerifierRef.current;
    if (!verifier) {
      setError("reCAPTCHA verifier not initialized. Please refresh the page.");
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth(app);
      const formattedPhone = formatPhoneNumber(phone);
      
      console.log("Attempting to send code to:", formattedPhone);
      
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      window.confirmationResult = confirmationResult;
      
      console.log("Code sent successfully");
      router.push(`/verify-phone?phone=${encodeURIComponent(formattedPhone)}`);
    } catch (err: any) {
      console.error("Error sending code:", err);
      
      if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format. Please check your number.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      } else if (err.code === 'auth/captcha-check-failed') {
        setError('Security check failed. Ensure your app environment is authorized in the Firebase console.');
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
              placeholder="e.g., +6281234567890 or 081234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>
        
        {/* This div is now the target for reCAPTCHA, found by its ID */}
        <div id="recaptcha-container"></div>
        
        <SubmitButton pending={loading} />
        
        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
        )}
      </form>
    </div>
  );
}
