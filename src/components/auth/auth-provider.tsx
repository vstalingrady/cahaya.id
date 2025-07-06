
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Don't perform any redirects until the initial auth check is complete.
    if (loading) {
      return;
    }

    const isProtectedRoute = !PUBLIC_ROUTES.includes(pathname);

    // If the user is not logged in and is trying to access a protected route,
    // redirect them to the login page.
    if (!user && isProtectedRoute) {
      router.replace('/login');
    }
    
    // If the user IS logged in and trying to access a public-only route (like login),
    // redirect them to the dashboard.
    if (user && PUBLIC_ROUTES.includes(pathname) && pathname !== '/') {
        router.replace('/dashboard');
    }
  }, [user, loading, router, pathname]);

  // While the initial auth state is being determined, show a full-screen loader.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // If the user is authenticated, provide the user context and render the children.
  if (user) {
    return (
      <AuthContext.Provider value={{ user }}>
        {children}
      </AuthContext.Provider>
    );
  }

  // If the user is not authenticated, but they are on a public route,
  // render the children without the user context.
  if (!user && PUBLIC_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  // If none of the above conditions are met (e.g., a protected route is being accessed
  // by a logged-out user and the redirect is in progress), show a loader.
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );
}
