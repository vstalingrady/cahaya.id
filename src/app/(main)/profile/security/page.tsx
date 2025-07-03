'use client';

import { getLoginHistory } from '@/lib/data';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';

export default function SecurityPage() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const loginHistory = await getLoginHistory(currentUser.uid);
        setHistory(loginHistory);
      } else {
        // Handle user not logged in
        setUser(null);
        setHistory([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Login History</h2>
        <p className="text-muted-foreground">
          Here is a list of recent login activity on your account.
        </p>
      </div>
      <div className="border rounded-lg">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">IP Address</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Device</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {history.map((item) => (
                <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle">{new Date(item.timestamp.seconds * 1000).toLocaleString()}</td>
                  <td className="p-4 align-middle">{item.ipAddress}</td>
                  <td className="p-4 align-middle">{item.userAgent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
