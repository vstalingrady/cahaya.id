'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Fingerprint, Lock, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import NoiseOverlay from '../noise-overlay';

const formSchema = z.object({
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }).regex(/^08[0-9]{8,}$/, { message: 'Must be a valid Indonesian phone number.' }),
  password: z.string().min(1, { message: 'Please enter your password.' }),
});

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Login Successful!",
      description: "Redirecting to your dashboard...",
    });
    router.push('/dashboard');
  }

  return (
    <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-8 rounded-2xl border border-red-600/20 shadow-lg relative overflow-hidden">
      <NoiseOverlay opacity={0.03} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-300" />
                    <Input type="tel" className="bg-red-950/50 border-red-800/50 h-14 pl-12 text-base placeholder:text-red-300/70" placeholder="Phone Number" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-300" />
                    <Input type="password" className="bg-red-950/50 border-red-800/50 h-14 pl-12 text-base placeholder:text-red-300/70" placeholder="Password" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 rounded-xl font-bold text-lg shadow-lg border border-red-400/30 hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group h-auto"
          >
            <NoiseOverlay opacity={0.05} />
            <span className="relative z-10">Log In</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>

          <div className="relative flex items-center justify-center text-sm">
              <Separator className="flex-1 bg-red-800/50" />
              <span className="mx-4 text-red-300">Or</span>
              <Separator className="flex-1 bg-red-800/50" />
          </div>

          <Button variant="outline" className="w-full bg-red-950/50 border-red-800/50 h-14 text-base font-semibold text-red-200 hover:bg-red-900/80 hover:text-white" type="button">
              <Fingerprint className="w-5 h-5 mr-3 text-red-400" />
              Login with Biometrics
          </Button>
        </form>
      </Form>
    </div>
  );
}
