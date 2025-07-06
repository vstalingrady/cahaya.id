
/**
 * @file src/components/auth/signup-form.tsx
 * @fileoverview The form component for the first step of user registration,
 * which involves capturing and verifying the user's phone number via Firebase
 * Phone Authentication. It includes an invisible reCAPTCHA for security and
 * a developer bypass for easier testing.
 */

'use client';

// React hooks for state and side-effects.
import { useState, useEffect, useRef } from 'react';
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

// Extend the global Window interface to include the confirmationResult for Firebase Auth.
// This is necessary to store the result of signInWithPhoneNumber and access it on the next page.
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
  // A ref to hold the Firebase reCAPTCHA verifier instance.
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  /**
   * This effect initializes the invisible reCAPTCHA verifier when the component mounts.
   */
  useEffect(() => {
    const auth = getAuth(app);
    // Prevents re-creating the verifier on re-renders
    if (recaptchaVerifierRef.current) return;

    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
            console.log('reCAPTCHA challenge successfully solved.');
        },
        'expired-callback': () => {
            setError('reCAPTCHA verification expired. Please try sending the code again.');
        }
    });

    // Store the verifier instance in a ref to access it in the submit handler.
    recaptchaVerifierRef.current = verifier;
    
    // Explicitly render the verifier to ensure it's ready on submit.
    verifier.render().catch((renderError) => {
        console.error("reCAPTCHA render error:", renderError);
        setError("Could not initialize security check. Please refresh the page.");
    });
    
    // Cleanup function to clear the reCAPTCHA instance when the component unmounts.
    return () => {
      verifier.clear();
    };
  }, []);

  /**
   * Formats a phone number string into the E.164 format required by Firebase.
   * @param {string} phoneNumber - The phone number string from the input.
   * @returns {string} The formatted phone number (e.g., "+6281234567890").
   */
  const formatPhoneNumberForFirebase = (phoneNumber: string): string => {
    // Remove all non-digit characters and prepend a '+'
    return `+${phoneNumber.replace(/\D/g, '')}`;
  };

  /**
   * This effect implements a developer bypass to skip phone verification for testing.
   * If the user enters the specific bypass phone number, it redirects them.
   */
  useEffect(() => {
    const formattedPhone = formatPhoneNumberForFirebase(phone);
    if (formattedPhone === '+62000000000000') {
        toast({
            title: 'Dev Account Bypass',
            description: 'Skipping phone verification step.',
        });
        // Set a flag in session storage to be checked on the next page.
        sessionStorage.setItem('devBypass', 'true');
        router.push('/complete-profile');
    }
  // We only want this to run when the phone number changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);

  /**
   * Handles changes to the phone number input field, formatting the input
   * with dashes for better readability while maintaining the country code.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    // Prevent the user from deleting the "+62 " prefix.
    if (!value.startsWith('+62 ')) {
      setPhone('+62 ');
      return;
    }
    
    // Extract only the numeric digits after the prefix.
    const rawNumbers = value.substring(4).replace(/\D/g, '');
    
    // Limit the number of digits to a standard Indonesian phone number length.
    const trimmedNumbers = rawNumbers.slice(0, 12);

    // Group the numbers into chunks for formatting (e.g., 812-3456-7890).
    const chunks = [];
    if (trimmedNumbers.length > 0) chunks.push(trimmedNumbers.slice(0, 3));
    if (trimmedNumbers.length > 3) chunks.push(trimmedNumbers.slice(3, 7));
    if (trimmedNumbers.length > 7) chunks.push(trimmedNumbers.slice(7));

    // Update the state with the formatted number.
    setPhone(`+62 ${chunks.join('-')}`);
  };

  /**
   * Handles the form submission to send the verification code.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formattedPhone = formatPhoneNumberForFirebase(phone);
    const verifier = recaptchaVerifierRef.current;
    
    // Ensure the reCAPTCHA verifier is ready.
    if (!verifier) {
      setError("reCAPTCHA verifier not ready. Please wait a moment and try again.");
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth(app);
      
      // Call Firebase to send the SMS verification code.
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      // Store the result on the window object to be used on the verification page.
      window.confirmationResult = confirmationResult;
      
      // Redirect to the verification page, passing the phone number for display.
      router.push(`/verify-phone?phone=${encodeURIComponent(phone)}`);
    } catch (err: any) {
      console.error("Error sending code:", err);
      
      // Handle common Firebase authentication errors with user-friendly messages.
      let errorMessage = 'Failed to send verification code. Please try again.';
      if (err.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format. Please check your number.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/error-code:-39' || (err.message && (err.message.includes('auth/error-code') || err.message.includes('app-check')))) {
        errorMessage = "App security check failed. This often means Phone Sign-In isn't enabled in your Firebase project or App Check is misconfigured. Check the browser console for a debug token to add to your Firebase project settings.";
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
        
        {/* Display any errors that occur. */}
        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
        )}
      </form>
      {/* This div is the container for the invisible reCAPTCHA widget. */}
      <div id="recaptcha-container" />
    </div>
  );
}
