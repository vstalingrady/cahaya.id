'use client';

import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-center relative">
        <Link href="/profile" className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <h1 className="text-2xl font-bold mx-auto font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Settings
        </h1>
      </header>

      <div className="bg-card backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground font-serif">App Settings</h3>
          <div className="bg-secondary p-4 rounded-lg border border-border">
            <Label className="text-muted-foreground">Theme</Label>
            <ThemeSwitcher />
          </div>
          <Button asChild variant="outline" className="w-full justify-start text-left font-normal bg-secondary border-border h-14 text-base placeholder:text-muted-foreground hover:bg-secondary/80">
            <Link href="/profile/security">
              <Shield className="mr-3" /> Security & Login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
