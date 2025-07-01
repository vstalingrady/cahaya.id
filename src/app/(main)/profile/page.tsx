'use client';

import Link from 'next/link';
import { ArrowLeft, User, Lock, History } from 'lucide-react';
import TransactionCalendar from '@/components/profile/transaction-calendar';
import { Button } from '@/components/ui/button';
import NoiseOverlay from '@/components/noise-overlay';

export default function ProfilePage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-center relative">
        <Link href="/dashboard" className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-black mx-auto bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
          Profile & Settings
        </h1>
      </header>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white font-serif">Account</h2>
        <div className="grid grid-cols-1 gap-4">
           <Button variant="outline" className="w-full justify-start text-left font-normal bg-red-950/50 border-red-800/50 h-14 text-base placeholder:text-red-300/70 hover:bg-red-950/80 hover:text-white" disabled>
             <User className="mr-3" /> Update Profile
           </Button>
           <Button variant="outline" className="w-full justify-start text-left font-normal bg-red-950/50 border-red-800/50 h-14 text-base placeholder:text-red-300/70 hover:bg-red-950/80 hover:text-white" disabled>
             <Lock className="mr-3" /> Update Password
           </Button>
        </div>
      </div>
      
      <div className="space-y-4">
         <h2 className="text-xl font-semibold text-white font-serif flex items-center gap-2"><History /> Transaction History</h2>
         <p className="text-muted-foreground">Select a date to view all transactions from that day.</p>
         <TransactionCalendar />
      </div>

    </div>
  );
}
