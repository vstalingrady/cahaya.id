
'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState, type ReactNode, useRef } from 'react';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null; // Allow null in the type
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Routes that can be accessed without authentication.
const UNAUTHENTICATED_ROUTES = ['/login', '/signup', '/verify-phone', '/'];

// Routes that are part of the initial user setup.
// An authenticated user MUST be able to access these without being redirected to the dashboard.
const ONBOARDING_ROUTES = ['/complete-profile', '/setup-security', '/terms-of-service', '/link-account'];


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false); // Prevent multiple redirects

  useEffect(() => {
    // Reset redirect flag when pathname changes
    hasRedirected.current = false;
  }, [pathname]);

  useEffect(() => {
    // This listener is the single source of truth for the user's auth state.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed:', currentUser ? 'User logged in' : 'User logged out');
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Handle redirects after auth state is determined
  useEffect(() => {
    if (loading || hasRedirected.current) return;
    
    // Allow linking flow pages to be accessed directly without auth protection
    if (pathname.startsWith('/link-account/callback') || pathname.startsWith('/mock-ayo-connect')) {
      return;
    }

    const isUnauthenticatedRoute = UNAUTHENTICATED_ROUTES.includes(pathname) || UNAUTHENTICATED_ROUTES.some(p => p !== '/' && pathname.startsWith(p));
    const isOnboardingRoute = ONBOARDING_ROUTES.includes(pathname) || ONBOARDING_ROUTES.some(p => p !== '/' && pathname.startsWith(p));

    // If the user is NOT logged in...
    if (!user) {
      // And they are trying to access a page that isn't the welcome page or an auth page, redirect them to login.
      if (!isUnauthenticatedRoute && !isOnboardingRoute) {
        console.log('Redirecting to login - user not authenticated for a protected route.');
        hasRedirected.current = true;
        router.replace('/login');
        return;
      }
    } 
    // If the user IS logged in...
    else {
      // And they are on a page meant for unauthenticated users (like login/signup), redirect them to the dashboard.
      // EXCEPTION: Do not redirect if they are in the middle of a social auth sign-up flow.
      const socialAuthInProgress = sessionStorage.getItem('social_auth_in_progress');
      
      if (isUnauthenticatedRoute && pathname !== '/' && !socialAuthInProgress) {
        console.log('Redirecting to dashboard - user already authenticated.');
        hasRedirected.current = true;
        router.replace('/dashboard');
        return;
      }
      
      // If we are on an onboarding route, we can clear the flag.
      // This means the user has successfully navigated away from the login page.
      if (socialAuthInProgress && isOnboardingRoute) {
        sessionStorage.removeItem('social_auth_in_progress');
      }
    }
  }, [user, loading, pathname, router]);

  // Show loader while determining initial auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Show loader while redirect is in progress
  if (hasRedirected.current) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Render the app with auth context
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}
