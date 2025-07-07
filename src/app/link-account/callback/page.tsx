// src/app/link-account/callback/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { exchangePublicToken, syncAccountsFromProvider } from '@/lib/actions';
import { useAuth } from '@/components/auth/auth-provider';

function CallbackContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const [statusMessage, setStatusMessage] = useState('Finalizing secure connection...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            // This case should ideally be handled by AuthProvider, but as a safeguard:
            setStatusMessage("User not authenticated. Redirecting to login...");
            setTimeout(() => router.push('/login'), 3000);
            return;
        }

        const publicToken = searchParams.get('public_token');

        if (!publicToken) {
            setError('Invalid callback parameters. No public token found.');
            return;
        }

        const processToken = async () => {
            try {
                // Step 1: Exchange public token for an access token
                setStatusMessage('Exchanging security token...');
                const exchangeResult = await exchangePublicToken(publicToken);

                if (exchangeResult.error || !exchangeResult.accessToken) {
                    setError(exchangeResult.error || 'Failed to get access token.');
                    return;
                }

                // Step 2: Sync accounts from the provider to our database
                setStatusMessage('Syncing accounts...');
                const syncResult = await syncAccountsFromProvider(user.uid, exchangeResult.accessToken);

                if (syncResult.error) {
                    setError(syncResult.error);
                    return;
                }

                // Step 3: Success! Redirect to dashboard.
                setStatusMessage(`Successfully linked ${syncResult.accountsAdded || 0} accounts! Redirecting...`);
                setTimeout(() => {
                    router.push('/dashboard?new_account=true');
                }, 2000);
            } catch (err: any) {
                console.error("Error during callback processing:", err);
                setError(err.message || "An unexpected error occurred.");
            }
        };

        processToken();
    }, [searchParams, router, user]);

    return (
        <div className="w-full max-w-md mx-auto text-center">
            {error ? (
                 <div>
                    <h1 className="text-2xl font-bold text-red-500">Connection Failed</h1>
                    <p className="mt-2 text-slate-600">{error}</p>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="mt-4 text-lg font-semibold">{statusMessage}</p>
                </div>
            )}
        </div>
    );
}


export default function LinkAccountCallbackPage() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Suspense fallback={<Loader2 className="w-12 h-12 animate-spin text-primary" />}>
                <CallbackContent />
            </Suspense>
        </div>
    )
}
