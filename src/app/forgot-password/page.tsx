
'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AtSign, ArrowLeft, Mail, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function ForgotPasswordContent() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 for email entry, 2 for password reset, 3 for success/info message

  const [oobCode, setOobCode] = useState<string | null>(null);

  // This effect checks for an oobCode in the URL on mount
  // This is what happens when the user clicks the email link
  useEffect(() => {
    const code = searchParams.get('oobCode');
    if (code) {
      setIsLoading(true);
      // If code exists, verify it and show password reset form
      verifyPasswordResetCode(auth, code).then(verifiedEmail => {
        setEmail(verifiedEmail);
        setOobCode(code);
        setStep(2); // Go to the password reset step
      }).catch(error => {
        toast({
          variant: 'destructive',
          title: 'Invalid Link',
          description: 'The password reset link is invalid or has expired. Please try again.',
        });
        router.push('/forgot-password');
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [searchParams, router, toast]);


  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    const actionCodeSettings = {
      url: `${window.location.origin}/forgot-password`,
      handleCodeInApp: true,
    };

    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      toast({
        title: 'Reset Link Sent',
        description: `If an account exists for ${email}, a password reset link has been sent. Please check your inbox.`,
      });
      setStep(3); // A step to show "check your email" message
    } catch (error: any) {
      console.error('Forgot Password Error:', { code: error.code, message: error.message });
      // It's good practice to show a generic success message even on failure
      // to prevent email enumeration attacks.
      toast({
        title: 'Reset Link Sent',
        description: `If an account exists for this email, a password reset link has been sent. Please check your inbox.`,
      });
       setStep(3);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!oobCode || !password) return;
    setIsLoading(true);

    try {
        await confirmPasswordReset(auth, oobCode, password);
        toast({
            title: 'Password Reset Successfully',
            description: 'You can now log in with your new password.',
        });
        router.push('/login');
    } catch (error: any) {
        console.error('Password Reset Error:', { code: error.code, message: error.message });
        let description = 'Could not reset your password. Please try again.';
        if (error.code === 'auth/weak-password') {
            description = 'The new password is too weak.';
        }
        toast({
            variant: 'destructive',
            title: 'Error',
            description,
        });
    } finally {
        setIsLoading(false);
    }
  }

  // Define content for each step
  const steps = {
    1: {
      title: 'Forgot Your Password?',
      subtitle: "No problem. Enter your email and we'll send you a reset link.",
      content: (
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-input h-14 pl-12 text-base" placeholder="you@example.com" disabled={isLoading} required />
            </div>
          </div>
          <Button type="submit" disabled={isLoading || !email} className="w-full h-14 text-lg font-semibold">
            {isLoading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
          </Button>
        </form>
      )
    },
    2: {
      title: 'Reset Your Password',
      subtitle: <>Create a new password for <span className="font-semibold text-foreground">{email}</span>.</>,
      content: (
        <form onSubmit={handlePasswordReset} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input id="password" name="password" type={isPasswordVisible ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="bg-input h-14 pl-12 pr-12 text-base" placeholder="Enter your new password" disabled={isLoading} required />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onMouseDown={() => setIsPasswordVisible(true)} onMouseUp={() => setIsPasswordVisible(false)} onMouseLeave={() => setIsPasswordVisible(false)}>
                {isPasswordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <Button type="submit" disabled={isLoading || !password} className="w-full h-14 text-lg font-semibold">
            {isLoading ? <Loader2 className="animate-spin" /> : 'Save New Password'}
          </Button>
        </form>
      )
    },
    3: {
      title: 'Check Your Email',
      subtitle: <>We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span>. Please click the link to continue.</>,
      icon: <Mail className="w-10 h-10 text-primary" />,
      content: <></> // No form needed for this step
    }
  }

  const currentStep = steps[step as keyof typeof steps];

  if (isLoading && oobCode) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative z-10">
      <div className="text-center mb-8">
        {currentStep.icon && <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">{currentStep.icon}</div>}
        <h1 className="text-3xl font-bold mb-2 font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {currentStep.title}
        </h1>
        <p className="text-muted-foreground">{currentStep.subtitle}</p>
      </div>

      {step !== 3 && (
        <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
          {currentStep.content}
        </div>
      )}

      <div className="text-center mt-8">
        <Button asChild variant="link" className="text-muted-foreground">
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
    return (
      <div className="w-full max-w-md mx-auto bg-background text-foreground p-6 flex flex-col justify-center min-h-screen relative overflow-hidden">
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        }>
            <ForgotPasswordContent />
        </Suspense>
      </div>
    )
}
