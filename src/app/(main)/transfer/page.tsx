'use client';

import { useState, useMemo } from 'react';
import {
  ChevronRight,
  QrCode,
  Send,
  Wallet,
  ReceiptText,
  Search,
  Plus,
  X,
  User,
  Clapperboard,
  CreditCard,
  ShoppingCart,
  Home,
  Building,
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import TransactionHistory from '@/components/dashboard/transaction-history';
import { transactions, favoriteTransactions as initialFavorites, FavoriteTransaction } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const transferActions = [
  { name: 'Transfer', icon: Send, href: '/transfer/recipients', description: "To any bank account" },
  { name: 'Pay Bills', icon: ReceiptText, href: '/bills', description: "PLN, BPJS, TV, etc." },
  { name: 'Top Up', icon: Wallet, href: '/transfer/top-up', description: "GoPay, OVO, Credit" },
];

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const favoriteSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  amount: z.coerce.number().min(1000, { message: 'Minimum amount is IDR 1,000.' }),
  category: z.string().min(1, { message: 'Category is required.' }),
  icon: z.string().min(1, { message: 'An icon is required.' }),
});

const availableIcons: { [key: string]: React.ReactNode } = {
  User: <User />,
  Clapperboard: <Clapperboard />,
  CreditCard: <CreditCard />,
  Wallet: <Wallet />,
  ShoppingCart: <ShoppingCart />,
  Home: <Home />,
  Building: <Building />,
};
type IconName = keyof typeof availableIcons;

const iconSelectItems = [
  { value: 'User', label: 'Person / User' },
  { value: 'Clapperboard', label: 'Entertainment / Movie' },
  { value: 'CreditCard', label: 'Credit Card / Bill' },
  { value: 'Wallet', label: 'Wallet / Top Up' },
  { value: 'ShoppingCart', label: 'Shopping' },
  { value: 'Home', label: 'Rent / Mortgage' },
  { value: 'Building', label: 'Apartment / Bills' },
];


export default function TransferPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<FavoriteTransaction[]>(initialFavorites);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof favoriteSchema>>({
    resolver: zodResolver(favoriteSchema),
    defaultValues: { name: '', amount: 0, category: '', icon: '' },
  });

  const onAddFavorite = (values: z.infer<typeof favoriteSchema>) => {
    const newFavorite: FavoriteTransaction = {
      id: `fav-${Date.now()}`,
      ...values,
      amount: Number(values.amount)
    };
    setFavorites([...favorites, newFavorite]);
    setIsAddDialogOpen(false);
    form.reset();
    toast({ title: 'Favorite Added!', description: `"${values.name}" is now saved.` });
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites(favorites.filter(f => f.id !== id));
    toast({
      variant: 'destructive',
      title: 'Favorite Removed',
    });
  };

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    return transactions.filter(t =>
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, transactions]);
  
  const getIcon = (iconName: string) => {
    return availableIcons[iconName as IconName] || <Wallet />;
  };

  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle>Create a New Favorite</DialogTitle>
            <DialogDescription>This creates a reusable template for quick payments.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddFavorite)} className="space-y-4 py-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Favorite Name</FormLabel><FormControl><Input placeholder="e.g. Monthly Rent" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem><FormLabel>Amount (IDR)</FormLabel><FormControl><Input type="number" placeholder="e.g. 5000000" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
               <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g. Housing" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="icon" render={({ field }) => (
                <FormItem><FormLabel>Icon</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select an icon" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {iconSelectItems.map(item => (
                      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage /></FormItem>
              )}/>
              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Add Favorite</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="space-y-8 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-primary font-serif">
            Pay & Transfer
          </h1>
          <p className="text-muted-foreground">Your central hub for all payments.</p>
        </div>

        <Link 
            href="/transfer/qris"
            className="w-full bg-card p-5 rounded-2xl flex items-center justify-center text-muted-foreground border-2 border-dashed border-border hover:border-primary/80 hover:text-primary transition-all duration-300 group"
        >
            <QrCode className="w-8 h-8 mr-4 text-primary group-hover:text-primary/80 transition-colors relative z-10" />
            <span className="font-semibold text-xl text-white group-hover:text-primary transition-colors relative z-10">Pay with QRIS</span>
        </Link>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white font-serif">Favorites</h2>
           <div className="flex space-x-4 overflow-x-auto pb-4 -mb-4 custom-scrollbar">
              {favorites.map((fav) => (
                <div key={fav.id} className="relative group flex-shrink-0 w-40 h-40 bg-card p-4 rounded-2xl flex flex-col justify-between border border-border shadow-lg hover:border-primary/50 transition-colors cursor-pointer">
                    <Button onClick={() => handleRemoveFavorite(fav.id)} variant="ghost" size="icon" className="absolute top-1 right-1 w-7 h-7 bg-secondary/50 text-muted-foreground hover:bg-destructive/80 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <X className="w-4 h-4" />
                    </Button>
                    <div className="bg-primary/20 text-primary w-10 h-10 flex items-center justify-center rounded-xl">
                      {getIcon(fav.icon)}
                    </div>
                    <div>
                      <p className="font-semibold text-white truncate">{fav.name}</p>
                      <p className="text-sm text-muted-foreground font-mono">{formatCurrency(fav.amount)}</p>
                    </div>
                </div>
              ))}
               <button onClick={() => setIsAddDialogOpen(true)} className="flex-shrink-0 w-40 h-40 bg-card p-4 rounded-2xl flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border hover:border-primary/80 hover:text-primary transition-all duration-300 group">
                  <Plus className="w-8 h-8 mb-2" />
                  <span className="font-semibold text-center">Add New Favorite</span>
              </button>
          </div>
        </div>

        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white font-serif">Services</h2>
            <div className="grid grid-cols-1 gap-4">
              {transferActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="w-full text-left bg-card p-5 rounded-2xl flex items-center gap-5 hover:bg-secondary transition-all duration-300 border border-border shadow-lg group"
                >
                  <div className="bg-primary p-3 rounded-xl shadow-lg">
                      <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-white">{action.name}</p>
                    <p className="text-muted-foreground text-sm">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white font-serif">Recent Transactions</h2>
              <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                      type="text"
                      placeholder="Search transactions..."
                      className="bg-input border-border h-14 pl-12 text-base placeholder:text-muted-foreground"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                  />
              </div>
              <TransactionHistory transactions={filteredTransactions} />
        </div>
      </div>
    </>
  );
}
