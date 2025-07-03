'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Phone } from 'lucide-react';

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 h-auto"
    >
      {pending ? 'Sending Code...' : 'Send Verification Code'}
    </Button>
  );
}

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: any;
  }
}

export default function SignupForm() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
        'expired-callback': () => {
          setError('reCAPTCHA expired. Please try again.');
        }
      });
      // Render the reCAPTCHA widget
      window.recaptchaVerifier.render().catch(err => console.error("Recaptcha render error:", err));
    }
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const auth = getAuth(app);
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      window.confirmationResult = confirmationResult;
      router.push(`/verify-phone?phone=${encodeURIComponent(phone)}`);
    } catch (err: any) {
      console.error("Error sending verification code:", err);
      if (err.code === 'auth/invalid-api-key') {
        setError('Firebase configuration is invalid. Please ensure your API keys in the .env file are correct.');
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
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
              required
            />
          </div>
        </div>
        
        <SubmitButton pending={loading} />

        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
        )}
        <div id="recaptcha-container"></div>
      </form>
    </div>
  );
}
