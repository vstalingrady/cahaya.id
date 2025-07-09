
'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { handleSignIn } from '@/lib/actions';
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

// Routes accessible to unauthenticated users.
const PUBLIC_ROUTES = [
    '/', 
    '/login', 
    '/signup', 
    '/verify-phone', 
    '/complete-profile', 
    '/setup-security', 
    '/terms-of-service',
    '/forgot-password',
    '/link-account', // Make the entire flow public
    '/mock-ayo-connect',
];

// Auth-specific routes that a logged-in user should be redirected away from.
const AUTH_ROUTES = ['/login', '/signup', '/verify-phone', '/complete-profile', '/setup-security', '/forgot-password'];


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        handleSignIn(currentUser).catch(error => {
            console.error("Failed to handle user sign-in:", error);
        });
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    const isPublicRoute = PUBLIC_ROUTES.some(route => {
        if (route === '/') return pathname === '/';
        return pathname.startsWith(route);
    });

    const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

    // If the user is logged in...
    if (user) {
        // ...and they are on an auth page (like /login), redirect them to the next step.
        if (isAuthRoute) {
            router.replace('/enter-pin');
        }
    } 
    // If the user is not logged in...
    else {
        // ...and they are trying to access a protected route, redirect them to login.
        if (!isPublicRoute) {
            router.replace('/login');
        }
    }
  }, [user, loading, pathname, router]);

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
