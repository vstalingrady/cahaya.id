
'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

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
      if (currentUser && !currentUser.displayName) {
        // If user is logged in but has no display name, try to fetch it from Firestore
        // to handle cases where the auth profile is stale.
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists() && userDoc.data().fullName) {
          // Manually enrich the user object with data from Firestore for immediate UI updates.
          const enrichedUser = {
            ...currentUser,
            displayName: userDoc.data().fullName,
            photoURL: currentUser.photoURL || userDoc.data().photoURL || null,
          } as User;
          setUser(enrichedUser);
        } else {
          setUser(currentUser);
        }
      } else {
        setUser(currentUser);
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
