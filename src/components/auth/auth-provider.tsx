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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // This listener fires when the component mounts and whenever the auth state changes.
      // It provides the current user object, or null if logged out.
      setUser(currentUser);
      setLoading(false); // Mark the initial check as complete.
    });

    // Cleanup the listener when the component unmounts.
    return () => unsubscribe();
  }, []); // The empty dependency array ensures this effect runs only once on mount.


  useEffect(() => {
    // This separate effect handles redirection logic.
    // It runs whenever `loading` or `user` state changes.
    
    // Don't do anything if we are still waiting for the initial auth check.
    if (loading) {
      return;
    }

    // If the check is complete and there is no user, redirect to the login page.
    if (!user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  // While the initial check is running, show a loading spinner.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }
  
  // If the check is complete and we have a user, render the protected parts of the app.
  if (user) {
    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
  }

  // If the check is complete and there's no user, the redirect is in progress.
  // Show a loader to prevent a flash of content before the redirect happens.
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );
}
