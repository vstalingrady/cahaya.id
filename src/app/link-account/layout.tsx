import { AuthProvider } from '@/components/auth/auth-provider';

export default function LinkAccountLayout({
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
