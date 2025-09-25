'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Banknote, Edit, CalendarIcon, Tag, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/auth-provider';
import { getUniqueTransactionCategories, addBudget } from '@/lib/actions';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Please enter a name for your budget.' }),
  amount: z.coerce.number().min(10000, { message: 'Minimum budget amount is IDR 10,000.' }),
  category: z.string().min(1, { message: 'Please select a category.' }),
  startDate: z.date({
    required_error: "A start date is required.",
  }),
  endDate: z.date({
    required_error: "An end date is required.",
  }),
}).refine(data => data.endDate >= data.startDate, {
  message: "End date cannot be before start date.",
  path: ["endDate"],
});


export default function AddBudgetPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const categories = await getUniqueTransactionCategories(user.uid);
        // Add some default categories if user has no transactions yet
        const defaultCategories = ['Food & Drink', 'Transportation', 'Shopping', 'Bills', 'Entertainment'];
        const combined = Array.from(new Set([...defaultCategories, ...categories]));
        setAvailableCategories(combined);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error fetching categories',
          description: 'Could not load your spending categories.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [user, toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      amount: 0,
      category: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to create a budget.' });
        return;
    }
    
    try {
        await addBudget(user.uid, {
            ...values,
            // Format dates to YYYY-MM-DD strings before saving
            startDate: format(values.startDate, 'yyyy-MM-dd'),
            endDate: format(values.endDate, 'yyyy-MM-dd'),
        });

        toast({
          title: "Budget Created!",
          description: `${values.name} has been added to your budgets.`,
        });
        router.push('/budgets');
    } catch (error) {
        console.error("Failed to create budget:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not create the budget.' });
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
    <div className="space-y-8 animate-fade-in-up">
       <header className="flex items-center relative">
        <Link href="/budgets" className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <h1 className="text-2xl font-bold mx-auto font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Create New Budget
        </h1>
      </header>

      <div className="bg-card backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Budget Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Edit className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input className="bg-input border-border h-14 pl-12 text-base placeholder:text-muted-foreground" placeholder="e.g. Vacation Food Budget" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Category</FormLabel>
                   <div className="relative">
                     <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-input border-border h-14 text-base placeholder:text-muted-foreground pl-12">
                            <SelectValue placeholder="Select a spending category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                   </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Budget Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input type="number" className="bg-input border-border h-14 pl-12 text-base placeholder:text-muted-foreground" placeholder="IDR 0" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
               <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-muted-foreground">Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal bg-input border-border h-14 text-base placeholder:text-muted-foreground hover:bg-secondary/80",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-muted-foreground">End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal bg-input border-border h-14 text-base placeholder:text-muted-foreground hover:bg-secondary/80",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < (form.getValues("startDate") || new Date("1900-01-01"))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>


            <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-semibold text-xl shadow-lg border-border hover:shadow-primary/10 transition-all duration-300 transform hover:scale-105 h-auto mt-4"
            >
                Create Budget
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
