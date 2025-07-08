
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
    '/link-account/callback', // Special case for OAuth flow
    '/mock-ayo-connect', // Special case for mock API flow
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          // Force a refresh of the user's profile from Firebase's backend.
          await currentUser.reload();
          // Ensure user has their initial data seeded if they are new.
          await ensureUserData(currentUser.uid);
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("AuthProvider error during auth state change:", error);
        // If an error occurs (e.g., user deleted), ensure they are logged out.
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Wait until the initial authentication check is complete.
    if (loading) {
      return;
    }

    // A more precise check for public routes.
    // The root path '/' should only match exactly, not act as a prefix for all routes.
    const isPublicRoute = PUBLIC_ROUTES.some(route => {
        if (route === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(route);
    });

    // If user is logged in and tries to access a public-only route (like login/signup), redirect to dashboard.
    // We exclude the root welcome page from this rule.
    if (user && isPublicRoute && pathname !== '/') {
      router.replace('/dashboard');
    }

    // If user is not logged in and tries to access a protected route, redirect to login.
    if (!user && !isPublicRoute) {
      router.replace('/login');
    }
  }, [user, loading, pathname, router]);

  // While checking auth state or redirecting, show a loading spinner.
  if (loading) {
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
