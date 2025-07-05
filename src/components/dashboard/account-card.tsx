import Link from 'next/link';
import { type Account } from "@/lib/data";
import React from 'react';
import { cn } from '@/lib/utils';

const getAccountIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    // Removed margins from each icon, as spacing is now handled by the parent flex container's `gap` property.
    if (lowerName.includes('bca')) {
        return <div className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg flex-shrink-0">BCA</div>;
    }
    if (lowerName.includes('gopay')) {
        return <div className="w-14 h-14 bg-sky-500 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg flex-shrink-0">GP</div>;
    }
    if (lowerName.includes('ovo')) {
        return <div className="w-14 h-14 bg-purple-600 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg flex-shrink-0">OVO</div>;
    }
    if (lowerName.includes('bibit')) {
        return <div className="w-14 h-14 bg-green-500 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg flex-shrink-0">BB</div>;
    }
    if (lowerName.includes('pintu')) {
        return <div className="w-14 h-14 bg-indigo-500 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg flex-shrink-0">PT</div>;
    }
     if (lowerName.includes('kredivo')) {
        return <div className="w-14 h-14 bg-orange-500 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg flex-shrink-0">KR</div>;
    }
    return <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center text-sm font-bold shadow-lg flex-shrink-0">AC</div>;
}

type AccountCardProps = {
  account: Account;
  isPrivate: boolean;
};

const formatDisplayNumber = (account: Account): string => {
  const { accountNumber, type } = account;
  if (type === 'investment') {
    return ''; // No subtitle for investments, name is descriptive enough
  }
  if (type === 'loan') {
    return 'Outstanding debt';
  }
  if (accountNumber && accountNumber.length > 4) {
    const firstTwo = accountNumber.substring(0, 2);
    const lastTwo = accountNumber.substring(accountNumber.length - 2);
    return `${firstTwo}********${lastTwo}`;
  }
  return `...${accountNumber}`; // Fallback
};

export default function AccountCard({ account, isPrivate }: AccountCardProps) {
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(account.balance);

  const subtitle = formatDisplayNumber(account);
  const isLoan = account.type === 'loan';

  const cardContent = (
    <>
      <div className="flex items-center gap-4 flex-1 min-w-0">
          {getAccountIcon(account.name)}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg text-card-foreground truncate">{account.name}</p>
            {subtitle && <p className="text-muted-foreground text-sm truncate">{subtitle}</p>}
          </div>
      </div>
      <div className="flex-shrink-0">
          <div className={cn(
              "font-semibold text-lg whitespace-nowrap",
              isLoan ? "text-destructive" : "text-card-foreground"
            )}>
            {isPrivate ? 'IDR ••••••••' : isLoan ? `-${formattedAmount}` : formattedAmount}
          </div>
      </div>
    </>
  );

  const baseClasses = "bg-card p-3 rounded-2xl flex justify-between items-center gap-4 border border-border shadow-lg";

  const isClickable = account.type === 'bank' || account.type === 'investment';

  if (!isClickable) {
    return (
      <div className={baseClasses}>
          {cardContent}
      </div>
    );
  }

  return (
     <Link href={`/account/${account.id}`} className={`${baseClasses} hover:bg-secondary/60 transition-colors duration-300 group`}>
       {cardContent}
    </Link>
  );
}
