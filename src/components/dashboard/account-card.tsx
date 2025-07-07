
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { type Account, financialInstitutions } from "@/lib/data";
import React, { useTransition } from 'react';
import { cn } from '@/lib/utils';
import { Pin, PinOff } from 'lucide-react';
import { togglePinAccount } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../auth/auth-provider';
import { Button } from '../ui/button';

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
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePinToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to perform this action.' });
      return;
    }

    startTransition(async () => {
      const result = await togglePinAccount(user.uid, account.id, !account.isPinned);
      if (result.success) {
        toast({ title: account.isPinned ? 'Account Unpinned' : 'Account Pinned' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error ?? 'Could not update pin status.' });
      }
    });
  };

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

  const baseClasses = "bg-background p-3 rounded-2xl flex justify-between items-center gap-4 border border-border shadow-lg group relative";

  const pinButton = (
     <Button
      variant="ghost"
      size="icon"
      onClick={handlePinToggle}
      className="absolute top-1 right-1 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity bg-background/50 hover:bg-secondary z-20"
      disabled={isPending}
    >
      {account.isPinned ? (
        <PinOff className="w-4 h-4 text-primary" />
      ) : (
        <Pin className="w-4 h-4 text-muted-foreground" />
      )}
    </Button>
  );


  const isClickable = account.type === 'bank' || account.type === 'investment' || account.type === 'loan';

  if (!isClickable) {
    return (
      <div className={baseClasses}>
          {cardContent}
          {pinButton}
      </div>
    );
  }

  return (
     <Link href={`/account/${account.id}`} className={`${baseClasses} hover:bg-secondary transition-colors duration-300`}>
       {cardContent}
       {pinButton}
    </Link>
  );
}
