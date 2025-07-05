'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User as UserIcon, Mail, Phone, CheckCircle2, Shield, LogOut, Loader2, Edit, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/auth-provider';
import { signOut } from 'firebase/auth';
import { auth, storage } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { updateUserProfile } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred while logging out. Please try again.",
      });
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
        // If canceling, reset fields to original user data
        setDisplayName(user?.displayName || '');
        setEmail(user?.email || '');
        setPhone(user?.phoneNumber || '');
    }
    setIsEditing(!isEditing);
  }

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
        await updateUserProfile(user.uid, { displayName, email, phone });
        toast({
            title: "Profile Updated",
            description: "Your information has been saved successfully.",
        });
        setIsEditing(false);
        router.refresh();
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: error.message || "Could not save your changes.",
        });
    } finally {
        setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({ variant: 'destructive', title: 'File too large', description: 'Please select an image smaller than 5MB.' });
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast({ variant: 'destructive', title: 'Invalid file type', description: 'Please select an image file (jpg, png, etc.).' });
      return;
    }

    setIsUploading(true);
    try {
      const filePath = `avatars/${user.uid}/${Date.now()}_${file.name}`;
      const fileRef = storageRef(storage, filePath);
      
      const snapshot = await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(snapshot.ref);

      await updateUserProfile(user.uid, { photoURL });

      toast({ title: "Avatar Updated", description: "Your new profile picture has been saved." });
      router.refresh();

    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({ variant: 'destructive', title: 'Upload Failed', description: 'Could not upload your new avatar.' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-center relative">
        <Link href="/dashboard" className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <h1 className="text-2xl font-bold mx-auto font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Profile & Settings
        </h1>
      </header>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        hidden
        accept="image/png, image/jpeg, image/gif"
      />

      <div className="bg-card backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
        
        <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 group">
                <Image 
                    src={user?.photoURL || 'https://placehold.co/128x128.png'}
                    alt="User Avatar"
                    width={96}
                    height={96}
                    className="rounded-full border-4 border-primary/50"
                    data-ai-hint="person avatar"
                />
                 <button 
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-secondary rounded-full flex items-center justify-center border-2 border-background hover:bg-primary transition-colors cursor-pointer"
                    onClick={handleAvatarClick}
                    disabled={isUploading}
                >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit className="w-4 h-4 text-foreground" />}
                </button>
            </div>
            {isEditing ? (
                <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="text-xl font-semibold text-foreground font-serif bg-input h-auto p-1 text-center border-primary/50"
                />
            ) : (
                <h2 className="text-xl font-semibold text-foreground font-serif">{user?.displayName || 'User'}</h2>
            )}
        </div>

        <div className="my-8 space-y-4">
            <div className="space-y-1">
                <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
                    <Input id="email" value={email} onChange={e => setEmail(e.target.value)} readOnly={!isEditing} className="bg-input border-border h-14 pl-12 text-base disabled:opacity-100 disabled:cursor-default" />
                    {user?.emailVerified && (
                        <Badge variant="outline" className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary/20 border-primary/50 text-primary text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1.5"/>
                            Verified
                        </Badge>
                    )}
                </div>
            </div>
             <div className="space-y-1">
                <Label htmlFor="phone" className="text-sm text-muted-foreground">Phone</Label>
                <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
                    <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} readOnly={!isEditing} className="bg-input border-border h-14 pl-12 text-base disabled:opacity-100 disabled:cursor-default" />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
            {isEditing ? (
                <div className="flex gap-2">
                    <Button variant="outline" className="w-full h-12" onClick={handleEditToggle}>
                        <X className="mr-2"/> Cancel
                    </Button>
                    <Button className="w-full h-12" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="animate-spin" /> : <><Save className="mr-2"/> Save Changes</>}
                    </Button>
                </div>
            ) : (
                <Button variant="outline" className="w-full justify-center h-12 text-base" onClick={handleEditToggle}>
                    <Edit className="mr-3" /> Edit Profile
                </Button>
            )}
        </div>

        <Separator className="my-6 bg-border/50" />
        
        {/* APP SETTINGS */}
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


        <Separator className="my-6 bg-border/50" />

        <Button variant="destructive" className="w-full h-14 text-base" onClick={handleLogout}>
            <LogOut className="mr-3" /> Log Out
        </Button>
      </div>
    </div>
  );
}
