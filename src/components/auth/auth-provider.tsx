
'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User;
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

  useEffect(() => {
    // This listener is the single source of truth for the user's auth state.
    // It fires once on initial load, and again whenever the auth state changes.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // The initial check is now complete.
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // While the initial auth state is being determined, show a full-screen loader.
  // This is the most crucial part of the fix. We don't do any logic until we know
  // for sure if a user is logged in or not.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const isProtectedRoute = !PUBLIC_ROUTES.includes(pathname);
  
  // If the initial check is complete, and we are on a protected route without a user,
  // we must redirect to login.
  if (!user && isProtectedRoute) {
    router.replace('/login');
    // Return a loader while the redirect is in progress to avoid screen flicker.
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }
  
  // If the initial check is complete, and we have a user but they are on a public-only route,
  // we should redirect them to the dashboard.
  if (user && PUBLIC_ROUTES.includes(pathname) && pathname !== '/') {
      router.replace('/dashboard');
      // Return a loader while the redirect is in progress.
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      );
  }

  // If we've reached this point, the user's state is valid for the route they are on.
  // We can either render the protected content with the user context, or render the public page.
  if (user) {
    return (
      <AuthContext.Provider value={{ user }}>
        {children}
      </AuthContext.Provider>
    );
  }

  // For public routes when the user is not logged in.
  return <>{children}</>;
}
