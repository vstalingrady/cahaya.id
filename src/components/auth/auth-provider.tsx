
'use client';

import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { handleSignIn } from '@/lib/actions';
import { Loader2 } from 'lucide-react';

/**
 * A simplified user object that only contains primitive values.
 * This is safe to store in React state and avoids circular references
 * found in the complex FirebaseUser object.
 */
export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
}

interface AuthContextType {
  user: AppUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Routes accessible to ANY user (logged out or logged in).
const PUBLIC_ROUTES = [
    '/', 
    '/login', 
    '/signup', 
    '/verify-phone', 
    '/complete-profile', 
    '/setup-security', 
    '/terms-of-service',
    '/forgot-password',
    '/enter-pin', // The PIN page is part of the auth flow
];

const PIN_ENTRY_ROUTE = '/enter-pin';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Create a clean, simple user object for React state
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          phoneNumber: firebaseUser.phoneNumber,
        };
        setUser(appUser);
        await handleSignIn(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isPublic = PUBLIC_ROUTES.some(route => pathname.startsWith(route)) || pathname === '/';
    
    // If there is a logged-in user...
    if (user) {
        // ...and they are on a public-only page (like login/signup), redirect them.
        if (['/login', '/signup', '/verify-phone'].includes(pathname)) {
             router.replace(PIN_ENTRY_ROUTE);
        }
    } 
    // If there is NO logged-in user...
    else {
        // ...and they are trying to access a protected page, redirect them to login.
        if (!isPublic) {
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
