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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function that we can call on cleanup.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // This callback will fire once on initial load, and then
      // again whenever the user's auth state changes.
      setUser(user);
      setLoading(false);
    });

    // Cleanup the subscription when the component unmounts
    return unsubscribe;
  }, []);

  // If we are still waiting for the initial auth state from Firebase, show a loader.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // If the initial check is complete and we have a valid user, render the app.
  if (user) {
    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
  }

  // If the check is complete and there's no user, redirect to login.
  // We use router.replace() to prevent the user from being able to click "back" to the protected page.
  router.replace('/login');
  
  // Return a loader while the redirect is in progress.
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );
}
