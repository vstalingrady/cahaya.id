
'use client'

import { useState, useEffect } from "react";
import { Plus, Repeat, Trash2, Coins, ArrowUpFromLine, ArrowDownToLine, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { type Vault, type Account } from '@/lib/data';
import { getVaults, getDashboardData, deleteVault } from '@/lib/actions';
import { useAuth } from '@/components/auth/auth-provider';
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

export default function VaultsPage() {
    const { user } = useAuth();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(true);
    const [vaults, setVaults] = useState<Vault[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [vaultToDelete, setVaultToDelete] = useState<Vault | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const [fetchedVaults, dashboardData] = await Promise.all([
                    getVaults(user.uid),
                    getDashboardData(user.uid),
                ]);
                setVaults(fetchedVaults);
                setAccounts(dashboardData.accounts);
            } catch (error) {
                console.error("Failed to fetch vaults data:", error);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Could not load your savings vaults.'
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user, toast]);


    const handleDeleteClick = (e: React.MouseEvent, vault: Vault) => {
        e.preventDefault();
        e.stopPropagation();
        setVaultToDelete(vault);
        setShowDeleteDialog(true);
    }

    const handleDeleteConfirm = async () => {
        if (!vaultToDelete || !user) return;
        try {
            await deleteVault(user.uid, vaultToDelete.id);
            setVaults(vaults.filter(v => v.id !== vaultToDelete.id));
            toast({
                title: "Vault Deleted",
                description: `The "${vaultToDelete.name}" vault has been successfully deleted.`,
            });
        } catch (error) {
            console.error("Failed to delete vault:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not delete the vault.' });
        } finally {
            setShowDeleteDialog(false);
            setVaultToDelete(null);
        }
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full pt-24">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      );
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


            <div className="space-y-4 animate-fade-in-up">
                <div>
                    <h1 className="text-3xl font-bold mb-1 font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Cahaya Vaults
                    </h1>
                    <p className="text-muted-foreground">Save for all your goals, together.</p>
                </div>

                <div className="space-y-4">
                    {vaults.length > 0 ? vaults.map(vault => {
                        const sourceNames = vault.sourceAccountIds
                            .map(id => accounts.find(acc => acc.id === id)?.name)
                            .filter(Boolean)
                            .join(', ');

                        const destinationName = accounts.find(acc => acc.id === vault.destinationAccountId)?.name;
                        
                        return (
                        <Link key={vault.id} href={`/vaults/${vault.id}`} className="block bg-card p-4 rounded-2xl border border-border">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3">
                                    <div className="text-2xl mt-1">{icons[vault.icon] || '💰'}</div>
                                    <div>
                                        <p className="font-semibold text-lg text-card-foreground">{vault.name}</p>
                                        <p className="text-sm">
                                            <span className="text-card-foreground font-semibold">{formatCurrency(vault.currentAmount)}</span>
                                            <span className="font-normal text-muted-foreground"> of {formatCurrency(vault.targetAmount)}</span>
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={(e) => handleDeleteClick(e, vault)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            
                            <div className="mb-3">
                                <Progress value={(vault.currentAmount / vault.targetAmount) * 100} className="h-2 bg-secondary [&>div]:bg-primary" />
                            </div>

                            <div className="flex items-center justify-between min-h-[34px]">
                                <div className="text-xs space-y-1">
                                    {vault.autoSaveEnabled && (
                                        <div className="flex items-center gap-2 font-semibold text-green-400">
                                            <Repeat className="w-3 h-3" />
                                            <span>Auto-saving {formatCurrency(vault.autoSaveAmount || 0)} / {vault.autoSaveFrequency}</span>
                                        </div>
                                    )}
                                    {vault.roundUpEnabled && (
                                        <div className="flex items-center gap-2 font-semibold text-green-400">
                                            <Coins className="w-3 h-3" />
                                            <span>Round-up savings active</span>
                                        </div>
                                    )}
                                     {sourceNames && (
                                        <div className="flex items-center gap-2 font-medium text-muted-foreground pt-1">
                                            <ArrowUpFromLine className="w-3 h-3" />
                                            <span className="truncate">From: {sourceNames}</span>
                                        </div>
                                    )}
                                    {destinationName && (
                                        <div className="flex items-center gap-2 font-medium text-muted-foreground">
                                            <ArrowDownToLine className="w-3 h-3" />
                                            <span>To: {destinationName}</span>
                                        </div>
                                    )}
                                </div>

                                {vault.isShared && vault.members && (
                                     <div className="flex -space-x-3 rtl:space-x-reverse items-center">
                                        {vault.members.slice(0, 2).map(member => (
                                            <Image key={member.id} className="w-8 h-8 rounded-full bg-muted border-2 border-card" src={member.avatarUrl} alt={member.name} width={32} height={32} data-ai-hint="person avatar"/>
                                        ))}
                                        {vault.members.length > 2 && (
                                            <div className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-primary border-2 border-card rounded-full">
                                                +{vault.members.length - 2}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Link>
                    )}) : (
                         <div className="bg-card p-6 rounded-xl text-center text-muted-foreground border border-border">
                            No savings vaults created yet. Get started by creating one!
                        </div>
                    )}
                </div>

                <Link href="/vaults/add" className="w-full bg-card p-5 rounded-2xl flex items-center justify-center text-muted-foreground border-2 border-dashed border-border hover:border-primary/80 hover:text-primary transition-colors group">
                    <Plus className="w-6 h-6 mr-3 transition-colors" />
                    <span className="font-semibold transition-colors">Create New Vault</span>
                </Link>
            </div>
        </>
    );
}
