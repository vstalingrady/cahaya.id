
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { signInWithGoogleCapacitor } from '@/lib/google-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { Separator } from '@/components/ui/separator';

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Allow only digits and limit length
    const digitsOnly = value.replace(/\D/g, '');
    setPhone(digitsOnly.slice(0, 12));
  };
  
  const handleSocialSignIn = async () => {
    setIsSocialLoading(true);
    
    try {
      console.log('🚀 Starting Google sign-up...');
      console.log('🌐 Current origin:', window.location.origin);
      console.log('🔥 Auth domain:', auth.app.options.authDomain);
      console.log('🔧 Firebase config check:', {
        apiKey: auth.app.options.apiKey?.substring(0, 10) + '...',
        authDomain: auth.app.options.authDomain,
        projectId: auth.app.options.projectId
      });
      
      // Test if Firebase is properly initialized
      if (!auth.app.options.apiKey || !auth.app.options.authDomain) {
        throw new Error('Firebase configuration is incomplete');
      }
      
      // Use platform-specific Google Auth
      console.log('🔄 About to call Google auth...');
      const result = await signInWithGoogleCapacitor();
      
      // If result is null, it means redirect was initiated - just return
      if (!result) {
        console.log('🔄 Redirect initiated, waiting for return...');
        return;
      }
      
      // If we get here, it means we returned from redirect
      console.log('✅ Google sign-up successful:', result.user.email);
      document.cookie = "isLoggedIn=true; path=/; max-age=86400";
      
      // Navigate to PIN entry
      router.push('/enter-pin');
    } catch (error: any) {
      console.error("🚨 Social Sign-Up Error:", {
        code: error?.code,
        message: error?.message
      });
      
      // More specific error handling
      let errorMessage = "Failed to sign up. Please try again.";
      
      if (error?.code === 'auth/auth-domain-config-required') {
        errorMessage = "Authentication domain not configured. Please contact support.";
      } else if (error?.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked. Please allow popups and try again.";
      } else if (error?.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-up was cancelled. Please try again.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Sign-Up Error",
        description: errorMessage,
      });
    } finally {
      setIsSocialLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phone || phone.length < 9) {
        toast({
            variant: 'destructive',
            title: 'Invalid Phone Number',
            description: 'Please enter a valid Indonesian phone number (e.g., 81234567890).',
        });
        return;
    }

    setIsLoading(true);
    const formattedPhone = `+62${phone}`;
    // Redirect to phone verification, then to complete the profile
    router.push(`/verify-phone?phone=${encodeURIComponent(formattedPhone)}&next=/complete-profile`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Create an Account
        </h1>
        <p className="text-muted-foreground">Enter your phone number to get started.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-base">+62</span>
              <Input id="phone" name="phone" type="tel" value={phone} onChange={handleInputChange} className="bg-input h-14 pl-14 text-base placeholder:text-muted-foreground" placeholder="81234567890" disabled={isLoading || isSocialLoading} />
          </div>
        </div>
        <Button
          type="submit"
          disabled={isLoading || isSocialLoading}
          className="w-full h-14 text-lg font-semibold"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : 'Continue with Phone'}
        </Button>
      </form>

      <div className="relative flex items-center justify-center text-sm">
          <Separator className="flex-1 bg-border" />
          <span className="px-4 text-muted-foreground">OR</span>
          <Separator className="flex-1 bg-border" />
      </div>
      
      <div className="space-y-4">
          <Button className="w-full bg-white text-black hover:bg-gray-200 h-14 text-base font-semibold border border-gray-200/50 flex items-center justify-center" type="button" onClick={handleSocialSignIn} disabled={isLoading || isSocialLoading}>
              <FaGoogle className="mr-3" />
              <span>Continue with Google</span>
          </Button>
      </div>
      
      <p className="px-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
          Log In
        </Link>
      </p>
    </div>
  );
}
