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
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;

    if (localPart.length <= 3) {
      return `${localPart.slice(0, 1)}**@${domain}`;
    }
    const maskedPart = '*'.repeat(localPart.length - 3);
    return `${localPart.slice(0, 3)}${maskedPart}@${domain}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Reset Link Sent',
        description: `If an account exists for ${email}, a password reset link has been sent.`,
      });
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Forgot Password Error:', { code: error.code, message: error.message });
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
        toast({
            title: 'Reset Link Sent',
            description: `If an account exists for this email, a password reset link has been sent.`,
        });
        setIsSubmitted(true);
      } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'An unexpected error occurred. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const mainLayout = (children: React.ReactNode) => (
    <div className="w-full max-w-md mx-auto bg-background text-foreground p-6 flex flex-col justify-center min-h-screen">
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
  
  if (isSubmitted) {
      return mainLayout(
        <div className="mx-auto grid w-full gap-8 text-center">
            <h1 className="text-3xl font-bold mb-2 font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Check Your Email
            </h1>
            <p className="text-muted-foreground">
                We've sent a password reset link to <span className="font-semibold text-foreground">{maskEmail(email)}</span>.
            </p>
            <Button asChild variant="link" className="text-muted-foreground">
                <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sign In
                </Link>
            </Button>
        </div>
      );
  }

  return mainLayout(
    <div className="mx-auto grid w-full gap-8">
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
            disabled={isLoading || !email}
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
    </div>
  );
}
