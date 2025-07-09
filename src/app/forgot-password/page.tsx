'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AtSign, ArrowLeft } from 'lucide-react';
import CuanLogo from '@/components/icons/CuanLogo';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setIsEmailSent(true);
      toast({
        title: 'Password Reset Email Sent',
        description: `An email has been sent to ${email} with instructions to reset your password.`,
      });
    } catch (error: any) {
      console.error('Forgot Password Error:', error);
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-[400px] gap-8">
          {isEmailSent ? (
            <div className="text-center space-y-6 bg-card border border-border p-8 rounded-2xl shadow-lg">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                        <AtSign className="w-8 h-8"/>
                    </div>
                </div>
                <h1 className="text-3xl font-bold font-serif">Check Your Email</h1>
                <p className="text-muted-foreground">
                    We&apos;ve sent a password reset link to <br/>
                    <span className="font-semibold text-foreground">{email}</span>.
                </p>
                <p className='text-sm text-muted-foreground'>Please check your spam folder if you don&apos;t see it in your inbox.</p>
                <Button asChild className="w-full h-12 text-lg">
                    <Link href="/login">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Sign In
                    </Link>
                </Button>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2 font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Forgot Your Password?
                </h1>
                <p className="text-muted-foreground">
                  No problem. Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-input h-14 pl-12 text-base placeholder:text-muted-foreground"
                      placeholder="you@example.com"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 text-lg font-semibold"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
                </Button>
              </form>

              <div className="text-center">
                <Button asChild variant="link" className="text-muted-foreground">
                  <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Remember your password? Sign In
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="hidden bg-muted lg:flex items-center justify-center p-10 flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5">
         <div className="flex items-center gap-4 text-3xl font-bold text-foreground mb-8">
            <CuanLogo className="w-10 h-10" />
            <span className="font-serif">Cahaya</span>
        </div>
        <div className="text-center max-w-md">
            <h2 className="text-4xl font-bold font-serif mb-4">A Brighter Financial Future</h2>
            <p className="text-muted-foreground text-lg">
                Securely manage your finances, uncover insights, and take control of your wealth with Cahaya, your AI-powered financial companion.
            </p>
        </div>
      </div>
    </div>
  );
}
