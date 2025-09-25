import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Test Layout',
  description: 'Test layout',
};

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased min-h-screen font-sans bg-background">
        <main>{children}</main>
      </body>
    </html>
  );
}