

/**
 * @file src/app/(main)/transfer/page.tsx
 * @fileoverview This is the main "Pay & Transfer" page. It serves as a central hub for
 * all payment-related activities, including QRIS payments, managing favorite transactions,
 * accessing services like bill pay and top-up, and viewing recent transaction history.
 * It's a client component because it requires significant user interaction and state management.
 */

'use client';

// Import core React hooks for state and side-effect management.
import { useState, useMemo, useCallback, useEffect, type ElementType } from 'react';
// Import the Embla Carousel hook for the "Favorites" scroller.
import useEmblaCarousel, { type EmblaCarouselType } from 'embla-carousel-react'
// Import Next.js components for images and navigation.
import Image from 'next/image';
import Link from 'next/link';
// Import Lucide icons for a consistent UI.
import {
  ChevronRight, Send, Wallet, ReceiptText, Search, Plus, X, User, Clapperboard,
  CreditCard, ShoppingCart, Home, Building, Loader2,
} from 'lucide-react';
// Import UI components from ShadCN.
import { Input } from '@/components/ui/input';
import TransactionHistory from '@/components/dashboard/transaction-history';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Import server actions to interact with the Firestore database.
import { addFavorite, getDashboardData, getFavorites, removeFavorite, getBeneficiaries } from '@/lib/actions';
// Import data type definitions.
import { type Account, type Transaction, type FavoriteTransaction, type Beneficiary } from '@/lib/data';
// Import custom hooks for authentication and toast notifications.
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/auth-provider';
// Import form validation libraries.
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
// Import utility function for conditional class names.
import { cn } from '@/lib/utils';


// An array of objects defining the main service actions on this page.
const transferActions = [
  { name: 'Transfer', icon: Send, href: '/transfer/recipients', description: "To any bank account" },
  { name: 'Pay Bills', icon: ReceiptText, href: '/bills', description: "PLN, BPJS, TV, etc." },
  { name: 'Top Up', icon: Wallet, href: '/transfer/top-up', description: "GoPay, OVO, Credit" },
];

/**
 * A utility function to format a number into Indonesian Rupiah currency format.
 * @param {number} amount - The numeric value to format.
 * @returns {string} The formatted currency string (e.g., "Rp 50.000").
 */
const formatCurrency = (amount: number): string => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

// Zod schema for validating the "Add Favorite" form.
const favoriteSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }).max(25, { message: 'Name cannot be longer than 25 characters.' }),
  amount: z.coerce.number().min(1000, { message: 'Minimum amount is IDR 1,000.' }),
  category: z.string().min(1, { message: 'Category is required.' }),
  icon: z.string().min(1, { message: 'An icon is required.' }),
  recipientId: z.string().optional(),
});

// A dictionary mapping icon names (strings) to their actual component types.
const availableIcons: { [key: string]: ElementType } = {
  User, Clapperboard, CreditCard, Wallet, ShoppingCart, Home, Building,
};
type IconName = keyof typeof availableIcons;

// An array of objects for the icon selection dropdown in the "Add Favorite" form.
const iconSelectItems = [
  { value: 'User', label: 'Person / User' },
  { value: 'Clapperboard', label: 'Entertainment / Movie' },
  { value: 'CreditCard', label: 'Credit Card / Bill' },
  { value: 'Wallet', label: 'Wallet / Top Up' },
  { value: 'ShoppingCart', label: 'Shopping' },
  { value: 'Home', label: 'Rent / Mortgage' },
  { value: 'Building', label: 'Apartment / Bills' },
];

/**
 * The main component for the Transfer page.
 * @returns {JSX.Element} The rendered page content.
 */
