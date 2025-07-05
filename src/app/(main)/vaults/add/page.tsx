
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Banknote, Edit, Repeat, Coins, Image as ImageIcon, Users, Send, ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { accounts } from '@/lib/data';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';


const formSchema = z.object({
  name: z.string().min(1, { message: 'Please enter a name for your vault.' }),
  targetAmount: z.coerce.number().min(100000, { message: 'Minimum target amount is IDR 100,000.' }),
  icon: z.string().min(1, { message: 'Please select an icon.' }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')),
  isShared: z.boolean().default(false),
  sourceAccountIds: z.array(z.string()).refine(value => value.some(item => item), {
    message: "You have to select at least one funding source.",
  }),
  destinationAccountId: z.string().min(1, { message: 'Please select a destination account.' }),
  autoSaveEnabled: z.boolean().default(false).optional(),
  roundUpEnabled: z.boolean().default(false).optional(),
  autoSaveFrequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
  autoSaveAmount: z.coerce.number().optional(),
}).refine(data => {
    if (data.autoSaveEnabled) {
        return !!data.autoSaveFrequency && (data.autoSaveAmount || 0) >= 1000;
    }
    return true;
}, {
    message: 'Please specify a frequency and an amount of at least IDR 1,000.',
    path: ['autoSaveAmount'],
});

const icons = [
  { value: 'Emergency', label: '🚨 Emergency' },
  { value: 'Holiday', label: '✈️ Holiday' },
  { value: 'New Gadget', label: '📱 New Gadget' },
  { value: 'Home', label: '🏠 Home' },
  { value: 'Wedding', label: '💍 Wedding' },
];

const fundingAccounts = accounts.filter(acc => acc.type === 'bank' || acc.type === 'e-wallet');
const destinationAccounts = accounts.filter(acc => acc.type === 'bank');

export default function AddVaultPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      targetAmount: 0,
      icon: '',
      imageUrl: '',
      isShared: false,
      sourceAccountIds: [],
      destinationAccountId: '',
      autoSaveEnabled: false,
      roundUpEnabled: false,
      autoSaveAmount: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // In a real app, you would save this to a database
    // and update the vaults list.
    toast({
      title: "Vault Created!",
      description: `${values.name} has been added to your vaults.`,
    });
    router.push('/vaults');
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
       <header className="flex items-center relative">
        <Link href="/vaults" className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-bold mx-auto font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Create New Vault
        </h1>
      </header>

      <div className="bg-card p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Vault Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Edit className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input className="bg-input border-border h-14 pl-12 text-base placeholder:text-muted-foreground" placeholder="e.g. Japan Trip 2025" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Target Amount</FormLabel>
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
            
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Icon</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border h-14 text-base placeholder:text-muted-foreground">
                        <SelectValue placeholder="Select an icon for your goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {icons.map(icon => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
             <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Goal Image (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input className="bg-input border-border h-14 pl-12 text-base placeholder:text-muted-foreground" placeholder="https://placehold.co/600x400.png" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sourceAccountIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Funding Sources</FormLabel>
                   <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between bg-input border-border h-14 text-base",
                            !field.value?.length && "text-muted-foreground"
                          )}
                        >
                          <span className="truncate">
                            {field.value?.length > 0
                              ? field.value
                                  .map(
                                    (id) => fundingAccounts.find((acc) => acc.id === id)?.name
                                  )
                                  .join(', ')
                              : "Select funding sources"}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <div className="p-2 space-y-1">
                        {fundingAccounts.map((account) => (
                           <FormItem
                            key={account.id}
                            className="flex flex-row items-center space-x-3 space-y-0 p-2 rounded-md hover:bg-secondary cursor-pointer"
                            onClick={() => {
                              const selected = field.value || [];
                              const isSelected = selected.includes(account.id);
                              const newSelected = isSelected
                                ? selected.filter((id) => id !== account.id)
                                : [...selected, account.id];
                              field.onChange(newSelected);
                            }}
                          >
                            <FormControl>
                                <Checkbox
                                checked={field.value?.includes(account.id)}
                                readOnly
                                className="cursor-pointer"
                                />
                            </FormControl>
                            <FormLabel className="font-normal text-white flex-1 cursor-pointer">
                              {account.name}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="text-muted-foreground text-sm">
                    Select one or more accounts to fund auto-saving and round-ups.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destinationAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Destination Account</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border h-14 text-base placeholder:text-muted-foreground">
                        <SelectValue placeholder="Select a bank account for this vault" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {destinationAccounts.map(account => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-muted-foreground text-sm">
                      This account will hold the money for your vault.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 pt-4 border-t border-border/50">
                <FormField
                    control={form.control}
                    name="isShared"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-secondary">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base text-foreground flex items-center gap-2">
                            <Users className="w-4 h-4" /> Make it a Shared Vault
                            </FormLabel>
                            <FormDescription className="text-muted-foreground text-sm">
                            Allow others to contribute to this goal.
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                />

                 <Collapsible
                    open={form.watch('isShared')}
                    className="w-full space-y-2"
                 >
                    <CollapsibleContent className="space-y-4 animate-accordion-down">
                        <div className="flex items-center gap-2">
                             <Input className="bg-input border-border h-14 text-base placeholder:text-muted-foreground" placeholder="Enter member's email or phone" />
                             <Button type="button" size="icon" className="h-14 w-14 flex-shrink-0" onClick={() => toast({ title: 'Invite Sent!', description: 'A member invite has been sent.'})}>
                                <Send className="w-5 h-5"/>
                             </Button>
                        </div>
                    </CollapsibleContent>
                 </Collapsible>

                <FormField
                    control={form.control}
                    name="autoSaveEnabled"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-secondary">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base text-foreground flex items-center gap-2">
                            <Repeat className="w-4 h-4" /> Enable Auto-Saving
                            </FormLabel>
                            <FormDescription className="text-muted-foreground text-sm">
                            Automatically transfer money to this vault.
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                />
                
                <Collapsible
                    open={form.watch('autoSaveEnabled')}
                    className="w-full space-y-2"
                    >
                    <CollapsibleContent className="space-y-6 pt-4 animate-accordion-down -mb-4">
                        <FormField
                        control={form.control}
                        name="autoSaveFrequency"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormLabel className="text-muted-foreground">Frequency</FormLabel>
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-3 gap-4"
                                >
                                <FormItem className={cn("relative flex items-center justify-center rounded-lg border-2 p-4 transition-colors", field.value === 'daily' ? 'border-primary' : 'border-border')}>
                                    <FormControl>
                                    <RadioGroupItem value="daily" id="daily" className="sr-only" />
                                    </FormControl>
                                    <FormLabel htmlFor="daily" className="font-normal cursor-pointer">Daily</FormLabel>
                                </FormItem>
                                <FormItem className={cn("relative flex items-center justify-center rounded-lg border-2 p-4 transition-colors", field.value === 'weekly' ? 'border-primary' : 'border-border')}>
                                    <FormControl>
                                    <RadioGroupItem value="weekly" id="weekly" className="sr-only" />
                                    </FormControl>
                                    <FormLabel htmlFor="weekly" className="font-normal cursor-pointer">Weekly</FormLabel>
                                </FormItem>
                                <FormItem className={cn("relative flex items-center justify-center rounded-lg border-2 p-4 transition-colors", field.value === 'monthly' ? 'border-primary' : 'border-border')}>
                                    <FormControl>
                                    <RadioGroupItem value="monthly" id="monthly" className="sr-only" />
                                    </FormControl>
                                    <FormLabel htmlFor="monthly" className="font-normal cursor-pointer">Monthly</FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="autoSaveAmount"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-muted-foreground">Auto-Save Amount</FormLabel>
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
                    </CollapsibleContent>
                </Collapsible>

                <FormField
                    control={form.control}
                    name="roundUpEnabled"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-secondary">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base text-foreground flex items-center gap-2">
                             <Coins className="w-4 h-4" /> Enable Round-Up Savings
                            </FormLabel>
                            <FormDescription className="text-muted-foreground text-sm">
                            Automatically save spare change from purchases.
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                />
            </div>

            <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-semibold text-xl shadow-lg border-border hover:shadow-primary/10 transition-all duration-300 transform hover:scale-105 h-auto mt-4"
            >
                Create Vault
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
