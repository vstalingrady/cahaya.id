
/**
 * @file src/components/auth/signup-form.tsx
 * @fileoverview The form component for the first step of user registration,
 * which involves capturing and verifying the user's phone number via Firebase
 * Phone Authentication. It includes an invisible reCAPTCHA for security and
 * a developer bypass for easier testing.
 */

'use client';

// React hooks for state and side-effects.
import { useState, useEffect } from 'react';
// Next.js router for navigation.
import { useRouter } from 'next/navigation';
// UI components from ShadCN.
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Firebase authentication functions.
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
// Firebase app instance initialized in firebase.ts.
import { app } from '@/lib/firebase';
// Icons from lucide-react.
import { Phone, Loader2 } from 'lucide-react';
// Custom hook for displaying toast notifications.
import { useToast } from '@/hooks/use-toast';

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
      {pending ? <Loader2 className="animate-spin" /> : 'Send Verification Code'}
    </Button>
  );
}

// Extend the global Window interface to include Firebase Auth objects.
// This allows passing them between pages during the verification flow.
declare global {
  interface Window {
    confirmationResult: ConfirmationResult;
  }
}

/**
 * The main signup form component.
 * @returns {JSX.Element} The rendered signup form.
 */
export default function SignupForm() {
  // Hooks for routing and showing notifications.
  const router = useRouter();
  const { toast } = useToast();
  // State for the phone number input, error messages, and loading status.
  const [phone, setPhone] = useState('+62 ');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifier, setVerifier] = useState<RecaptchaVerifier | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    // Ensure this runs only on the client
    if (typeof window !== 'undefined' && !verifier) {
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          console.log('reCAPTCHA solved.');
        },
        'expired-callback': () => {
          toast({
            variant: 'destructive',
            title: 'reCAPTCHA Expired',
            description: 'Please try sending the code again.',
          });
        },
      });
      setVerifier(recaptchaVerifier);

      // We don't need a cleanup function here because the verifier is meant to persist
      // for the component's lifecycle. Re-creating it can cause issues.
    }
  }, [toast, verifier]);


  /**
   * Formats a phone number string into the E.164 format required by Firebase.
   * @param {string} phoneNumber - The phone number string from the input.
   * @returns {string} The formatted phone number (e.g., "+6281234567890").
   */
  const formatPhoneNumberForFirebase = (phoneNumber: string): string => {
    return `+${phoneNumber.replace(/\D/g, '')}`;
  };

  /**
   * Handles changes to the phone number input field, formatting the input
   * with dashes for better readability while maintaining the country code.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (!value.startsWith('+62 ')) {
      // Prevent loop if the value is already the default
      if (phone !== '+62 ') {
        setPhone('+62 ');
      }
      return;
    }

    const rawNumbers = value.substring(4).replace(/\D/g, '');
    const trimmedNumbers = rawNumbers.slice(0, 12);
    const chunks = [];
    if (trimmedNumbers.length > 0) chunks.push(trimmedNumbers.slice(0, 3));
    if (trimmedNumbers.length > 3) chunks.push(trimmedNumbers.slice(3, 7));
    if (trimmedNumbers.length > 7) chunks.push(trimmedNumbers.slice(7));
    
    const formattedPhone = `+62 ${chunks.join('-')}`;

    // Only update state if the formatted value is different to prevent an infinite loop.
    if (formattedPhone !== phone) {
      setPhone(formattedPhone);
    }
  };

  /**
   * Handles the form submission to send the verification code.
   * Creates the reCAPTCHA verifier on-demand.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!verifier) {
      setError("reCAPTCHA not ready. Please wait a moment and try again.");
      setLoading(false);
      return;
    }

    const auth = getAuth(app);
    const formattedPhone = formatPhoneNumberForFirebase(phone);
    
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      // Store the result on the window object to be used on the verification page.
      window.confirmationResult = confirmationResult;
      
      router.push(`/verify-phone?phone=${encodeURIComponent(phone)}`);
    } catch (err: any) {
      console.error("Error sending code:", err);
      let errorMessage = 'Failed to send verification code. Please try again.';

      if (err.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format. Please check your number.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (err.code === 'auth/internal-error') {
        errorMessage = "An internal error occurred. Please ensure Phone Sign-In is enabled in your Firebase project and that your App Check configuration is correct.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
      <form onSubmit={handleSendCode} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              id="phone" 
              name="phone" 
              type="tel" 
              className="bg-input h-14 text-lg pl-12"
              placeholder="+62 000-0000-00000"
              value={phone}
              onChange={handlePhoneChange}
              required
            />
          </div>
        </div>
        
        <SubmitButton pending={loading} />
        
        {error && (
          <p className="mt-4 text-sm text-red-500 text-center whitespace-pre-line">{error}</p>
        )}
      </form>
      {/* This div is the container for the invisible reCAPTCHA widget. */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
