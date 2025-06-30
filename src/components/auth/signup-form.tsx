'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  pin: z.string().length(6, { message: 'PIN must be 6 digits.' }).regex(/^\d+$/, { message: 'PIN must be numeric.' }),
});

export default function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      pin: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Mock signup
    console.log(values);
    toast({
      title: "Account Created!",
      description: "Welcome to Cuan! Redirecting you to the dashboard.",
    });
    router.push('/dashboard');
  }

  return (
    <div className="relative rounded-lg p-px bg-gradient-to-br from-primary/30 via-accent/30 to-primary/30 transition-all duration-300 hover:shadow-glow-primary">
      <Card className="relative z-10 border-0 bg-card/90 backdrop-blur-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="pt-6 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><User className="w-4 h-4 mr-2" /> Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Mail className="w-4 h-4 mr-2" /> Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
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
                    <FormLabel className="flex items-center"><Lock className="w-4 h-4 mr-2" /> Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Shield className="w-4 h-4 mr-2" /> 6-Digit PIN</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" maxLength={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-2">
                  <Button type="submit" className="w-full font-bold">
                    Create Account
                  </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center pb-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/" className="font-semibold text-primary hover:underline">
                  Login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
