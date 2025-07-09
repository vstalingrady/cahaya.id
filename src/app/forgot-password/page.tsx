
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
import CahayaLogo from '@/components/icons/cuanlogo';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      router.push('/login');
    } catch (error: any) {
      // Log only the serializable parts of the error to avoid circular reference crashes.
      console.error('Forgot Password Error:', error.code, error.message);
      
      // For security reasons, we don't want to confirm if an email exists or not.
      // So, even on a 'user-not-found' error, we show a generic success-style message.
      if (error.code === 'auth/user-not-found') {
        toast({
            title: 'Reset Link Sent',
            description: `If an account exists for ${email}, a password reset link has been sent.`,
        });
        router.push('/login');
      } else if (error.code === 'auth/invalid-email') {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Please enter a valid email address.',
        });
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

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-[400px] gap-8">
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
      </div>
      <div className="hidden bg-muted lg:flex items-center justify-center p-10 flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5">
         <div className="flex items-center gap-4 text-3xl font-bold text-foreground mb-8">
            <CahayaLogo className="w-10 h-10" />
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
