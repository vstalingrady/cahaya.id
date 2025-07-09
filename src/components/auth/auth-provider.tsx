
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
    '/link-account',
    '/mock-ayo-connect',
];
// The page where a logged-in user must enter their PIN.
const PIN_ENTRY_ROUTE = '/enter-pin';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        handleSignIn(currentUser).catch(console.error);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isPublic = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
    
    // If there is a logged-in user...
    if (user) {
        // ...and they are on a public-only page (like login/signup), redirect them.
        // This prevents a logged-in user from seeing the signup page again.
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
