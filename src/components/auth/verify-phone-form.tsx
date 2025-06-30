'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Phone, MessageCircle, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import NoiseOverlay from '../noise-overlay';

const phoneSchema = z.object({
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }).regex(/^08[0-9]{8,}$/, { message: 'Must be a valid Indonesian phone number.' }),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'Code must be 6 digits.' }),
});

export default function VerifyPhoneForm() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  function onPhoneSubmit(values: z.infer<typeof phoneSchema>) {
    setPhoneNumber(values.phone);
    console.log('Sending OTP to:', values.phone);
    toast({
      title: 'Verification Code Sent!',
      description: `A code has been sent to ${values.phone} via WhatsApp.`,
    });
    setStep('otp');
  }
  
  function onOtpSubmit(values: z.infer<typeof otpSchema>) {
    console.log('Verifying OTP:', values.otp);
    toast({
      title: 'Phone Verified!',
      description: "Now let's create your profile.",
    });
    router.push('/verify-phone');
  }

  return (
    <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-8 rounded-2xl border border-red-600/20 shadow-2xl relative overflow-hidden">
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
                      <Input className="bg-red-950/50 border-red-800/50 h-14 pl-12 text-base placeholder:text-red-300/70" placeholder="e.g. 081234567890" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 h-auto">
              <MessageCircle className="w-5 h-5 mr-3" />
              Send Code via WhatsApp
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
            <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 h-auto">
              Verify & Continue
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
