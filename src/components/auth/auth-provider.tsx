
'use client';

import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { handleSignIn } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * A simplified user object that only contains primitive values.
 * This is safe to store in React state and avoids circular references
 * found in the complex FirebaseUser object.
 */
export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  isPinVerified: boolean;
  setPinVerified: (verified: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Routes that do NOT require authentication.
const PUBLIC_ROUTES = [
    '/', 
    '/login', 
    '/signup', 
    '/verify-phone', 
    '/complete-profile', 
    '/setup-security', 
    '/terms-of-service',
    '/forgot-password',
];

// The main app routes that require authentication AND a PIN to have been entered.
const PROTECTED_ROUTES = [
    '/dashboard',
    '/account',
    '/bills',
    '/budgets',
    '/chat',
    '/history',
    '/insights',
    '/profile',
    '/subscriptions',
    '/transfer',
    '/vaults'
];

const PIN_ENTRY_ROUTE = '/enter-pin';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPinVerified, setIsPinVerified] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const setPinVerifiedState = (verified: boolean) => {
    setIsPinVerified(verified);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        try {
            if (firebaseUser) {
                // Create a clean, simple user object for React state
                const appUser: AppUser = {
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                    phoneNumber: firebaseUser.phoneNumber,
                };
                setUser(appUser);
                // Pass the simple appUser object to the server action, not the complex firebaseUser object.
                await handleSignIn(appUser);
            } else {
                setUser(null);
                setIsPinVerified(false); // Reset on logout
            }
        } catch (error) {
            console.error("Auth state change error:", error);
            toast({
                variant: 'destructive',
                title: 'Authentication Error',
                description: 'Could not verify your session. Please try logging in again.',
            });
            setUser(null); // Ensure user is logged out on error
            setIsPinVerified(false); // Reset on error
        } finally {
            setLoading(false);
        }
    });
    return () => unsubscribe();
  }, [toast]);

  useEffect(() => {
    if (loading) return;

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    if (user) {
        // User is logged in.
        if (!isPinVerified && isProtectedRoute) {
            router.replace(PIN_ENTRY_ROUTE);
        }
    } else {
      // No user.
      if (isProtectedRoute) {
        router.replace('/login');
      }
    }
  }, [user, loading, isPinVerified, pathname, router]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isPinVerified, setPinVerified: setPinVerifiedState }}>
      {children}
    </AuthContext.Provider>
  );
}
