import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"
import { Lexend, Domine, Roboto_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth/auth-provider';
import OfflineDetector from '@/components/offline-detector';
import NavBar from '@/components/ui/nav-bar';

export const metadata: Metadata = {
  title: 'Caharaya - Your Financial Command Center',
  description: 'Caharaya is your Financial Command Center - a secure, intuitive platform that aggregates all your financial accounts to provide a single view of your total net worth, transaction history, and smart financial insights. Solve financial fragmentation once and for all.',
  manifest: '/manifest.json',
  icons: {
    icon: '/cahayawebicon.svg',
    apple: '/cahayawebicon.svg',
    shortcut: '/cahayawebicon.svg',
  },
};

const lexend = Lexend({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans' 
});
const domine = Domine({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
  display: 'swap',
});
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mono',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={cn(
          'antialiased min-h-screen font-sans bg-background',
          lexend.variable,
          domine.variable,
          robotoMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <OfflineDetector>
              <NavBar />
              <main className="flex-1 pt-16">{children}</main>
            </OfflineDetector>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
