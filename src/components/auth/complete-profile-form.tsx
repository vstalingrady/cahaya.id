'use client';

import { useState, useEffect } from 'react';
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
  linkWithPopup
} from 'firebase/auth';
import { completeUserProfile } from '@/lib/actions';
import { User as UserIcon, Mail, Lock, Loader2 } from 'lucide-react';
import { Separator } from '../ui/separator';

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

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.854 3.188-1.782 4.134-1.135 1.135-2.933 2.544-5.977 2.544-4.557 0-8.28-3.72-8.28-8.28s3.723-8.28 8.28-8.28c2.49 0 4.307.975 5.704 2.345l-2.757 2.757c-.823-.78-1.89-1.32-3.03-1.32-2.75 0-5.02 2.26-5.02 5.02s2.27 5.02 5.02 5.02c3.13 0 4.61-2.26 4.82-3.55h-4.82v.003Z" fill="currentColor"/>
  </svg>
);

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-1.84.043-3.48 1.2-4.425 3.014-1.898 3.637-.495 8.926 1.45 11.97C6.13 22.313 7.333 24 9.13 23.94c1.613-.057 2.115-1.002 3.824-1.002s2.07.945 3.824 1.002c1.753.057 2.883-1.657 3.77-3.023.96-1.532 1.27-3.024 1.27-3.083 0-.028-2.227-1.38-2.255-4.116-.027-2.793 1.896-3.935 2.14-4.144-.99-.95-2.52-1.07-3.02-.91-.848.243-1.613.736-2.17.736zM15.19 4.31C14.34-.178 12.064 0 12.064 0s-.848 2.362.057 3.29c.904.928 2.32 1.27 3.02.822.058 0 .058-.028.058-.028s-.113-1.628-.006-2.07z" fill="currentColor"/>
    </svg>
);


export default function CompleteProfileForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBypassMode, setIsBypassMode] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

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
      console.error("Error completing profile:", err);
      if (err.code === 'auth/email-already-in-use' || err.code === 'auth/credential-already-in-use') {
        setError('This email address is already associated with another account.');
      } else if (err.code === 'auth/weak-password') {
          setError('The password is too weak. It must be at least 6 characters long.')
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
      console.error("Error with OAuth:", err);
      if (err.code === 'auth/account-exists-with-different-credential' || err.code === 'auth/credential-already-in-use') {
          setError('This social account is already linked to another user.');
      } else {
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
              placeholder="e.g. Vstalin Grady"
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
              type="password" 
              className="bg-input h-14 pl-12 text-base placeholder:text-muted-foreground"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
        </div>
        
        <SubmitButton pending={isSubmitting} />

        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
        )}
      </form>
      
      <div className="relative flex items-center justify-center text-sm my-6">
          <Separator className="flex-1 bg-border" />
          <span className="mx-4 text-muted-foreground">Or</span>
          <Separator className="flex-1 bg-border" />
      </div>

      <div className="space-y-4">
          <Button variant="outline" className="w-full bg-secondary border-border h-14 text-base font-semibold text-foreground hover:bg-secondary/80" type="button" onClick={handleGoogleSignIn} disabled={isSubmitting}>
              <GoogleIcon className="w-5 h-5 mr-3" />
              Continue with Google
          </Button>
          <Button variant="outline" className="w-full bg-secondary border-border h-14 text-base font-semibold text-foreground hover:bg-secondary/80" type="button" onClick={handleAppleSignIn} disabled={isSubmitting}>
              <AppleIcon className="w-5 h-5 mr-3" />
              Continue with Apple
          </Button>
      </div>

    </div>
  );
}
