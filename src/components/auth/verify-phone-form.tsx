/**
 * @file src/components/auth/verify-phone-form.tsx
 * @fileoverview A form component for users to enter the 6-digit OTP (One-Time Password)
 * sent to their phone to verify their identity. It includes a developer bypass
 * using a "master code" for easier testing.
 */

'use client';

// React hooks for state management.
import { useState } from 'react';
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
 * The main component for the phone verification form.
 * @returns {JSX.Element} The rendered verification form.
 */
export default function VerifyPhoneForm() {
  // Hooks for routing and showing notifications.
  const router = useRouter();
  const { toast } = useToast();
  // State for the verification code input and loading status.
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handles the form submission to verify the entered OTP code.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // This is a developer bypass to skip OTP verification with a "master code".
    // This provides a second entry point to the bypass flow for testing.
    if (code === '000000') {
      toast({
        title: 'Dev Bypass Activated',
        description: 'Skipping phone verification.',
      });
      // Set a flag in session storage to be checked on the next page.
      sessionStorage.setItem('devBypass', 'true');
      router.push('/complete-profile');
      return;
    }

    try {
      // The `window.confirmationResult` is set on the previous page after successfully
      // calling `signInWithPhoneNumber`. If it's not present, the session is invalid.
      if (!window.confirmationResult) {
        toast({
          variant: 'destructive',
          title: 'Verification Expired',
          description: 'The verification session was not found. Please go back and try sending the code again.',
        });
        setLoading(false);
        return;
      }
      
      // Use the confirmationResult object to confirm the user's entered code.
      const result = await window.confirmationResult.confirm(code);
      
      toast({
        title: 'Success!',
        description: 'Your phone number has been verified.',
      });

      console.log("Phone verification successful, user:", result.user);

      // On success, navigate to the profile completion page.
      router.push('/complete-profile');

    } catch (err: any) {
      console.error("Error verifying code:", err);
      // Handle common Firebase errors with user-friendly messages.
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

  return (
    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
      <form onSubmit={handleVerifyCode} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="code">Verification Code</Label>
          <Input 
            id="code" 
            name="code" 
            type="tel" // Use "tel" to encourage numeric keyboard on mobile devices.
            className="bg-input h-14 text-center text-2xl tracking-[1em] placeholder:text-muted-foreground" 
            placeholder="------"
            maxLength={6}
            value={code}
            // Ensure only digits can be entered.
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            required
            inputMode="numeric"
            autoComplete="one-time-code" // Helps with browser autofill.
          />
        </div>
        
        <SubmitButton pending={loading} />
      </form>
    </div>
  );
}
