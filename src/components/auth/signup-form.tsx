'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Phone, Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
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
            'size': 'invisible',
            'callback': () => {
                console.log("reCAPTCHA challenge solved.");
            },
            'expired-callback': () => {
                setError('reCAPTCHA expired. Please try again.');
            }
        });
        
        recaptchaVerifierRef.current = verifier;
    }
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // --- DEVELOPER BYPASS LOGIC ---
    if (phone.toLowerCase() === 'dev-bypass') {
      sessionStorage.setItem('dev-bypass-mode', 'true');
      toast({
        title: 'Developer Bypass Activated',
        description: 'Skipping phone verification and proceeding to profile creation.',
      });
      router.push('/complete-profile');
      return;
    }
    // --- END DEVELOPER BYPASS LOGIC ---

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
      console.error("Error sending code:", err);
      let errorMessage = err.message || 'Failed to send verification code. Please try again.';
      if (err.code === 'auth/invalid-api-key') {
        errorMessage = 'Firebase configuration is invalid. Please check your .env file.';
      } else if (err.code === 'auth/captcha-check-failed') {
         errorMessage = 'reCAPTCHA check failed due to an environment issue.';
         // Auto-fill the test number to guide the user
         setPhone('+1 650-555-3434');
      } else if (err.code === 'auth/invalid-phone-number') {
        errorMessage = 'The phone number is not valid. Please use the E.164 format (e.g., +6281234567890).';
      } else if (err.code === 'auth/too-many-requests') {
          errorMessage = "Too many attempts. Please wait a while before trying again or use the test number.";
      }
      setError(errorMessage);
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
        
        <Alert variant="default" className="bg-secondary border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary font-bold">Stuck? Use Developer Bypass</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            If reCAPTCHA fails, enter <code className="font-mono text-white bg-background p-1 rounded-md">dev-bypass</code> as the phone number to skip this step.
          </AlertDescription>
        </Alert>

        {/* The ref is attached here. It's invisible. */}
        <div ref={recaptchaContainerRef}></div>

        <SubmitButton pending={loading} />

        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
        )}
      </form>
    </div>
  );
}
