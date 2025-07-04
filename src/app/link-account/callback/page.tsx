// src/app/link-account/callback/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { exchangePublicToken } from '@/lib/actions';

function CallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const [error, setError] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const publicToken = searchParams.get('public_token');

        if (!publicToken) {
            setError('Invalid callback parameters.');
            return;
        }

        const processToken = async () => {
            const result = await exchangePublicToken(publicToken);

            if (result.error) {
                setError(result.error);
            } else if (result.accessToken) {
                setAccessToken(result.accessToken);
                // In a real app, you would save the access token securely
                // and then redirect to the dashboard.
                setTimeout(() => {
                    router.push('/dashboard?new_account=true');
                }, 3000);
            } else {
                 setError('An unknown error occurred during token exchange.');
            }
        };

        processToken();
    }, [searchParams, router]);

    return (
        <div className="w-full max-w-md mx-auto text-center">
            {accessToken && !error && (
                <div>
                    <h1 className="text-2xl font-bold text-green-500">Connection Successful!</h1>
                    <p className="mt-2 text-slate-600">Your account has been linked.</p>
                    <div className="mt-4 p-4 bg-slate-100 rounded-lg text-left text-sm break-all">
                        <p className="font-bold">Access Token:</p>
                        <p>{accessToken}</p>
                    </div>
                    <p className="mt-4 text-slate-500">Redirecting to your dashboard...</p>
                </div>
            )}
            {!accessToken && !error && (
                <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="mt-4 text-lg font-semibold">Finalizing secure connection...</p>
                </div>
            )}
            {error && (
                 <div>
                    <h1 className="text-2xl font-bold text-red-500">Connection Failed</h1>
                    <p className="mt-2 text-slate-600">{error}</p>
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
