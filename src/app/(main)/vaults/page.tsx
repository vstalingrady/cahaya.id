
'use client'

import { useState } from "react";
import { Plus, Repeat, Trash2, Link2, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { vaults, accounts, Vault } from '@/lib/data';
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const icons: { [key: string]: string } = {
  "Emergency": "🚨",
  "Holiday": "✈️",
  "New Gadget": "📱",
  "Home": "🏠",
  "Wedding": "💍",
};

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
}).format(value);

const getAccountName = (accountId: string) => {
    return accounts.find(acc => acc.id === accountId)?.name || 'Unknown Account';
}

export default function VaultsPage() {
    const [vaultsList, setVaultsList] = useState<Vault[]>(vaults);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [vaultToDelete, setVaultToDelete] = useState<Vault | null>(null);
    const { toast } = useToast();

    const handleDeleteClick = (e: React.MouseEvent, vault: Vault) => {
        e.preventDefault();
        e.stopPropagation();
        setVaultToDelete(vault);
        setShowDeleteDialog(true);
    }

    const handleDeleteConfirm = () => {
        if (!vaultToDelete) return;

        setVaultsList(vaultsList.filter(v => v.id !== vaultToDelete.id));
        toast({
            title: "Vault Deleted",
            description: `The "${vaultToDelete.name}" vault has been successfully deleted.`,
        });
        setShowDeleteDialog(false);
        setVaultToDelete(null);
    }

    return (
        <>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="bg-popover border-border">
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        <span className="font-semibold text-foreground"> {vaultToDelete?.name} </span> vault.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Yes, delete vault
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            <div className="space-y-6 animate-fade-in-up">
                <div>
                    <h1 className="text-3xl font-bold mb-1 font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Cuan Vaults
                    </h1>
                    <p className="text-muted-foreground">Save for all your goals, together.</p>
                </div>

                <div className="space-y-4">
                    {vaultsList.map(vault => (
                        <Link key={vault.id} href={`/vaults/${vault.id}`} className="block bg-card backdrop-blur-xl p-5 rounded-2xl border border-border shadow-lg shadow-primary/10 transition-all duration-300 hover:border-primary/50 group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl">{icons[vault.icon] || '💰'}</div>
                                    <div>
                                        <p className="font-semibold text-lg text-white">{vault.name}</p>
                                        <p className="text-sm text-white font-semibold">{formatCurrency(vault.currentAmount)} <span className="font-normal text-muted-foreground">of {formatCurrency(vault.targetAmount)}</span></p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground" onClick={(e) => handleDeleteClick(e, vault)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <Progress value={(vault.currentAmount / vault.targetAmount) * 100} className="h-2 bg-secondary [&>div]:bg-primary" />
                            <div className="flex items-center justify-between mt-3">
                                <div className="text-xs text-muted-foreground space-y-1">
                                    {vault.autoSaveEnabled && (
                                        <div className="flex items-center gap-2 font-semibold text-green-400">
                                            <Repeat className="w-3 h-3" />
                                            <span>Auto-saving {formatCurrency(vault.autoSaveAmount || 0)} / {vault.autoSaveFrequency}</span>
                                        </div>
                                    )}
                                    {vault.roundUpEnabled && (
                                        <div className="flex items-center gap-2 font-semibold text-green-400">
                                            <Link2 className="w-3 h-3" />
                                            <span>Round-up savings active</span>
                                        </div>
                                    )}
                                </div>
                                {vault.isShared && vault.members && (
                                     <TooltipProvider>
                                        <div className="flex -space-x-3 rtl:space-x-reverse items-center">
                                            {vault.members.map(member => (
                                                 <Tooltip key={member.id}>
                                                    <TooltipTrigger asChild>
                                                        <Image 
                                                            className="w-8 h-8 border-2 border-card rounded-full" 
                                                            src={member.avatarUrl} 
                                                            alt={member.name}
                                                            width={32}
                                                            height={32}
                                                            data-ai-hint="person avatar"
                                                         />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{member.name}</p>
                                                    </TooltipContent>
                                                 </Tooltip>
                                            ))}
                                            <div className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-primary border-2 border-card rounded-full">
                                                +{vault.members.length}
                                            </div>
                                        </div>
                                     </TooltipProvider>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>

                <Link href="/vaults/add" className="w-full bg-card p-5 rounded-2xl flex items-center justify-center text-muted-foreground border-2 border-dashed border-border hover:border-primary/80 hover:text-primary transition-all duration-300 group">
                    <Plus className="w-6 h-6 mr-3 transition-colors" />
                    <span className="font-semibold transition-colors">Create New Vault</span>
                </Link>
            </div>
        </>
    );
}