export default function TransferPage() {
  // Hooks for authentication and notifications.
  const { user } = useAuth();
  const { toast } = useToast();

  // State management for data, loading status, and UI controls.
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [favorites, setFavorites] = useState<FavoriteTransaction[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // This effect fetches all necessary data from Firestore when the component mounts or the user changes.
  useEffect(() => {
    // Don't fetch if there's no authenticated user.
    if (!user) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch dashboard data (accounts, transactions) and favorites in parallel for efficiency.
        const [dashboardData, favoritesData, beneficiariesData] = await Promise.all([
          getDashboardData(user.uid),
          getFavorites(user.uid),
          getBeneficiaries(user.uid),
        ]);
        setAccounts(dashboardData.accounts);
        setTransactions(dashboardData.transactions);
        setFavorites(favoritesData);
        setBeneficiaries(beneficiariesData);
      } catch (error) {
        console.error("Failed to fetch page data:", error);
        toast({ title: 'Error', description: 'Failed to load data for this page.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  // Hooks for managing the Embla Carousel instance.
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // A memoized callback to update the active dot indicator for the carousel.
  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  // An effect to initialize and manage the carousel's event listeners.
  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    // Cleanup function to remove listeners on unmount.
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Initialize the form for adding a new favorite transaction.
  const form = useForm<z.infer<typeof favoriteSchema>>({
    resolver: zodResolver(favoriteSchema),
    defaultValues: { name: '', amount: 0, category: '', icon: '', recipientId: 'none' },
  });

  /**
   * Handles the submission of the "Add Favorite" form.
   * @param {z.infer<typeof favoriteSchema>} values - The validated form values.
   */
  const onAddFavorite = async (values: z.infer<typeof favoriteSchema>) => {
    if (!user) return;
    
    let recipientData: { recipientId?: string, recipientBank?: string } = {};
    if (values.recipientId && values.recipientId !== 'none') {
        const selectedRecipient = beneficiaries.find(b => b.id === values.recipientId);
        if (selectedRecipient) {
            recipientData = {
                recipientId: selectedRecipient.id,
                recipientBank: selectedRecipient.bankName
            };
        }
    }

    const newFavoriteData: Omit<FavoriteTransaction, 'id'> = {
      name: values.name,
      amount: Number(values.amount),
      category: values.category,
      icon: values.icon,
      ...recipientData
    };

    try {
      // Call the server action to add the favorite to Firestore.
      const addedFavorite = await addFavorite(user.uid, newFavoriteData);
      // Update the local state to reflect the change immediately.
      setFavorites([...favorites, addedFavorite]);
      setIsAddDialogOpen(false);
      form.reset();
      toast({ title: 'Favorite Added!', description: `"${values.name}" is now saved.` });
    } catch (error) {
      console.error("Failed to add favorite:", error);
      toast({ title: 'Error', description: 'Could not save favorite.', variant: 'destructive' });
    }
  };

  /**
   * Handles the removal of a favorite transaction.
   * @param {string} id - The ID of the favorite to remove.
   */
  const handleRemoveFavorite = async (id: string) => {
    if (!user) return;
    try {
      // Call the server action to remove the favorite from Firestore.
      await removeFavorite(user.uid, id);
      // Update the local state to reflect the change.
      setFavorites(favorites.filter(f => f.id !== id));
      toast({ variant: 'destructive', title: 'Favorite Removed' });
    } catch (error) {
        console.error("Failed to remove favorite:", error);
        toast({ title: 'Error', description: 'Could not remove favorite.', variant: 'destructive' });
    }
  };

  // A memoized computation to filter the transaction list based on the search query.
  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    return transactions.filter(t =>
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, transactions]);
  
  // Show a loading spinner while data is being fetched.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center pt-24">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }
  
  return (
    <>
      {/* Dialog for adding a new favorite */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-popover border-border flex flex-col max-h-[90vh]">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Create a New Favorite</DialogTitle>
            <DialogDescription>This creates a reusable template for quick payments.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddFavorite)} id="add-favorite-form" className="flex-1 overflow-y-auto -mx-6 px-6 py-4 custom-scrollbar space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Favorite Name</FormLabel><FormControl><Input placeholder="e.g. Monthly Rent" {...field} maxLength={25} /></FormControl><FormMessage /></FormItem>
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
              <FormField control={form.control} name="recipientId" render={({ field }) => (
                <FormItem>
                    <FormLabel>Recipient (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Link to a saved recipient" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="none">None (e.g., general purchase)</SelectItem>
                            {beneficiaries.map(b => (
                                <SelectItem key={b.id} value={b.id}>{b.name} - {b.bankName}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormDescription>Link this favorite to a person for quick transfers.</FormDescription>
                    <FormMessage />
                </FormItem>
              )}/>
            </form>
          </Form>
          <DialogFooter className="pt-4 flex-shrink-0">
            <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button type="submit" form="add-favorite-form">Add Favorite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Page Content */}
      <div className="space-y-8 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold mb-1 font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Pay & Transfer
          </h1>
          <p className="text-muted-foreground">Your central hub for all payments.</p>
        </div>

        {/* QRIS Payment Link */}
        <Link
            href="/transfer/qris"
            className="p-[2px] rounded-2xl bg-gradient-to-r from-primary to-accent block"
        >
          <div className="w-full h-full bg-card rounded-[calc(1rem-2px)] p-5 flex items-center justify-center border-2 border-dashed border-card">
              <span className="font-semibold text-xl text-card-foreground flex items-center gap-3">
                  Pay with <Image src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" alt="QRIS Logo" width={80} height={37} className="dark:invert w-20 h-auto" />
              </span>
          </div>
        </Link>
        
        {/* Favorites Section */}
        <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-foreground font-serif">Favorites</h2>
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
              <div className="overflow-hidden -ml-4" ref={emblaRef}>
                <div className="flex">
                  {/* Map over favorites to render carousel items */}
                  {favorites.map((fav, index) => {
                    const Icon = availableIcons[fav.icon as IconName] || Wallet;
                    const content = (
                       <div className="w-full h-40">
                         <div className={cn(
                          "relative group w-full h-full bg-card p-4 rounded-2xl flex flex-col justify-between border border-border shadow-lg cursor-pointer transition-transform duration-300 ease-out",
                           index === selectedIndex ? 'scale-100 opacity-100 shadow-primary/20' : 'scale-90 opacity-60'
                         )}>
                             <Button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveFavorite(fav.id); }} variant="ghost" size="icon" className="absolute top-1 right-1 w-7 h-7 bg-secondary/50 text-muted-foreground hover:bg-destructive/80 hover:text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                               <X className="w-4 h-4" />
                             </Button>
                             <div className="bg-gradient-to-br from-primary to-accent w-12 h-12 rounded-xl shadow-lg text-primary-foreground flex items-center justify-center flex-shrink-0">
                               <Icon className="w-6 h-6" />
                             </div>
                             <div className="min-w-0 flex-1 flex flex-col justify-end overflow-hidden">
                               <p className="font-semibold text-sm text-card-foreground truncate mb-1" title={fav.name}>{fav.name}</p>
                               <p className="text-xs text-muted-foreground font-mono truncate">{formatCurrency(fav.amount)}</p>
                             </div>
                         </div>
                       </div>
                    );

                    return (
                        <div key={fav.id} className="flex-[0_0_10rem] pl-2 min-w-0">
                          {fav.recipientId ? (
                            <Link href={`/transfer/${fav.recipientId}?amount=${fav.amount}&notes=${encodeURIComponent(fav.name)}`}>
                              {content}
                            </Link>
                          ) : (
                            <div onClick={() => toast({ title: "Quick Payment Template", description: "This favorite is not linked to a recipient."})}>
                              {content}
                            </div>
                          )}
                        </div>
                    );
                  })}
                </div>
              </div>

              {/* Carousel Dot Indicators */}
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

        {/* Services Section */}
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground font-serif">Services</h2>
            <div className="grid grid-cols-1 gap-4">
              {transferActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="w-full text-left bg-card p-5 rounded-2xl flex items-center gap-5 hover:bg-secondary transition-all duration-300 border border-border shadow-lg group"
                >
                  <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl shadow-lg">
                      <action.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-card-foreground">{action.name}</p>
                    <p className="text-muted-foreground text-sm">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        
        {/* Recent Transactions Section */}
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground font-serif">Recent Transactions</h2>
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
              {/* Pass the filtered transactions and the full accounts list to the component */}
              <TransactionHistory transactions={filteredTransactions} accounts={accounts} />
        </div>
      </div>
    </>
  );
}
