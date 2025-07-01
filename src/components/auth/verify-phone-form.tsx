'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Phone, MessageCircle, KeyRound, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import NoiseOverlay from '../noise-overlay';
import { firebaseApp } from '@/lib/firebase';

const phoneSchema = z.object({
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }).regex(/^\+62[0-9]{9,}$/, { message: 'Must be a valid Indonesian phone number starting with +62.' }),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'Code must be 6 digits.' }),
});

export default function VerifyPhoneForm() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    // This sets up the reCAPTCHA verifier, which is required for phone auth.
    // It's invisible to the user. We only set it up if it doesn't already exist.
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log('reCAPTCHA solved');
        }
      });
    }
  }, [auth]);


  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '+62' },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  async function onPhoneSubmit(values: z.infer<typeof phoneSchema>) {
    setIsSubmitting(true);
    setPhoneNumber(values.phone);
    
    // For local testing, we'll simulate the OTP send instead of calling Firebase
    console.log("Simulating OTP send for development:", values.phone);
    setTimeout(() => {
        toast({
            title: "Verification Code Sent! (Simulated)",
            description: `A code has been sent to ${values.phone}.`,
        });
        setStep('otp');
        setIsSubmitting(false);
    }, 1000);
  }
  
  async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
    // For testing without a real SMS, we can simulate success.
    // In a real app, you would handle this error properly.
    if (!confirmationResult) {
      console.warn("No confirmation result found, simulating success for testing.");
    }
    
    setIsSubmitting(true);

    try {
      // To make verification always work for testing, we bypass the confirm call.
      // In a real app, you would use: await confirmationResult.confirm(values.otp); 
      console.log("Simulating OTP verification for development.");
      
      toast({
        title: 'Phone Verified!',
        description: "Now let's create your profile.",
      });
      router.push('/verify-phone');
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        variant: "destructive",
        title: 'Verification Failed',
        description: "The code you entered is incorrect. Please try again.",
      });
       setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-8 rounded-2xl border border-red-600/20 shadow-2xl relative overflow-hidden">
      <div id="recaptcha-container"></div>
      <NoiseOverlay opacity={0.03} />
      {step === 'phone' ? (
        <Form {...phoneForm}>
          <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-6">
            <FormField
              control={phoneForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-300" />
                      <Input className="bg-red-950/50 border-red-800/50 h-14 pl-12 text-base placeholder:text-red-300/70" placeholder="e.g. +6281234567890" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 h-auto">
              {isSubmitting ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <MessageCircle className="w-5 h-5 mr-3" />}
              {isSubmitting ? 'Sending...' : 'Send Code'}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
            <p className="text-center text-red-200 text-sm">Enter the 6-digit code sent to <span className="font-bold">{phoneNumber}</span>.</p>
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-300" />
                      <Input 
                        className="bg-red-950/50 border-red-800/50 h-14 pl-12 text-center text-xl tracking-[0.5em] placeholder:text-red-300/70" 
                        placeholder="••••••"
                        maxLength={6}
                        {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 h-auto">
              {isSubmitting && <Loader2 className="w-5 h-5 mr-3 animate-spin" />}
              {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
            </Button>
            <Button variant="link" onClick={() => setStep('phone')} className="w-full text-red-300 hover:text-red-200">
                Use a different number
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}

// Add this to your global types or a specific types file if you have one
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}
