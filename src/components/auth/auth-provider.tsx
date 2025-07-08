
'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth } from '@/lib/firebase';
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

// Routes accessible to unauthenticated users. All other routes are protected.
const PUBLIC_ROUTES = [
    '/', 
    '/login', 
    '/signup', 
    '/verify-phone', 
    '/complete-profile', 
    '/setup-security', 
    '/terms-of-service',
    '/link-account', // Make the entire flow public
    '/mock-ayo-connect',
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Set the user state immediately.
      setUser(currentUser);
      
      // If a user is logged in, ensure their backend data exists.
      // This is done without `await` to avoid blocking the UI.
      if (currentUser) {
        ensureUserData(currentUser.uid).catch(error => {
            // Log the error but don't crash the app. The user can continue.
            console.error("Failed to ensure user data:", error);
        });
      }
      
      // We are no longer loading the initial auth state.
      setLoading(false);
    });
    
    // Cleanup the subscription on unmount.
    return () => unsubscribe();
  }, []); // This effect should only run once.

  useEffect(() => {
    // Don't perform redirects until the initial auth check is complete.
    if (loading) {
      return;
    }

    const isPublicRoute = PUBLIC_ROUTES.some(route => {
        if (route === '/') {
            return pathname === '/';
        }
        // Make sure /link-account and its sub-paths are public.
        return pathname.startsWith(route);
    });

    // If user is logged in and on a public route (that isn't the landing page), redirect to dashboard.
    if (user && isPublicRoute && pathname !== '/') {
      router.replace('/dashboard');
    }

    // If user is not logged in and on a protected route, redirect to login.
    if (!user && !isPublicRoute) {
      router.replace('/login');
    }
  }, [user, loading, pathname, router]);

  // While the initial auth check is running, show a full-screen loader.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Render the children within the provider's context.
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}
