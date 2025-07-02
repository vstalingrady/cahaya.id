'use client'

import { useState } from "react";
import { Plus, Repeat, Trash2, Coins } from "lucide-react";
import Link from "next/link";
import { vaults, accounts, Vault } from '@/lib/data';
import { Progress } from "@/components/ui/progress";
import NoiseOverlay from "@/components/noise-overlay";
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

const getAccountName = (accountId: string) => {
    return accounts.find(acc => acc.id === accountId)?.name || 'Unknown Account';
}

export default function VaultsPage() {
    const [vaultsList, setVaultsList] = useState<Vault[]>(vaults);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [vaultToDelete, setVaultToDelete] = useState<Vault | null>(null);
    const { toast } = useToast();

    const handleDeleteClick = (vault: Vault) => {
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
                <AlertDialogContent className="bg-gradient-to-br from-black via-red-950 to-black text-white border-red-800/50">
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        <span className="font-bold text-red-300"> {vaultToDelete?.name} </span> vault.
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


            <div className="space-y-8 animate-fade-in-up">
                <div>
                    <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
                        Cuan Vaults
                    </h1>
                    <p className="text-muted-foreground">Save for all your goals.</p>
                </div>

                <div className="space-y-4">
                    {vaultsList.map(vault => (
                        <div key={vault.id} className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl border border-red-600/20 shadow-lg relative overflow-hidden">
                            <NoiseOverlay opacity={0.03} />
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl">{icons[vault.icon] || '💰'}</div>
                                    <div>
                                        <p className="font-bold text-lg text-white">{vault.name}</p>
                                        <p className="text-sm text-red-300 font-bold">{formatCurrency(vault.currentAmount)} <span className="font-normal text-red-400">of {formatCurrency(vault.targetAmount)}</span></p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-red-700/50 text-red-300 hover:text-red-200" onClick={() => handleDeleteClick(vault)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <Progress value={(vault.currentAmount / vault.targetAmount) * 100} className="h-2 bg-red-900/80 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" />
                            <div className="text-xs text-red-400 mt-3 space-y-1">
                                {vault.autoSaveEnabled && (
                                    <div className="flex items-center gap-2 font-semibold text-green-400">
                                        <Repeat className="w-3 h-3" />
                                        <span>Auto-saving {formatCurrency(vault.autoSaveAmount || 0)} / {vault.autoSaveFrequency}</span>
                                    </div>
                                )}
                                 {vault.roundUpEnabled && (
                                    <div className="flex items-center gap-2 font-semibold text-sky-400">
                                        <Coins className="w-3 h-3" />
                                        <span>Round-up savings active</span>
                                    </div>
                                )}
                                <p className="pt-2"><strong>Stored in:</strong> {getAccountName(vault.destinationAccountId)}</p>
                                <p><strong>Funded by:</strong> {vault.sourceAccountIds.map(getAccountName).join(', ')}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <Link href="/vaults/add" className="w-full bg-gradient-to-r from-red-900/30 to-red-800/30 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-center text-red-300 border-2 border-dashed border-red-600/40 hover:border-red-600/60 transition-all duration-300 relative overflow-hidden group">
                    <NoiseOverlay opacity={0.02} />
                    <Plus className="w-6 h-6 mr-3 group-hover:text-red-200 transition-colors relative z-10" />
                    <span className="font-semibold group-hover:text-red-200 transition-colors relative z-10">Create New Vault</span>
                </Link>
            </div>
        </>
    );
}
