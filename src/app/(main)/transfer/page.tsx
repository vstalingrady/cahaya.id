'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import useEmblaCarousel, { type EmblaCarouselType } from 'embla-carousel-react'
import Image from 'next/image';
import {
  ChevronRight,
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
import { cn } from '@/lib/utils';


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

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const updateSnaps = () => setScrollSnaps(emblaApi.scrollSnapList());
    
    onSelect(emblaApi);
    updateSnaps();

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('reInit', updateSnaps);

    return () => {
        emblaApi.off('select', onSelect);
        emblaApi.off('reInit', onSelect);
        emblaApi.off('reInit', updateSnaps);
    };
  }, [emblaApi, onSelect]);

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
          <h1 className="text-3xl font-bold mb-1 font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Pay & Transfer
          </h1>
          <p className="text-muted-foreground">Your central hub for all payments.</p>
        </div>

        <Link
          href="/transfer/qris"
          className="group relative w-full p-[2px] rounded-2xl bg-transparent hover:bg-gradient-to-r from-primary to-accent transition-all duration-300"
        >
          {/* Dashed border overlay - visible by default, hides on hover */}
          <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-primary/50 group-hover:opacity-0 transition-opacity"></div>
          
          {/* Inner content area with card background */}
          <div className="w-full h-full bg-card rounded-[calc(1rem-2px)] p-5 flex items-center justify-center">
              <span className="font-semibold text-xl text-muted-foreground group-hover:text-white transition-colors flex items-center gap-3">
                  Pay with <Image src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" alt="QRIS Logo" width={80} height={25} className="dark:invert" />
              </span>
          </div>
        </Link>
        
        <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white font-serif">Favorites</h2>
              <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-5 h-5" />
                </Button>
                <Button variant="link" size="sm" className="text-primary pr-0">
                  See All
                </Button>
              </div>
            </div>
            
            <div className="w-full">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-4">
                  {favorites.map((fav, index) => (
                    <div
                      key={fav.id}
                      className="flex-grow-0 flex-shrink-0 basis-3/5 pl-4 min-w-0"
                    >
                      <div className={cn(
                        "relative group flex-shrink-0 w-full h-40 bg-card p-4 rounded-2xl flex flex-col justify-between border border-border shadow-lg cursor-pointer transition-all duration-300 ease-out",
                         index === selectedIndex ? 'scale-100 opacity-100 shadow-primary/20' : 'scale-90 opacity-60'
                      )}>
                          <Button onClick={() => handleRemoveFavorite(fav.id)} variant="ghost" size="icon" className="absolute top-1 right-1 w-7 h-7 bg-secondary/50 text-muted-foreground hover:bg-destructive/80 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <X className="w-4 h-4" />
                          </Button>
                          <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl shadow-lg">
                            {getIcon(fav.icon)}
                          </div>
                          <div>
                            <p className="font-semibold text-white truncate">{fav.name}</p>
                            <p className="text-sm text-muted-foreground font-mono">{formatCurrency(fav.amount)}</p>
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-4">
                {scrollSnaps.map((_, index) => (
                    <button 
                        key={index} 
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            index === selectedIndex ? "bg-accent w-6" : "bg-muted hover:bg-muted-foreground/50"
                        )}
                    />
                ))}
              </div>
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
                  <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl shadow-lg">
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
