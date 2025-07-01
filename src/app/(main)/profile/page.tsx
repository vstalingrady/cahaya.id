'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, User, Mail, Phone, CheckCircle2, UserCog, Cog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NoiseOverlay from '@/components/noise-overlay';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const user = {
    name: 'Vstalin Grady',
    email: 'vstalin.grady@email.com',
    phone: '+62 812 3456 7890',
    avatarUrl: 'https://placehold.co/128x128.png',
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-center relative">
        <Link href="/dashboard" className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-black mx-auto bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
          Profile & Settings
        </h1>
      </header>

      <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-8 rounded-2xl border border-red-600/20 shadow-2xl relative overflow-hidden">
        <NoiseOverlay opacity={0.03} />
        
        <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
                <Image 
                    src={user.avatarUrl}
                    alt="User Avatar"
                    width={96}
                    height={96}
                    className="rounded-full border-4 border-red-700/50"
                    data-ai-hint="person avatar"
                />
            </div>
            <h2 className="text-2xl font-bold text-white font-serif">{user.name}</h2>
        </div>

        <div className="my-8 space-y-4">
            <div className="flex items-start gap-4 bg-red-950/50 p-4 rounded-lg">
                <Mail className="w-5 h-5 text-red-300 mt-1 flex-shrink-0"/>
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-red-300">Email</p>
                        <Badge variant="outline" className="bg-green-900/50 border-green-700 text-green-300 text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1.5"/>
                            Verified
                        </Badge>
                    </div>
                    <p className="text-white font-semibold mt-0.5">{user.email}</p>
                </div>
            </div>
            <div className="flex items-start gap-4 bg-red-950/50 p-4 rounded-lg">
                <Phone className="w-5 h-5 text-red-300 mt-1 flex-shrink-0"/>
                <div className="flex-1">
                    <p className="text-sm text-red-300">Phone</p>
                    <p className="text-white font-semibold mt-0.5">{user.phone}</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-6 border-t border-red-800/50">
           <Button variant="outline" className="w-full justify-start text-left font-normal bg-red-950/50 border-red-800/50 h-14 text-base placeholder:text-red-300/70 hover:bg-red-950/80 hover:text-white" disabled>
             <User className="mr-3" /> Update Profile
           </Button>
           <Button variant="outline" className="w-full justify-start text-left font-normal bg-red-950/50 border-red-800/50 h-14 text-base placeholder:text-red-300/70 hover:bg-red-950/80 hover:text-white" disabled>
             <UserCog className="mr-3" /> Pengaturan Akun
           </Button>
           <Button variant="outline" className="w-full justify-start text-left font-normal bg-red-950/50 border-red-800/50 h-14 text-base placeholder:text-red-300/70 hover:bg-red-950/80 hover:text-white" disabled>
             <Cog className="mr-3" /> Pengaturan Aplikasi
           </Button>
        </div>
      </div>
    </div>
  );
}
