'use client';

import { AuthProvider } from '@/components/auth/auth-provider';

export default function EnterPinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
