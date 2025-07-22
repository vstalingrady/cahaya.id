
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { Separator } from '@/components/ui/separator';
import { checkUserOnboardingStatus } from '@/lib/actions';

const googleProvider = new GoogleAuthProvider();

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  const handleAuthSuccess = async (user: User) => {
    const { onboardingComplete } = await checkUserOnboardingStatus(user.uid);
    if (onboardingComplete) {
      router.push('/enter-pin');
    } else {
      router.push('/setup-security');
    }
  };

  const handleSocialSignIn = async (provider: GoogleAuthProvider) => {
    setIsSocialLoading(true);
    
    // Debug Firebase config
    console.log('🔥 Firebase Auth Debug:', {
      authDomain: auth.app.options.authDomain,
      projectId: auth.app.options.projectId,
      currentOrigin: window.location.origin
    });
    
    try {
      console.log('🚀 Starting Google sign-in...');
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Google sign-in successful:', result.user.email);
      await handleAuthSuccess(result.user);
    } catch (error: any) {
      console.error("🚨 Social Sign-In Error Details:", {
        error: error,
        code: error?.code,
        message: error?.message,
        stack: error?.stack,
        fullError: JSON.stringify(error, null, 2)
      });
      
      // More specific error handling
      let errorMessage = "Failed to sign in. Please try again.";
      
      if (error?.code === 'auth/auth-domain-config-required') {
        errorMessage = "Authentication domain not configured. Please contact support.";
      } else if (error?.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked. Please allow popups and try again.";
      } else if (error?.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in was cancelled. Please try again.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Sign-In Error",
        description: errorMessage,
      });
    } finally {
      setIsSocialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await handleAuthSuccess(result.user);
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      toast({
        variant: "destructive",
        title: "Sign-In Error",
        description: errorMessage,
      });
      console.error("Email/Pass Sign-In Error:", { code: error.code, message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-muted-foreground">Enter your email and password to sign in.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input h-14 pl-12 text-base placeholder:text-muted-foreground"
                placeholder="you@example.com"
                disabled={isLoading || isSocialLoading}
                required
              />
          </div>
        </div>
        <div className="space-y-2">
            <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm text-muted-foreground underline hover:text-primary"
                >
                    Forgot password?
                </Link>
            </div>
          <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input h-14 pl-12 text-base placeholder:text-muted-foreground"
                placeholder="••••••••"
                disabled={isLoading || isSocialLoading}
                required
              />
          </div>
        </div>
        <Button
          type="submit"
          disabled={isLoading || isSocialLoading}
          className="w-full h-14 text-lg font-semibold"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
        </Button>
      </form>

      <div className="relative flex items-center justify-center text-sm">
          <Separator className="flex-1 bg-border" />
          <span className="px-4 text-muted-foreground">OR</span>
          <Separator className="flex-1 bg-border" />
      </div>
      
      <div className="space-y-4">
          <Button className="w-full bg-white text-black hover:bg-gray-200 h-14 text-base font-semibold border border-gray-200/50 flex items-center justify-center" type="button" onClick={() => handleSocialSignIn(googleProvider)} disabled={isLoading || isSocialLoading}>
              <FaGoogle className="mr-3" />
              <span>Continue with Google</span>
          </Button>
      </div>
      
      <p className="px-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
