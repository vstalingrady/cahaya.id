
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup the subscription when the component unmounts
    return unsubscribe;
  }, []);

  useEffect(() => {
    // This effect runs after the initial render and whenever the loading or user state changes.
    // It's the correct place to handle side-effects like redirection.
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  // While Firebase is initializing, show a loader.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // If there's a user, the app is ready to be rendered.
  if (user) {
    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
  }

  // If there's no user and we're not loading, it means the redirect effect is about to run.
  // Show a loader to prevent any content flash while redirecting.
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );
}
