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
            {!isHomePage && <MainNav />}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
