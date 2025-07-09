import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"
import { Plus_Jakarta_Sans, Domine, Roboto_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth/auth-provider';

export const metadata: Metadata = {
  title: 'Cahaya - All your money, in one place.',
  description: 'Welcome to Cahaya. The secure way to manage your finances.',
};

const jakartaSans = Plus_Jakarta_Sans({ 
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
          jakartaSans.variable,
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
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
