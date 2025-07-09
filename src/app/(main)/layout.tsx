'use client';

import { usePathname } from 'next/navigation';
import MainNav from '@/components/main-nav';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 p-6">
                {children}
            </main>
            {/* The MainNav component is positioned at the bottom */}
            {!isHomePage && <MainNav />}
        </div>
    );
}
