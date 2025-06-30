'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fingerprint, Lock, Mail } from 'lucide-react';

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
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Please enter your password.' }),
});

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Mock login
    console.log(values);
    toast({
      title: "Login Successful!",
      description: "Redirecting to your dashboard...",
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
               <div className="pt-2">
                  <Button type="submit" className="w-full font-bold" variant="default">
                    Login
                  </Button>
              </div>
               <div className="text-right">
                  <Button variant="link" size="sm" asChild className="p-0 h-auto">
                      <Link href="#">Forgot Password?</Link>
                  </Button>
              </div>
              <div className="relative flex items-center justify-center text-sm">
                  <Separator className="flex-1" />
                  <span className="mx-4 text-muted-foreground">Or continue with</span>
                  <Separator className="flex-1" />
              </div>
              <Button variant="outline" className="w-full" type="button">
                  <Fingerprint className="w-4 h-4 mr-2 text-accent" />
                  Login with Biometrics
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center pb-6">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-semibold text-primary hover:underline">
                  Sign Up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
