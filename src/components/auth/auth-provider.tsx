
'use client';

import { onAuthStateChanged, type User, getAuth } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth, app } from '@/lib/firebase';
import { ensureUserData } from '@/lib/actions';
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Force a refresh of the user's profile from Firebase's backend.
        await currentUser.reload();
        
        // After reloading, the currentUser object from the callback is the most up-to-date.
        // There's no need to call getAuth(app).currentUser, which might be stale.
        await ensureUserData(currentUser.uid);
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return; // Don't perform redirects until auth state is resolved

    let shouldRedirect = false;
    const isUnauthenticatedRoute = UNAUTHENTICATED_ROUTES.some(p => p !== '/' && pathname.startsWith(p)) || pathname === '/';
    const isOnboardingRoute = ONBOARDING_ROUTES.some(p => pathname.startsWith(p));
    const isSpecialRoute = pathname.startsWith('/link-account/callback') || pathname.startsWith('/mock-ayo-connect');
    
    if (isSpecialRoute) {
        setIsRedirecting(false);
        return;
    }

    if (!user && !isUnauthenticatedRoute && !isOnboardingRoute) {
      router.replace('/login');
      shouldRedirect = true;
    }

    if (user) {
      const socialAuthInProgress = sessionStorage.getItem('social_auth_in_progress');
      if (isUnauthenticatedRoute && pathname !== '/' && !socialAuthInProgress) {
        router.replace('/dashboard');
        shouldRedirect = true;
      }
      if (socialAuthInProgress && isOnboardingRoute) {
        sessionStorage.removeItem('social_auth_in_progress');
      }
    }
    setIsRedirecting(shouldRedirect);
  }, [user, pathname, router, loading]);


  if (loading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}
