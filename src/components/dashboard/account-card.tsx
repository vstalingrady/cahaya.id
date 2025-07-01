import Link from 'next/link';
import { type Account } from "@/lib/data";
import NoiseOverlay from "../noise-overlay";
import { Button } from '../ui/button';
import { Trash2, X } from 'lucide-react';
import React from 'react';

const getAccountIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('bca')) {
        return <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">BCA</div>;
    }
    if (lowerName.includes('gopay')) {
        return <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-sky-700 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">GP</div>;
    }
    if (lowerName.includes('ovo')) {
        return <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">OVO</div>;
    }
    if (lowerName.includes('bibit')) {
        return <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">BB</div>;
    }
    if (lowerName.includes('pintu')) {
        return <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">PT</div>;
    }
     if (lowerName.includes('kredivo')) {
        return <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">KR</div>;
    }
    return <div className="w-14 h-14 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">AC</div>;
}

type AccountCardProps = {
  account: Account;
  onDelete: (accountId: string) => void;
};

export default function AccountCard({ account, onDelete }: AccountCardProps) {
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(account.balance);

  const isLoan = account.type === 'loan';

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(account.id);
  };

  const cardContent = (
    <>
      <NoiseOverlay opacity={0.03} />
      <div className="flex items-center flex-1 min-w-0">
          {getAccountIcon(account.name)}
          <div className="flex-1 min-w-0">
            <div className="font-bold text-lg text-white truncate">{account.name}</div>
            <div className="text-muted-foreground text-sm">{isLoan ? "Outstanding debt" : `...${account.last4}`}</div>
          </div>
      </div>
      <div className="text-right ml-2">
          <div className="font-bold text-lg text-white">{formattedAmount}</div>
      </div>
      {!isLoan && (
        <Button variant="ghost" size="icon" onClick={handleDeleteClick} className="w-8 h-8 rounded-full hover:bg-red-700/50 text-red-400 hover:text-red-200 ml-2 flex-shrink-0">
            <X className="w-4 h-4" />
        </Button>
      )}
    </>
  );

  const baseClasses = "bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-3 pr-2 rounded-2xl flex justify-between items-center border border-red-600/20 shadow-2xl relative overflow-hidden";

  if (isLoan) {
    return (
      <div className={`${baseClasses} opacity-70`}>
          {cardContent}
      </div>
    );
  }

  return (
     <Link href={`/account/${account.id}`} className={`${baseClasses} hover:from-red-800/60 hover:to-red-700/60 transition-colors duration-300 group`}>
       {cardContent}
    </Link>
  );
}
