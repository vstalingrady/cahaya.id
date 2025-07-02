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
    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input type="tel" className="bg-input h-14 pl-12 text-base placeholder:text-muted-foreground" placeholder="Phone Number" {...field} />
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
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input type="password" className="bg-input h-14 pl-12 text-base placeholder:text-muted-foreground" placeholder="Password" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 h-auto"
          >
            Log In
          </Button>

          <div className="relative flex items-center justify-center text-sm">
              <Separator className="flex-1 bg-border" />
              <span className="mx-4 text-muted-foreground">Or</span>
              <Separator className="flex-1 bg-border" />
          </div>

          <Button variant="outline" className="w-full bg-secondary border-border h-14 text-base font-semibold text-foreground hover:bg-secondary/80" type="button">
              <Fingerprint className="w-5 h-5 mr-3 text-primary" />
              Login with Biometrics
          </Button>
        </form>
      </Form>
    </div>
  );
}
