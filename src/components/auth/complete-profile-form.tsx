
/**
 * @file src/components/auth/complete-profile-form.tsx
 * @fileoverview This form handles the final step of user registration.
 * After phone verification, users provide their full name, email, and password.
 * This component supports multiple authentication methods:
 * 1. Linking email/password to a phone-verified account.
 * 2. Linking a social provider (Google, Apple) to a phone-verified account.
 * 3. A developer bypass mode to create a new user from scratch without phone verification.
 */

'use client';

// React hooks for state and side-effects.
import React, { useState, useEffect } from 'react';
// Next.js router for navigation.
import { useRouter } from 'next/navigation';
// UI components from ShadCN.
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '../ui/separator';
// Custom hook for displaying toast notifications.
import { useToast } from '@/hooks/use-toast';
// Firebase app instance.
import { auth } from '@/lib/firebase';
// Firebase authentication functions.
import { 
  onAuthStateChanged, 
  type User, 
  EmailAuthProvider, 
  linkWithCredential, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  linkWithPopup,
  updateProfile
} from 'firebase/auth';
// Server action to save user profile data to Firestore.
import { completeUserProfile } from '@/lib/actions';
// Icons from lucide-react and react-icons.
import { User as UserIcon, Mail, Lock, Loader2, Check, X, Eye, EyeOff } from 'lucide-react';
import { FaGoogle, FaApple } from 'react-icons/fa';
// Utility for conditional class names.
import { cn } from '@/lib/utils';

/**
 * A submit button component that shows a loading spinner when a request is in progress.
 * @param {object} props - Component props.
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
      {pending ? <Loader2 className="animate-spin" /> : 'Complete Sign Up'}
    </Button>
  );
}

/**
 * A component to display and validate password requirements in real-time.
 * @param {object} props - Component props.
 * @param {string} props.password - The current password string from the input.
 * @returns {JSX.Element} A grid of password requirements.
 */
function PasswordRequirements({ password }: { password: string }) {
  // Define the requirements with their regex for validation.
  const requirements = [
    { name: 'length', text: '8-20 characters', regex: /^.{8,20}$/ },
    { name: 'uppercase', text: 'One uppercase letter', regex: /[A-Z]/ },
    { name: 'number', text: 'One number', regex: /[0-9]/ },
    { name: 'special', text: 'One special character', regex: /[^A-Za-z0-9]/ },
  ];

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground mt-3">
      {requirements.map((req) => {
        const isValid = req.regex.test(password);
        return (
          // Dynamically change text color based on validity.
          <div key={req.name} className={cn("flex items-center transition-colors", isValid ? 'text-primary' : 'text-muted-foreground')}>
            {isValid ? <Check className="w-4 h-4 mr-1.5" /> : <X className="w-4 h-4 mr-1.5" />}
            {req.text}
          </div>
        );
      })}
    </div>
  );
}

/**
 * The main component for the complete profile form.
 */
