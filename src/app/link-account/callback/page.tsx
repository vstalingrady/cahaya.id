// src/app/link-account/callback/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

function CallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const [error, setError] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const publicToken = searchParams.get('public_token');
        const institutionId = searchParams.get('institution_id');

        if (!publicToken || !institutionId) {
            setError('Invalid callback parameters.');
            return;
        }

        const exchangeToken = async () => {
            try {
                const response = await fetch('/api/ayo/v1/token/exchange', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ public_token: publicToken }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error_description || 'Failed to exchange token.');
                }
                
                setAccessToken(data.access_token);

                // In a real app, you would save the access token securely
                // and then redirect to the dashboard.
                // For now, we'll just show the token.
                setTimeout(() => {
                    router.push('/dashboard?new_account=true');
                }, 3000);


            } catch (err: any) {
                setError(err.message);
            }
        };

        exchangeToken();
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
