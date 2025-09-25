
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
    console.log('AuthProvider: useEffect called');
    
    // Check if auth is available (Firebase initialized)
    if (!auth) {
      console.warn('Firebase Auth not available. Skipping auth state listener.');
      setLoading(false);
      return;
    }

    let isSubscribed = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        console.log('AuthProvider: onAuthStateChanged called', { firebaseUser });
        
        try {
            if (!isSubscribed) {
              console.log('AuthProvider: Component unmounted, skipping update');
              return;
            }

            if (firebaseUser) {
                console.log('AuthProvider: User is logged in', { uid: firebaseUser.uid });
                
                // Create a clean, simple user object for React state
                const appUser: AppUser = {
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                    phoneNumber: firebaseUser.phoneNumber,
                };
                
                // IMPORTANT FIX: Await the server action to ensure the user document
                // is created or verified in Firestore BEFORE proceeding. This prevents
                // race conditions where the app tries to fetch data for a user
                // whose record doesn't exist yet.
                console.log('AuthProvider: Calling handleSignIn');
                try {
                  const { hasCompletedOnboarding } = await handleSignIn(appUser);
                  console.log('AuthProvider: handleSignIn completed', { hasCompletedOnboarding });
                  
                  if (isSubscribed) {
                    setUser(appUser);
                    setIsPinVerified(hasCompletedOnboarding); // Set pin verified status based on onboarding
                    console.log('AuthProvider: User state updated');
                  }
                } catch (error) {
                  console.error("handleSignIn error:", error);
                  if (isSubscribed) {
                    toast({
                        variant: 'destructive',
                        title: 'Authentication Error',
                        description: 'Could not verify your session. Please try logging in again.',
                    });
                    setUser(null); // Ensure user is logged out on error
                    setIsPinVerified(false); // Reset on error
                    console.log('AuthProvider: Error handled in handleSignIn');
                  }
                }
            } else {
                console.log('AuthProvider: No user logged in');
                if (isSubscribed) {
                  setUser(null);
                  setIsPinVerified(false); // Reset on logout
                  console.log('AuthProvider: User state reset');
                }
            }
        } catch (error) {
            console.error("Auth state change error:", error);
            if (isSubscribed) {
              toast({
                  variant: 'destructive',
                  title: 'Authentication Error',
                  description: 'Could not verify your session. Please try logging in again.',
              });
              setUser(null); // Ensure user is logged out on error
              setIsPinVerified(false); // Reset on error
              console.log('AuthProvider: Error handled in onAuthStateChanged');
            }
        } finally {
            if (isSubscribed) {
              console.log('AuthProvider: Setting loading to false in finally block');
              setLoading(false);
            }
        }
    });

    // Add a timeout to ensure loading is set to false even if there are issues
    const timeoutId = setTimeout(() => {
      if (isSubscribed && loading) {
        console.warn('Auth state listener took too long. Setting loading to false.');
        setLoading(false);
      }
    }, 5000); // 5 seconds timeout

    return () => {
      console.log('AuthProvider: Cleanup function called');
      isSubscribed = false;
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [toast]);

  useEffect(() => {
    if (loading) {
      console.log('AuthProvider: Loading effect called', { loading });
      return;
    }

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    console.log('AuthProvider: Route check', { pathname, isProtectedRoute, user, isPinVerified });

    if (user) {
        // User is logged in.
        if (!isPinVerified && isProtectedRoute) {
            console.log('AuthProvider: Redirecting to setup-security');
            router.replace('/setup-security'); // Redirect to PIN setup if not onboarded
        }
    } else {
      // No user.
      if (isProtectedRoute) {
        console.log('AuthProvider: Redirecting to login');
        router.replace('/login');
      }
    }
  }, [user, loading, isPinVerified, pathname, router]);


  // Add a timeout to prevent infinite loading
  useEffect(() => {
    console.log('AuthProvider: Timeout useEffect called', { loading });
    if (loading) {
      const timer = setTimeout(() => {
        console.warn('Auth loading timeout. Setting loading to false.');
        setLoading(false);
      }, 10000); // 10 seconds timeout
      
      return () => {
        console.log('AuthProvider: Clearing timeout');
        clearTimeout(timer);
      };
    }
  }, [loading]);

  if (loading) {
    console.log('AuthProvider: Rendering loading spinner');
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  console.log('AuthProvider: Rendering children', { user, isPinVerified });
  return (
    <AuthContext.Provider value={{ user, isPinVerified, setPinVerified: setPinVerifiedState }}>
      {children}
    </AuthContext.Provider>
  );
}
