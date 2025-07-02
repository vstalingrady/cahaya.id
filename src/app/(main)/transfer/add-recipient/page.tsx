'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Landmark, User, Hash } from 'lucide-react';

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
import NoiseOverlay from '@/components/noise-overlay';
import Link from 'next/link';

const formSchema = z.object({
  bankName: z.string().min(1, { message: 'Please select a recipient bank.' }),
  accountNumber: z.string().min(8, { message: 'Please enter a valid account number.' }).max(16),
  name: z.string().min(1, { message: 'Please enter a name for this recipient.' }),
});

const banks = [
  { value: 'BCA', label: 'BCA (Bank Central Asia)' },
  { value: 'BNI', label: 'BNI (Bank Negara Indonesia)' },
  { value: 'Mandiri', label: 'Mandiri' },
  { value: 'BRI', label: 'BRI (Bank Rakyat Indonesia)' },
  { value: 'CIMB', label: 'CIMB Niaga' },
  { value: 'Permata', label: 'Permata Bank' },
  { value: 'Danamon', label: 'Danamon' },
];


export default function AddRecipientPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankName: '',
      accountNumber: '',
      name: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // In a real app, you'd save this to a database.
    // Here we'll just simulate success.
    toast({
      title: "Recipient Saved!",
      description: `${values.name} has been added to your transfer list.`,
    });
    router.push('/transfer');
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
       <header className="flex items-center relative">
        <Link href="/transfer" className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-bold mx-auto bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
          Add Recipient
        </h1>
      </header>

      <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-8 rounded-2xl border border-red-600/20 shadow-lg relative overflow-hidden">
        <NoiseOverlay opacity={0.03} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-200">Recipient Bank</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger className="bg-red-950/50 border-red-800/50 h-14 text-base placeholder:text-red-300/70">
                            <SelectValue placeholder="Select a bank" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {banks.map(bank => (
                            <SelectItem key={bank.value} value={bank.value}>
                                {bank.label}
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
                name="accountNumber"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-red-200">Account Number</FormLabel>
                    <FormControl>
                    <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-300" />
                        <Input type="number" className="bg-red-950/50 border-red-800/50 h-14 pl-12 text-base placeholder:text-red-300/70" placeholder="e.g. 1234567890" {...field} />
                    </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-red-200">Recipient Name</FormLabel>
                    <FormControl>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-300" />
                        <Input className="bg-red-950/50 border-red-800/50 h-14 pl-12 text-base placeholder:text-red-300/70" placeholder="e.g. Vstalin Grady" {...field} />
                    </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-accent text-white py-5 rounded-2xl font-bold text-xl shadow-lg border border-red-400/30 hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group h-auto mt-4"
            >
                <NoiseOverlay opacity={0.05} />
                <span className="relative z-10">Verify & Save Recipient</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
