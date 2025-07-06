
'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
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

// This enum helps manage the possible states of authentication.
type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export function AuthProvider({ children }: { children: ReactNode }) {
  // We manage the user and the auth status in a single state object
  // to prevent race conditions between separate state updates.
  const [authState, setAuthState] = useState<{ status: AuthStatus; user: User | null }>({
    status: 'loading',
    user: null,
  });
  const router = useRouter();

  // This effect subscribes to Firebase's auth state changes.
  // It's the single source of truth for whether a user is logged in.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If Firebase returns a user object, we are authenticated.
        setAuthState({ status: 'authenticated', user });
      } else {
        // If Firebase returns null, the user is not logged in.
        setAuthState({ status: 'unauthenticated', user: null });
      }
    });

    // Cleanup the subscription on component unmount.
    return () => unsubscribe();
  }, []);

  // This effect handles the redirection logic.
  // It runs whenever the authentication status changes.
  useEffect(() => {
    // If the status is 'unauthenticated', it's safe to redirect to the login page.
    if (authState.status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [authState.status, router]);

  // --- Render Logic ---

  // 1. While the status is 'loading', we show a full-screen loader.
  // This is the default state until Firebase confirms the user's session.
  if (authState.status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // 2. If the status is 'authenticated', we have a valid user.
  // We can safely render the children components (the protected parts of the app).
  if (authState.status === 'authenticated' && authState.user) {
    return (
      <AuthContext.Provider value={{ user: authState.user }}>
        {children}
      </AuthContext.Provider>
    );
  }

  // 3. If the status is 'unauthenticated', the useEffect above will trigger a redirect.
  // We render a loader here to prevent a "flash" of an empty screen or the login page
  // before the redirect is fully processed by the browser.
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );
}
