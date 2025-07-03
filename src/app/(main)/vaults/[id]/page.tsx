'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Edit, PlusCircle } from 'lucide-react';

import { vaults } from '@/lib/data';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
}).format(value);

const icons: { [key: string]: string } = {
  "Emergency": "🚨",
  "Holiday": "✈️",
  "New Gadget": "📱",
  "Home": "🏠",
  "Wedding": "💍",
};

export default function VaultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vaultId = params.id as string;

  const vault = vaults.find(v => v.id === vaultId);

  if (!vault) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <header className="flex items-center relative">
          <Link href="/vaults" className="absolute left-0">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-2xl font-bold mx-auto font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Error
          </h1>
        </header>
        <Alert variant="destructive">
          <AlertDescription>Vault not found. Please go back to the vaults list.</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const progress = (vault.currentAmount / vault.targetAmount) * 100;
  const progressPercentage = `${Math.round(progress)}%`;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-center relative">
        <Link href="/vaults" className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-bold mx-auto font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate px-12">
           {icons[vault.icon] || '💰'} {vault.name}
        </h1>
        <button className="absolute right-0 text-muted-foreground hover:text-white">
            <Edit className="w-5 h-5"/>
        </button>
      </header>

      {vault.imageUrl && (
        <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg shadow-primary/10 border-2 border-primary/20">
           <Image
            src={vault.imageUrl}
            alt={vault.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint="travel goal"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      )}

      <div className="bg-card p-5 rounded-2xl border border-border shadow-lg">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-white font-semibold">{formatCurrency(vault.currentAmount)}</span>
            <span className="text-muted-foreground text-sm">Target: {formatCurrency(vault.targetAmount)}</span>
          </div>
          <div className="relative">
            <Progress value={progress} className="h-3" />
            <div 
              className="absolute -top-1 text-xs font-bold text-white bg-primary px-2 py-0.5 rounded-full"
              style={{ left: `calc(${progress}% - 1.25rem)`}}
            >
                {progressPercentage}
            </div>
          </div>
      </div>

       {vault.isShared && vault.members && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white font-serif">Members ({vault.members.length})</h2>
          <div className="grid grid-cols-1 gap-3">
            {vault.members.map(member => (
              <div key={member.id} className="bg-card p-4 rounded-xl flex items-center justify-between border border-border">
                <div className="flex items-center gap-3">
                   <Image 
                    className="w-10 h-10 rounded-full" 
                    src={member.avatarUrl} 
                    alt={member.name}
                    width={40}
                    height={40}
                    data-ai-hint="person avatar"
                   />
                   <span className="font-semibold text-white">{member.name}</span>
                </div>
                 <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">View Contributions</Button>
              </div>
            ))}
          </div>
        </div>
      )}

       <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white font-serif">Recent Activity</h2>
           <div className="bg-card p-4 rounded-xl text-center text-muted-foreground border border-border">
                No recent activity for this vault.
            </div>
       </div>

       <div className="grid grid-cols-1 gap-4 pt-4 border-t border-border/50">
           <Button className="w-full bg-primary text-primary-foreground h-14 text-lg">
                <PlusCircle className="mr-2"/> Add Funds
            </Button>
       </div>
    </div>
  );
}
