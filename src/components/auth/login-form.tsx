'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, OAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { Separator } from '../ui/separator';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setMessage('');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setMessage('');
    
    try {
      console.log('Attempting login with:', formData.email);
      
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      const user = userCredential.user;

      // Log the successful login event to Firestore
      await setDoc(doc(db, "users", user.uid, "login_history", new Date().toISOString()), {
        timestamp: new Date(),
        ipAddress: "Client-side login",
        userAgent: "Client-side login (browser)",
      });
      
      console.log('Login successful:', userCredential.user.uid);
      
      // The AuthProvider will handle the redirect automatically upon successful login.
      // No need to set a success message, as the user will be navigated away.
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'An unexpected error occurred.';
      
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/invalid-email':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed login attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        default:
          errorMessage = error.message || 'Failed to log in. Please try again.';
      }
      
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: GoogleAuthProvider | OAuthProvider) => {
    setIsLoading(true);
    setMessage('');
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Log the successful login event to Firestore
      await setDoc(doc(db, "users", user.uid, "login_history", new Date().toISOString()), {
        timestamp: new Date(),
        ipAddress: "Client-side social login",
        userAgent: "Client-side social login (browser)",
      }, { merge: true });

      // If user logs in with social for the first time, their document might not exist. Create it.
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        console.log(`User document for ${user.uid} not found via social login. Creating it.`);
        await setDoc(userDocRef, {
            uid: user.uid,
            fullName: user.displayName || "New User",
            email: user.email,
            phone: user.phoneNumber, // Often null with social providers
            createdAt: new Date(),
        });
      }

      console.log('Social login successful:', user.uid);
      // AuthProvider will handle redirect
    } catch (error: any) {
      console.error('Social login error:', error);
      let errorMessage = 'An unexpected error occurred with social login.';
      if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email address but different sign-in credentials. Try signing in with the original method.';
      } else if (error.code && error.code.includes('app-check')) {
          errorMessage = 'App Check validation failed. Please ensure your debug token is configured correctly in the Firebase Console.';
      }
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => handleOAuthSignIn(new GoogleAuthProvider());
  const handleAppleSignIn = () => handleOAuthSignIn(new OAuthProvider('apple.com'));

  return (
    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              id="email" 
              name="email" 
              type="email" 
              value={formData.email}
              onChange={handleInputChange}
              className="bg-input h-14 pl-12 text-base placeholder:text-muted-foreground" 
              placeholder="Email"
              disabled={isLoading}
            />
          </div>
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              id="password" 
              name="password" 
              type="password" 
              value={formData.password}
              onChange={handleInputChange}
              className="bg-input h-14 pl-12 text-base placeholder:text-muted-foreground" 
              placeholder="Password"
              disabled={isLoading}
            />
          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 h-auto"
        >
          {isLoading ? <Loader2 className="animate-spin"/> : 'Log In'}
        </Button>
      </form>

      <div className="relative flex items-center justify-center text-sm my-6">
          <Separator className="flex-1 bg-border" />
          <span className="mx-4 text-muted-foreground">Or</span>
          <Separator className="flex-1 bg-border" />
      </div>

      <div className="space-y-4">
          <Button className="w-full bg-white text-black hover:bg-gray-200 h-14 text-base font-semibold border border-gray-200/50 flex items-center justify-center" type="button" onClick={handleGoogleSignIn} disabled={isLoading}>
              <FaGoogle className="mr-3" />
              <span>Continue with Google</span>
          </Button>
          <Button className="w-full bg-black text-white hover:bg-gray-800 h-14 text-base font-semibold flex items-center justify-center" type="button" onClick={handleAppleSignIn} disabled={isLoading}>
              <FaApple className="mr-3" />
              <span>Continue with Apple</span>
          </Button>
      </div>

       {message && (
          <p className="mt-4 text-sm text-center text-red-500">
            {message}
          </p>
        )}
    </div>
  );
}