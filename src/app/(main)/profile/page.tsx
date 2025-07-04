
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, User, Mail, Phone, CheckCircle2, Cog, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/auth-provider';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-center relative">
        <Link href="/dashboard" className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-bold mx-auto font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Profile & Settings
        </h1>
      </header>

      <div className="bg-card backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
        
        <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
                <Image 
                    src={user.photoURL || 'https://placehold.co/128x128.png'}
                    alt="User Avatar"
                    width={96}
                    height={96}
                    className="rounded-full border-4 border-primary/50"
                    data-ai-hint="person avatar"
                />
            </div>
            <h2 className="text-xl font-semibold text-white font-serif">{user.displayName || 'Anonymous User'}</h2>
        </div>

        <div className="my-8 space-y-4">
            <div className="flex items-start gap-4 bg-secondary p-4 rounded-lg">
                <Mail className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0"/>
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Email</p>
                        {user.emailVerified && (
                          <Badge variant="outline" className="bg-green-900/50 border-green-700 text-green-300 text-xs">
                              <CheckCircle2 className="w-3 h-3 mr-1.5"/>
                              Verified
                          </Badge>
                        )}
                    </div>
                    <p className="text-white font-semibold mt-0.5">{user.email || 'No email provided'}</p>
                </div>
            </div>
            <div className="flex items-start gap-4 bg-secondary p-4 rounded-lg">
                <Phone className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0"/>
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="text-white font-semibold mt-0.5">{user.phoneNumber || 'No phone provided'}</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-6 border-t border-border/50">
           <Button variant="outline" className="w-full justify-start text-left font-normal bg-secondary border-border h-14 text-base placeholder:text-muted-foreground hover:bg-secondary/80 hover:text-white" disabled>
             <User className="mr-3" /> Update Profile
           </Button>
           <Button asChild variant="outline" className="w-full justify-start text-left font-normal bg-secondary border-border h-14 text-base placeholder:text-muted-foreground hover:bg-secondary/80 hover:text-white">
             <Link href="/profile/security">
                <Shield className="mr-3" /> Security & Login
             </Link>
           </Button>
           <Button variant="outline" className="w-full justify-start text-left font-normal bg-secondary border-border h-14 text-base placeholder:text-muted-foreground hover:bg-secondary/80 hover:text-white" disabled>
             <Cog className="mr-3" /> App Settings
           </Button>
        </div>
      </div>
    </div>
  );
}
