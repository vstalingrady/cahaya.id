// src/app/mock-ayo-connect/layout.tsx

export const metadata = {
  title: 'Secure Connection',
  description: 'Connect your financial accounts securely.',
};

export default function MockConnectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-100">
      {children}
    </main>
  );
}
