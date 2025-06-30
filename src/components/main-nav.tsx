'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Receipt, PiggyBank, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import NoiseOverlay from './noise-overlay';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/bills', icon: Receipt, label: 'Bills' },
  { href: '/vaults', icon: PiggyBank, label: 'Vaults' },
  { href: '/insights', icon: BarChart2, label: 'Insights' },
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-black/50 backdrop-blur-lg border-t border-red-500/20 relative">
      <NoiseOverlay opacity={0.03} />
      <div className="flex justify-around items-center h-20">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link href={item.href} key={item.label} className="flex-1 flex justify-center items-center h-full">
              <div
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 w-full',
                  isActive ? 'text-red-400' : 'text-red-700 hover:text-red-500'
                )}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs font-bold">{item.label}</span>
                {isActive && (
                    <div className="w-8 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mt-1"></div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
