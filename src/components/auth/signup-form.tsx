
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AtSign, Lock, User } from 'lucide-react';
import { completeUserProfile } from '@/lib/actions';


export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});


  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
        // Remove all non-digit characters to prevent formatting loops
        const inputDigits = value.replace(/\D/g, '');
        const truncatedDigits = inputDigits.slice(0, 12);
        
        setFormData({
            ...formData,
            phone: truncatedDigits
        });
    } else {
        setFormData({
            ...formData,
            [name]: value,
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
        return;
    }
    
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Update the user's profile with their full name
      await updateProfile(userCredential.user, {
        displayName: formData.fullName
      });

      // Sync user data to Firestore, but don't seed data yet
      await completeUserProfile(
        userCredential.user.uid,
        formData.fullName,
        formData.email,
        // Prepend the country code for consistency
        `+62${formData.phone}`
      );

      toast({
        title: "Account Created!",
        description: "Welcome! Let's get your account set up.",
      });

      // Redirect to the next step in the onboarding flow
      router.push('/dashboard'); 

    } catch (error: any) {
      // Log only serializable fields to avoid circular reference errors during SSR.
      console.error("Signup Error:", { code: error.code, message: error.message });
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.code) {
          switch (error.code) {
              case 'auth/email-already-in-use':
                  errorMessage = 'This email address is already registered. Please login or use a different email.';
                  break;
              case 'auth/invalid-email':
                  errorMessage = 'Please enter a valid email address.';
                  break;
              case 'auth/weak-password':
                  errorMessage = 'The password is too weak. Please choose a stronger password.';
                  break;
              default:
                  errorMessage = error.message;
          }
      }
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Create an Account
        </h1>
        <p className="text-muted-foreground">Start your journey to financial freedom.</p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          
           <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleInputChange} className="bg-input h-14 pl-12 text-base placeholder:text-muted-foreground" placeholder="e.g. Budi Purnomo" disabled={isLoading} />
            </div>
            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
           </div>

           <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="bg-input h-14 pl-12 text-base placeholder:text-muted-foreground" placeholder="you@example.com" disabled={isLoading} />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
           </div>
           
           <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
                 {/* This could be improved with a country code selector */}
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-base">+62</span>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="bg-input h-14 pl-14 text-base placeholder:text-muted-foreground" placeholder="81234567890" disabled={isLoading} />
            </div>
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
           </div>

           <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline">
                Forgot Password?
                </Link>
            </div>
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} className="bg-input h-14 pl-12 text-base placeholder:text-muted-foreground" placeholder="Create a password" disabled={isLoading} />
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} className="bg-input h-14 pl-12 text-base placeholder:text-muted-foreground" placeholder="Confirm your password" disabled={isLoading} />
            </div>
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
          </div>


          <Button type="submit" disabled={isLoading} className="w-full h-14 text-lg font-semibold">
            {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
          </Button>
        </form>
      </div>
      
      <p className="px-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
          Sign In
        </Link>
      </p>
    </>
  );
}