export default function CompleteProfileForm() {
  const router = useRouter();
  const { toast } = useToast();
  // State for loading status and bypass mode.
  const [loading, setLoading] = useState(true);
  
  // State for form inputs and visibility toggles.
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * This effect runs on mount to check for an authenticated user and the dev bypass flag.
   * It ensures that only users who have completed phone verification (or used the bypass)
   * can access this page.
   */
  useEffect(() => {
    const bypassFlag = sessionStorage.getItem('devBypass') === 'true';

    // If bypass is active, we don't need to wait for auth state. We can show the form.
    if (bypassFlag) {
        setLoading(false);
        return; // Exit the effect early
    }

    // If no bypass, we MUST have a logged-in user. Let's check.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            // This is the normal, expected flow after phone verification.
            if (currentUser.displayName && currentUser.email) {
                // User is already fully set up, move them along.
                console.log("User profile is already complete. Redirecting to security setup.");
                router.replace('/setup-security');
            } else {
                setLoading(false); // Show the form
                 toast({
                    title: "Phone Verified!",
                    description: "Please complete your profile to continue.",
                });
            }
        } else {
            // No user and no bypass flag. This is an invalid state.
            toast({
                variant: 'destructive',
                title: 'Authentication Required',
                description: 'Please start by signing up.',
            });
            router.replace('/signup');
        }
    });

    // Cleanup the auth state listener on unmount.
    return () => unsubscribe();
  }, [router, toast]);


  /**
   * Handles form submission for creating a profile with email and password.
   * It contains logic to handle both the normal flow (linking) and the bypass flow (creating).
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Frontend validation for password requirements.
    if (password.length < 8 || password.length > 20) {
      setError('Password must be between 8 and 20 characters.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase character.');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number.');
      return;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      setError('Password must contain at least one special character (e.g., !@#$).');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalUser: User;
      const isBypassMode = sessionStorage.getItem('devBypass') === 'true';
      const currentUser = auth.currentUser;
      let finalPhoneNumber = currentUser?.phoneNumber || 'dev-bypass';

      if (isBypassMode && !currentUser) {
        // If in bypass mode and no user exists, create a new user from scratch.
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        finalUser = userCredential.user;
      } else {
        // Otherwise, link the new credentials to the existing phone-authed user.
        if (!currentUser) {
          throw new Error("No authenticated user found. Please sign up again.");
        }
        const credential = EmailAuthProvider.credential(email, password);
        await linkWithCredential(currentUser, credential);
        finalUser = currentUser;
      }
      
      // Update the user's display name in Firebase Authentication.
      await updateProfile(finalUser, { displayName: fullName });
      
      // Call the server action to save the complete user profile to Firestore.
      await completeUserProfile(finalUser.uid, fullName, email, finalPhoneNumber);
      
      // Clean up the bypass flag from session storage after use.
      if (isBypassMode) {
        sessionStorage.removeItem('devBypass');
      }

      toast({
        title: "Profile Created!",
        description: "Now let's secure your account.",
      });
      // Redirect to the next step in the onboarding flow.
      router.push('/setup-security');

    } catch (err: any) {
      console.error("Full Profile Completion Error:", err);
      // Handle common Firebase errors with user-friendly messages.
      if (err.code === 'auth/email-already-in-use' || err.code === 'auth/credential-already-in-use') {
        setError('This email address is already associated with another account.');
      } else if (err.code === 'auth/weak-password') {
          setError('The password is too weak. Please check the requirements.')
      } else if (err.code === 'auth/password-does-not-meet-requirements') {
          setError('Password does not meet the security requirements. Please check all criteria.');
      }
       else if (err.code && err.code.includes('app-check')) {
          setError('App Check validation failed. Please ensure your debug token is configured correctly in the Firebase Console.');
      } else {
        setError(err.message || 'Failed to complete profile. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles sign-in/linking with OAuth providers (Google, Apple).
   * Contains logic for both normal and bypass flows.
   * @param {GoogleAuthProvider | OAuthProvider} provider - The Firebase auth provider instance.
   */
  const handleOAuthSignIn = async (provider: GoogleAuthProvider | OAuthProvider) => {
    setIsSubmitting(true);
    setError(null);
    try {
      let finalUser: User;
      const isBypassMode = sessionStorage.getItem('devBypass') === 'true';
      const currentUser = auth.currentUser;
      let finalPhoneNumber = currentUser?.phoneNumber || 'dev-bypass';

      if (isBypassMode && !currentUser) {
        const result = await signInWithPopup(auth, provider);
        finalUser = result.user;
      } else {
        if (!currentUser) {
            throw new Error("No authenticated user found to link the account to.");
        }
        const result = await linkWithPopup(currentUser, provider);
        finalUser = result.user;
      }
      
      const fullNameFromProvider = finalUser.displayName || '';
      const emailFromProvider = finalUser.email;
      const photoURLFromProvider = finalUser.photoURL;

      if (!emailFromProvider) {
          throw new Error("Could not retrieve email from provider. Please try a different method.");
      }
      
      const updatePayload = { 
        displayName: fullNameFromProvider, 
        photoURL: photoURLFromProvider 
      };

      await updateProfile(finalUser, updatePayload);
      
      // Save the complete profile to Firestore.
      await completeUserProfile(finalUser.uid, fullNameFromProvider, emailFromProvider, finalPhoneNumber);
      
      // Clean up the bypass flag.
      if (isBypassMode) sessionStorage.removeItem('devBypass');

      toast({
          title: "Profile Created!",
          description: "Now let's secure your account.",
      });
      router.push('/setup-security');

    } catch (err: any) {
      console.error("[Cahaya Debug] Full OAuth Error Object:", err);
      if (err.code === 'auth/account-exists-with-different-credential' || err.code === 'auth/credential-already-in-use') {
          setError('This social account is already linked to another user.');
      } else if (err.code && err.code.includes('app-check')) {
          setError('App Check validation failed. Please ensure your debug token is configured correctly in the Firebase Console.');
      }
      else {
          setError(err.message || 'An unknown error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions to trigger the specific OAuth flows.
  const handleGoogleSignIn = () => handleOAuthSignIn(new GoogleAuthProvider());
  const handleAppleSignIn = () => handleOAuthSignIn(new OAuthProvider('apple.com'));

  const handleDevAutofill = () => {
    setFullName('Dev User');
    setEmail('dev@test.com');
    setPassword('Password123!');
    toast({
      title: 'Dev Autofill',
      description: 'Form has been filled with test data.',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
      <div className="space-y-4">
          <Button className="w-full bg-white text-black hover:bg-gray-200 h-14 text-base font-semibold border border-gray-200/50 flex items-center justify-center" type="button" onClick={handleGoogleSignIn} disabled={isSubmitting}>
              <FaGoogle className="mr-3" />
              <span>Continue with Google</span>
          </Button>
          <Button className="w-full bg-black text-white hover:bg-gray-800 h-14 text-base font-semibold flex items-center justify-center" type="button" onClick={handleAppleSignIn} disabled={isSubmitting}>
              <FaApple className="mr-3" />
              <span>Continue with Apple</span>
          </Button>
      </div>
      
      <div className="relative flex items-center justify-center text-sm my-6">
          <Separator className="flex-1 bg-border" />
          <span className="mx-4 text-muted-foreground">Or</span>
          <Separator className="flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
             <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
             <Input 
              id="fullName" 
              name="fullName" 
              type="text" 
              className="bg-input h-14 pl-12 text-base placeholder:text-muted-foreground"
              placeholder="e.g. Budi Santoso"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
           <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              id="email" 
              name="email" 
              type="email" 
              className="bg-input h-14 pl-12 text-base placeholder:text-muted-foreground"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Create Password</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              id="password" 
              name="password" 
              type={isPasswordVisible ? 'text' : 'password'}
              className="bg-input h-14 pl-12 pr-12 text-base placeholder:text-muted-foreground"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              maxLength={20}
            />
            {/* Button to toggle password visibility */}
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onMouseDown={() => setIsPasswordVisible(true)}
              onMouseUp={() => setIsPasswordVisible(false)}
              onMouseLeave={() => setIsPasswordVisible(false)}
              onTouchStart={() => setIsPasswordVisible(true)}
              onTouchEnd={() => setIsPasswordVisible(false)}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            >
              {isPasswordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <PasswordRequirements password={password} />
        </div>
        
        <SubmitButton pending={isSubmitting} />

        {/* Display any submission errors */}
        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
        )}
      </form>
      {process.env.NODE_ENV === 'development' && (
        <div className="text-center mt-4">
          <Button variant="link" onClick={handleDevAutofill} className="text-xs text-muted-foreground hover:text-accent">
            Dev: Autofill Form
          </Button>
        </div>
      )}
    </div>
  );
}
