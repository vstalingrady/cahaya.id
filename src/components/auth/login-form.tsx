
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  OAuthProvider, 
  signInWithPopup, 
  User, 
  getAdditionalUserInfo,
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  updateProfile,
  type ConfirmationResult
} from 'firebase/auth';
import { Lock, Mail, Loader2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';
import { app, auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { Separator } from '../ui/separator';
import { completeUserProfile } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

// Extend the global Window interface to include Firebase Auth objects.
declare global {
  interface Window {
    confirmationResult: ConfirmationResult;
  }
}

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loginMode, setLoginMode] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [phone, setPhone] = useState('+62 ');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [verifier, setVerifier] = useState<RecaptchaVerifier | null>(null);

  useEffect(() => {
    const authInstance = getAuth(app);
    // Initialize reCAPTCHA verifier once on component mount
    if (!verifier) {
      const recaptchaVerifier = new RecaptchaVerifier(authInstance, 'login-recaptcha-container', {
        'size': 'invisible',
      });
      setVerifier(recaptchaVerifier);
    }
  }, [verifier]);


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
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    if (!value.startsWith('+62 ')) {
      setPhone('+62 ');
      return;
    }
    
    const rawNumbers = value.substring(4).replace(/\D/g, '');
    const trimmedNumbers = rawNumbers.slice(0, 12);
    const chunks = [];
    if (trimmedNumbers.length > 0) chunks.push(trimmedNumbers.slice(0, 3));
    if (trimmedNumbers.length > 3) chunks.push(trimmedNumbers.slice(3, 7));
    if (trimmedNumbers.length > 7) chunks.push(trimmedNumbers.slice(7));
    setPhone(`+62 ${chunks.join('-')}`);
  };

  const formatPhoneNumberForFirebase = (phoneNumber: string): string => {
    return `+${phoneNumber.replace(/\D/g, '')}`;
  };

  const validateEmailForm = () => {
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

  const trigger2FA = async (user: User) => {
    if (!verifier) {
      throw new Error("reCAPTCHA verifier not initialized.");
    }
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists() || !userDoc.data()?.phone) {
        toast({ variant: "destructive", title: 'Verification Failed', description: 'Your account has no phone number on file for verification.' });
        await signOut(auth); // Log them out so they can try again
        throw new Error('No phone number found for user.');
    }

    const phoneNumber = userDoc.data()!.phone;
    const authInstance = getAuth(app);

    const confirmationResult = await signInWithPhoneNumber(authInstance, phoneNumber, verifier);
    window.confirmationResult = confirmationResult;

    router.push(`/verify-phone?phone=${encodeURIComponent(phoneNumber)}&next=/dashboard`);
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmailForm()) return;
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      await trigger2FA(userCredential.user);
      
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'No phone number found for user.') {
          // The specific error is already shown via toast, so just stop loading.
      } else {
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
        toast({
            variant: "destructive",
            title: 'Login Failed',
            description: errorMessage
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    if (!verifier) {
      setErrors({ phone: "reCAPTCHA not ready. Please wait a moment and try again."});
      setIsLoading(false);
      return;
    }

    const authInstance = getAuth(app);
    const formattedPhone = formatPhoneNumberForFirebase(phone);
    
    try {
      const confirmationResult = await signInWithPhoneNumber(authInstance, formattedPhone, verifier);
      window.confirmationResult = confirmationResult;
      
      router.push(`/verify-phone?phone=${encodeURIComponent(phone)}&next=/dashboard`);
    } catch (err: any) {
      console.error("Error sending code:", err);
      let errorMessage = 'Failed to send verification code. Please try again.';

      if (err.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format. Please check your number.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (err.code === 'auth/internal-error') {
        errorMessage = "An internal error occurred. Please ensure Phone Sign-In is enabled in your Firebase project and that your App Check configuration is correct.";
      }
      setErrors({ phone: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: GoogleAuthProvider | OAuthProvider) => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const additionalInfo = getAdditionalUserInfo(result);

      if (additionalInfo?.isNewUser) {
        await updateProfile(user, {
            displayName: user.displayName,
            photoURL: user.photoURL,
        });

        await completeUserProfile(
            user.uid,
            user.displayName || "New Social User",
            user.email || 'no-email@example.com',
            user.phoneNumber || ''
        );
        sessionStorage.setItem('social_auth_in_progress', 'true');
        router.push('/setup-security');
      } else {
        await trigger2FA(user);
      }

    } catch (error: any) {
      console.error('Social login error:', error);
      if (error.message === 'No phone number found for user.') {
        // Already handled by toast in trigger function
      } else {
        let errorMessage = 'An unexpected error occurred with social login.';
        if (error.code === 'auth/account-exists-with-different-credential') {
            errorMessage = 'An account already exists with the same email address but different sign-in credentials. Try signing in with the original method.';
        } else if (error.code && error.code.includes('app-check')) {
            errorMessage = 'App Check validation failed. Please ensure your debug token is configured correctly in the Firebase Console.';
        } else if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'The sign-in window was closed. Please try again.';
        }
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: errorMessage
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => handleOAuthSignIn(new GoogleAuthProvider());
  const handleAppleSignIn = () => handleOAuthSignIn(new OAuthProvider('apple.com'));

  return (
    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
      {loginMode === 'email' ? (
        <form onSubmit={handleEmailSubmit} className="space-y-6">
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
          <Button variant="link" className="w-full text-sm" onClick={() => setLoginMode('phone')}>
            Log in with phone number instead
          </Button>
        </form>
      ) : (
        <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        className="bg-input h-14 text-lg pl-12"
                        placeholder="+62 000-0000-00000"
                        value={phone}
                        onChange={handlePhoneChange}
                        disabled={isLoading}
                        required
                    />
                </div>
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>
            <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 h-auto"
            >
                {isLoading ? <Loader2 className="animate-spin"/> : 'Send Code'}
            </Button>
             <Button variant="link" className="w-full text-sm" onClick={() => setLoginMode('email')}>
                Log in with email instead
            </Button>
        </form>
      )}

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
      <div id="login-recaptcha-container"></div>
    </div>
  );
}
