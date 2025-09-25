
'use client';

import { getLoginHistory } from '@/lib/data';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleString();
}

const parseUserAgent = (userAgent: string) => {
    // This is a very simple parser for demonstration.
    // In a real app, you would use a library like `ua-parser-js`.
    if (userAgent.includes('Chrome')) return 'Chrome Browser';
    if (userAgent.includes('Firefox')) return 'Firefox Browser';
    if (userAgent.includes('Safari')) return 'Safari Browser';
    return 'Unknown Device';
}

export default function SecurityPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const loginHistory = await getLoginHistory(user.uid);
        setHistory(loginHistory);
      } catch (error) {
          console.error("Failed to fetch login history:", error);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-full pt-24">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-center relative">
        <Link href="/profile" className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <h1 className="text-2xl font-bold mx-auto font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Security & Login
        </h1>
      </header>

       <Alert>
          <AlertTitle>This is a Test!</AlertTitle>
          <AlertDescription>
            This page demonstrates that the app is reading from the Firestore database. Each successful login creates a new record, which is displayed here.
          </AlertDescription>
        </Alert>

      <div className="bg-card p-5 rounded-2xl border border-border shadow-lg shadow-primary/10">
        <h2 className="text-xl font-semibold text-foreground font-serif mb-2">Login History</h2>
        <p className="text-muted-foreground text-sm mb-4">
            Here are the last 10 successful logins to your account.
        </p>
        <div className="border border-border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Device</TableHead>
                <TableHead className="text-right">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length > 0 ? history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{formatDate(item.timestamp)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-secondary">
                        {parseUserAgent(item.userAgent)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">{item.ipAddress}</TableCell>
                </TableRow>
              )) : (
                 <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No login history found.
                    </TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
