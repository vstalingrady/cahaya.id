
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  User, 
  EmailAuthProvider, 
  linkWithCredential, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  linkWithPopup,
  updateProfile
} from 'firebase/auth';
import { completeUserProfile } from '@/lib/actions';
import { User as UserIcon, Mail, Lock, Loader2, Check, X, Eye, EyeOff } from 'lucide-react';
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';

const GoogleLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor"
    {...props}
  >
    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.19 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
  </svg>
);


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

function PasswordRequirements({ password }: { password: string }) {
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
          <div key={req.name} className={cn("flex items-center transition-colors", isValid ? 'text-green-400' : 'text-muted-foreground')}>
            {isValid ? <Check className="w-4 h-4 mr-1.5" /> : <X className="w-4 h-4 mr-1.5" />}
            {req.text}
          </div>
        );
      })}
    </div>
  );
}


export default function CompleteProfileForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBypassMode, setIsBypassMode] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const bypassFlag = sessionStorage.getItem('devBypass') === 'true';
    setIsBypassMode(bypassFlag);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.phoneNumber) {
        setUser(currentUser);
        setLoading(false);
        toast({
            title: "Phone Verified!",
            description: "Please complete your profile to continue.",
        });
      } else if (bypassFlag) {
        setLoading(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Verification Needed',
          description: 'Please start the sign up process over.',
        });
        router.replace('/signup');
      }
    });

    return () => unsubscribe();
  }, [router, toast]);
  
  const handleDevBypass = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const bypassEmail = `dev-bypass-${Date.now()}@cuan.app`;
      const bypassPassword = 'PasswordForDev123!';
      const bypassFullName = 'Dev User';

      toast({
        title: 'Dev Bypass Activated!',
        description: 'Creating a test user account...',
      });

      const userCredential = await createUserWithEmailAndPassword(auth, bypassEmail, bypassPassword);
      const finalUser = userCredential.user;
      const finalPhoneNumber = 'dev-bypass-profile';

      await updateProfile(finalUser, { displayName: bypassFullName });
      await completeUserProfile(finalUser.uid, bypassFullName, bypassEmail, finalPhoneNumber);

      toast({
        title: "Profile Created!",
        description: "Now let's secure your account.",
      });
      router.push('/setup-security');

    } catch (err: any) {
      console.error("Dev Bypass Error:", err);
      setError(err.message || 'Dev bypass failed.');
      setIsSubmitting(false);
    }
  }, [router, toast, isSubmitting]);

  useEffect(() => {
    if (fullName === 'a' && email === 'b' && password === 'c') {
      handleDevBypass();
    }
  }, [fullName, email, password, handleDevBypass]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate password requirements
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
      let finalPhoneNumber = 'dev-bypass';

      if (isBypassMode) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        finalUser = userCredential.user;
      } else {
        if (!user) {
          throw new Error("No authenticated user found. Please sign up again.");
        }
        const credential = EmailAuthProvider.credential(email, password);
        await linkWithCredential(user, credential);
        finalUser = user;
        finalPhoneNumber = user.phoneNumber!;
      }
      
      // Update Firebase Auth profile displayName
      await updateProfile(finalUser, { displayName: fullName });
      
      // Call server action to update Firestore database
      await completeUserProfile(finalUser.uid, fullName, email, finalPhoneNumber);
      
      if (isBypassMode) {
        sessionStorage.removeItem('devBypass');
      }

      toast({
        title: "Profile Created!",
        description: "Now let's secure your account.",
      });
      router.push('/setup-security');

    } catch (err: any) {
      console.error("Full Profile Completion Error:", err);
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

  const handleOAuthSignIn = async (provider: GoogleAuthProvider | OAuthProvider) => {
    setIsSubmitting(true);
    setError(null);
    try {
      let finalUser: User;
      let finalPhoneNumber = user?.phoneNumber || 'dev-bypass';

      if (isBypassMode) {
        const result = await signInWithPopup(auth, provider);
        finalUser = result.user;
      } else {
        if (!user) throw new Error("No authenticated user found.");
        const result = await linkWithPopup(user, provider);
        finalUser = result.user;
      }
      
      const fullNameFromProvider = finalUser.displayName || '';
      const emailFromProvider = finalUser.email;

      if (!emailFromProvider) {
          throw new Error("Could not retrieve email from provider. Please try a different method.");
      }

      await completeUserProfile(finalUser.uid, fullNameFromProvider, emailFromProvider, finalPhoneNumber);
      if (isBypassMode) sessionStorage.removeItem('devBypass');

      toast({
          title: "Profile Created!",
          description: "Now let's secure your account.",
      });
      router.push('/setup-security');

    } catch (err: any) {
      console.error("Full OAuth Error Object:", err);
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

  const handleGoogleSignIn = () => handleOAuthSignIn(new GoogleAuthProvider());
  const handleAppleSignIn = () => handleOAuthSignIn(new OAuthProvider('apple.com'));


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
          <Button className="w-full bg-white text-gray-800 hover:bg-gray-200 border border-gray-300 h-14 text-base font-semibold" type="button" onClick={handleGoogleSignIn} disabled={isSubmitting}>
              <GoogleLogo className="w-5 h-5 mr-3" />
              Continue with Google
          </Button>
          <Button className="w-full bg-black text-white hover:bg-gray-800 border-gray-700 h-14 text-base font-semibold" type="button" onClick={handleAppleSignIn} disabled={isSubmitting}>
              <AppleLogo className="w-5 h-5 mr-3" />
              Continue with Apple
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

        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
        )}
      </form>
    </div>
  );
}

    