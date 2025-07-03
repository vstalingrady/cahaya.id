// src/app/mock-ayo-connect/layout.tsx
import '../globals.css';

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
    <html lang="en">
      <body className="bg-slate-100">
        <main className="flex items-center justify-center min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
