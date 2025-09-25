import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Simple Layout',
  description: 'Simple layout with auth provider',
};

export default function SimpleLayout({
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