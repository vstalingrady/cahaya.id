
'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { ensureUserData } from '@/lib/actions';

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

const UNAUTHENTICATED_ROUTES = ['/login', '/signup', '/'];
const ONBOARDING_ROUTES = ['/verify-phone', '/complete-profile', '/setup-security', '/terms-of-service', '/link-account'];

/**
 * A new internal component that handles all redirection logic based on auth state.
 * This keeps the main provider clean and focused on providing the user state.
 */
function AuthRedirector({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    let shouldRedirect = false;

    if (pathname.startsWith('/link-account/callback') || pathname.startsWith('/mock-ayo-connect')) {
      return;
    }

    const isUnauthenticatedRoute = UNAUTHENTICATED_ROUTES.some(p => p !== '/' && pathname.startsWith(p)) || pathname === '/';
    const isOnboardingRoute = ONBOARDING_ROUTES.some(p => pathname.startsWith(p));

    // Case 1: User is logged out and trying to access a protected page.
    if (!user && !isUnauthenticatedRoute && !isOnboardingRoute) {
      router.replace('/login');
      shouldRedirect = true;
    }

    // Case 2: User is logged in.
    if (user) {
      const socialAuthInProgress = sessionStorage.getItem('social_auth_in_progress');
      
      // And they are on a page for logged-out users (like /login or /signup).
      if (isUnauthenticatedRoute && pathname !== '/' && !socialAuthInProgress) {
        router.replace('/dashboard');
        shouldRedirect = true;
      }
      
      // Clean up the session flag after successfully reaching an onboarding page.
      if (socialAuthInProgress && isOnboardingRoute) {
        sessionStorage.removeItem('social_auth_in_progress');
      }
    }

    setIsRedirecting(shouldRedirect);
  }, [user, pathname, router]);

  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Force a refresh of the user's profile from Firebase's backend.
        // This is crucial for ensuring displayName and photoURL are up-to-date after login.
        await currentUser.reload();

        // Ensure backend data (accounts, transactions, etc.) is seeded if it's a new user.
        await ensureUserData(currentUser.uid);
        
        // Set the user state with the genuine, refreshed currentUser object.
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user }}>
      <AuthRedirector>{children}</AuthRedirector>
    </AuthContext.Provider>
  );
}
