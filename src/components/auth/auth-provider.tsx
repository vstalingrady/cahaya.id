
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

// Define routes that do not require authentication
const PUBLIC_ROUTES = ['/login', '/signup', '/verify-phone', '/complete-profile', '/setup-security', '/terms-of-service', '/'];

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

    const isProtectedRoute = !PUBLIC_ROUTES.includes(pathname);
    
    // Redirect unauthenticated users from protected routes
    if (!user && isProtectedRoute) {
      console.log('Redirecting to login - user not authenticated');
      hasRedirected.current = true;
      router.replace('/login');
      return;
    }
    
    // Redirect authenticated users from auth pages (but not from home page)
    if (user && PUBLIC_ROUTES.includes(pathname) && pathname !== '/') {
      console.log('Redirecting to dashboard - user already authenticated');
      hasRedirected.current = true;
      router.replace('/dashboard');
      return;
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
