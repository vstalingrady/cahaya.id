'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ArrowLeftRight, PiggyBank, PieChart, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import NoiseOverlay from './noise-overlay';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/transfer', icon: ArrowLeftRight, label: 'Pay' },
  { href: '/budgets', icon: ClipboardList, label: 'Budgets' },
  { href: '/insights', icon: PieChart, label: 'Insights' },
  { href: '/vaults', icon: PiggyBank, label: 'Vaults' },
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-background/70 backdrop-blur-lg border-t border-border relative shadow-[0_-5px_25px_-10px_hsl(var(--primary)/0.2)]">
      <NoiseOverlay opacity={0.03} />
      <div className="flex justify-around items-center h-20">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link href={item.href} key={item.label} className="flex-1 flex justify-center items-center h-full">
              <div
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 w-full',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary/80'
                )}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs font-semibold">{item.label}</span>
                {isActive && (
                    <div className="w-8 h-1 bg-primary rounded-full mt-1"></div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
