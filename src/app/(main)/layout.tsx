'use client';

import { usePathname } from 'next/navigation';
import MainNav from '@/components/main-nav';
import { cn } from '@/lib/utils';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const isChatPage = pathname === '/chat';

    return (
        <div className="flex flex-col h-screen">
            <main className={cn(
                "flex-1 flex flex-col",
                isChatPage ? "p-0" : "p-6 pb-24"
            )}>
                {children}
            </main>
            <MainNav />
        </div>
    );
}
