'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AtSign, ArrowLeft, KeyRound } from 'lucide-react';
import CuanLogo from '@/components/icons/CuanLogo';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setIsEmailSent(true);
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

  const handleVerifySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsVerifying(true);
    // In a real app, you would use Firebase's verifyPasswordResetCode and confirmPasswordReset.
    // This is a placeholder to simulate the flow.
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: 'Password Reset Successful',
      description: 'You can now sign in with your new password.',
    });
    router.push('/login');
    setIsVerifying(false);
  }

  const maskEmail = (email: string) => {
    const atIndex = email.indexOf('@');
    if (atIndex < 1) return email;

    const username = email.substring(0, atIndex);
    const domain = email.substring(atIndex);

    if (username.length <= 2) {
      return '*'.repeat(username.length) + domain;
    }

    const maskedUsername = username.substring(0, 2) + '*'.repeat(username.length - 2);
    return maskedUsername + domain;
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-[400px] gap-8">
          {isEmailSent ? (
            <div className="text-center space-y-6 bg-card border border-border p-8 rounded-2xl shadow-lg">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                        <KeyRound className="w-8 h-8"/>
                    </div>
                </div>
                <h1 className="text-3xl font-bold font-serif">Enter Verification Code</h1>
                <p className="text-muted-foreground">
                    We have sent an email to <br/>
                    <span className="font-semibold text-foreground">{maskEmail(email)}</span>.
                </p>
                <form onSubmit={handleVerifySubmit} className="space-y-4">
                    <div className="space-y-2 text-left">
                        <Label htmlFor="code">Verification Code</Label>
                        <Input
                            id="code"
                            name="code"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="bg-input h-14 text-base placeholder:text-muted-foreground text-center tracking-[0.5em]"
                            placeholder="••••••"
                            maxLength={6}
                            disabled={isVerifying}
                            required
                        />
                    </div>
                     <div className="space-y-2 text-left">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                            id="new-password"
                            name="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="bg-input h-14 text-base placeholder:text-muted-foreground"
                            placeholder="Enter new password"
                            disabled={isVerifying}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full h-12 text-lg" disabled={isVerifying || !code || !newPassword}>
                        {isVerifying ? <Loader2 className="animate-spin" /> : 'Verify & Reset Password'}
                    </Button>
                </form>
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
