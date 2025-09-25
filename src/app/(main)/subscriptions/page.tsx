
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SubscriptionsMovedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in-up mt-24">
      <h1 className="text-3xl font-bold text-primary font-serif">Page Moved!</h1>
      <p className="text-muted-foreground max-w-md">
        The Subscription Tracker has been integrated into the Insights page for a more unified experience.
      </p>
      <Button asChild className="bg-primary hover:bg-primary/90">
        <Link href="/insights">
          Go to Insights <ArrowRight className="ml-2" />
        </Link>
      </Button>
    </div>
  );
}
