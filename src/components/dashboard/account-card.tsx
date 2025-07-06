
import Link from 'next/link';
import Image from 'next/image';
import { type Account, financialInstitutions } from "@/lib/data";
import React from 'react';
import { cn } from '@/lib/utils';

const getAccountLogo = (account: Account) => {
    const institution = financialInstitutions.find(inst => inst.slug === account.institutionSlug);

    if (institution?.logoUrl) {
        return (
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-md flex-shrink-0">
                <Image
                    src={institution.logoUrl}
                    alt={`${account.name} logo`}
                    width={48}
                    height={48}
                    className="object-contain h-full w-full"
                    data-ai-hint={`${institution.name} logo`}
                />
            </div>
        );
    }

    // Fallback to a simple div with initials if no logo is found
    const initials = account.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return (
        <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center text-sm font-bold shadow-lg flex-shrink-0">
            {initials}
        </div>
    );
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
          {getAccountLogo(account)}
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

  const baseClasses = "bg-background p-3 rounded-2xl flex justify-between items-center gap-4 border border-border shadow-lg";

  const isClickable = account.type === 'bank' || account.type === 'investment';

  if (!isClickable) {
    return (
      <div className={baseClasses}>
          {cardContent}
      </div>
    );
  }

  return (
     <Link href={`/account/${account.id}`} className={`${baseClasses} hover:bg-secondary transition-colors duration-300 group`}>
       {cardContent}
    </Link>
  );
}
