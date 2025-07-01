'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Banknote, Edit, Tag } from 'lucide-react';
import Link from 'next/link';

import NoiseOverlay from '@/components/noise-overlay';
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

const formSchema = z.object({
  name: z.string().min(1, { message: 'Please enter a name for your vault.' }),
  targetAmount: z.coerce.number().min(100000, { message: 'Minimum target amount is IDR 100,000.' }),
  icon: z.string().min(1, { message: 'Please select an icon.' }),
});

const icons = [
  { value: 'Emergency', label: '🚨 Emergency' },
  { value: 'Holiday', label: '✈️ Holiday' },
  { value: 'New Gadget', label: '📱 New Gadget' },
  { value: 'Home', label: '🏠 Home' },
  { value: 'Wedding', label: '💍 Wedding' },
];

export default function AddVaultPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      targetAmount: 0,
      icon: '',
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
        <h1 className="text-2xl font-black mx-auto bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
          Create New Vault
        </h1>
      </header>

      <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-8 rounded-2xl border border-red-600/20 shadow-2xl relative overflow-hidden">
        <NoiseOverlay opacity={0.03} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-200">Vault Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Edit className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-300" />
                        <Input className="bg-red-950/50 border-red-800/50 h-14 pl-12 text-base placeholder:text-red-300/70" placeholder="e.g. Japan Trip 2025" {...field} />
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
                  <FormLabel className="text-red-200">Target Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-300" />
                        <Input type="number" className="bg-red-950/50 border-red-800/50 h-14 pl-12 text-base placeholder:text-red-300/70" placeholder="IDR 0" {...field} />
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
                  <FormLabel className="text-red-200">Icon</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-red-950/50 border-red-800/50 h-14 text-base placeholder:text-red-300/70">
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

            <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-accent text-white py-5 rounded-2xl font-black text-xl shadow-2xl border border-red-400/30 hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group h-auto mt-4"
            >
                <NoiseOverlay opacity={0.05} />
                <span className="relative z-10">Create Vault</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
