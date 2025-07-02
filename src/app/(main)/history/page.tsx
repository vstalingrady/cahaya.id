'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TransactionCalendar from '@/components/profile/transaction-calendar';

export default function HistoryPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-center relative">
        <Link href="/dashboard" className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-bold mx-auto bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
          Transaction History
        </h1>
      </header>

      <div className="space-y-4">
         <p className="text-muted-foreground text-center">Select a date to view all transactions from that day.</p>
         <TransactionCalendar />
      </div>

    </div>
  );
}
