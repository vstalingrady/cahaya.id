import Link from 'next/link';
import { type Account } from "@/lib/data";
import React from 'react';

const getAccountIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('bca')) {
        return <div className="w-14 h-14 bg-blue-600 rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">BCA</div>;
    }
    if (lowerName.includes('gopay')) {
        return <div className="w-14 h-14 bg-sky-500 rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">GP</div>;
    }
    if (lowerName.includes('ovo')) {
        return <div className="w-14 h-14 bg-purple-600 rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">OVO</div>;
    }
    if (lowerName.includes('bibit')) {
        return <div className="w-14 h-14 bg-green-500 rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">BB</div>;
    }
    if (lowerName.includes('pintu')) {
        return <div className="w-14 h-14 bg-indigo-500 rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">PT</div>;
    }
     if (lowerName.includes('kredivo')) {
        return <div className="w-14 h-14 bg-orange-500 rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">KR</div>;
    }
    return <div className="w-14 h-14 bg-secondary rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">AC</div>;
}

type AccountCardProps = {
  account: Account;
  isPrivate: boolean;
};

export default function AccountCard({ account, isPrivate }: AccountCardProps) {
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(account.balance);

  const isLoan = account.type === 'loan';

  const cardContent = (
    <>
      <div className="flex items-center flex-1 min-w-0">
          {getAccountIcon(account.name)}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-lg text-white truncate">{account.name}</div>
            <div className="text-muted-foreground text-sm">{isLoan ? "Outstanding debt" : `...${account.last4}`}</div>
          </div>
      </div>
      <div className="text-right ml-2">
          <div className="font-semibold text-lg text-white">
            {isPrivate ? 'IDR ••••••••' : formattedAmount}
          </div>
      </div>
    </>
  );

  const baseClasses = "bg-card p-3 rounded-2xl flex justify-between items-center border border-border shadow-lg";

  if (isLoan) {
    return (
      <div className={`${baseClasses} opacity-70`}>
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
