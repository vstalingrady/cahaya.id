import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"
import { Plus_Jakarta_Sans, DM_Serif_Display } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Cuan - All your money, in one place.',
  description: 'Welcome to Cuan. The secure way to manage your finances.',
};

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' });
const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <body
        className={cn(
          'antialiased min-h-screen font-sans bg-background',
          jakarta.variable,
          dmSerifDisplay.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
