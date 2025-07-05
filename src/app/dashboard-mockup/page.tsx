
'use client';

// This page has been deprecated and its content moved to a component
// to avoid iframe styling issues. See /src/components/dashboard/dashboard-mockup.tsx
// This file can be safely deleted.
import Link from 'next/link';

export default function DeprecatedMockupPage() {
    return (
        <div className="text-center">
            <h1 className="text-xl font-bold">This page is deprecated.</h1>
            <p>Please use the component at /src/components/dashboard/dashboard-mockup.tsx</p>
            <Link href="/" className="text-blue-500 underline">Go to home</Link>
        </div>
    )
}
