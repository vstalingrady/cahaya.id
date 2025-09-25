
'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Switch } from "./ui/switch";
import { accounts as seedAccounts } from "@/lib/data-seed";
import { financialInstitutions } from '@/lib/data';



const getAccountIcon = (accountId: string) => {
    // Find the account from the seed data using its ID
    const account = seedAccounts.find(acc => acc.id === accountId);
    if (!account) return null;

    // Find the corresponding financial institution using the slug
    const institution = financialInstitutions.find(inst => inst.slug === account.institutionSlug);
    if (!institution) return null;

    return institution.logoUrl;
};


interface CategoryBudgetCardProps {
    category: string;
    icon: React.ReactNode;
    spent: number;
    total: number;
    color: string;
}

const CategoryBudgetCard: React.FC<CategoryBudgetCardProps> = ({ category, icon, spent, total, color }) => {
    const spentPercentage = (spent / total) * 100;
    const remaining = total - spent;

    return (
        <div className="bg-card/30 backdrop-blur-sm border border-white/10 p-3 rounded-lg flex flex-col gap-2 shadow-lg">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: color }}>
                    {icon}
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">{category}</p>
                    <p className="text-xs text-muted-foreground">Remaining: Rp {remaining.toLocaleString('id-ID')}</p>
                </div>
                <p className="text-sm font-bold text-foreground">Rp {spent.toLocaleString('id-ID')}</p>
            </div>
            <Progress value={spentPercentage} className="h-2" indicatorClassName={`bg-[${color}]`} />
        </div>
    );
};

const budgets = [
    { category: 'Food & Drinks', icon: <span className="text-white text-lg">🍔</span>, spent: 750000, total: 2000000, color: '#3B82F6' },
    { category: 'Shopping', icon: <span className="text-white text-lg">🛍️</span>, spent: 1200000, total: 1500000, color: '#A855F7' },
    { category: 'Transport', icon: <span className="text-white text-lg">🚗</span>, spent: 450000, total: 500000, color: '#F97316' },
];

const WelcomeBudgetsMockup: React.FC<{ isActive: boolean, className?: string }> = ({ isActive, className }) => {
    
    return (
        <div className={cn("relative w-full aspect-[9/16] bg-background/80 rounded-2xl shadow-2xl overflow-hidden border-4 border-foreground/10 has-blurry-glow-2", className)}>
            <AnimatePresence>
                {isActive && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="p-4 h-full"
                    >
                         <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                            className="text-center mb-4"
                        >
                            <h3 className="text-lg font-bold text-foreground">My Budgets</h3>
                            <p className="text-xs text-muted-foreground">July 2024</p>
                        </motion.div>
                        
                        <div className="space-y-3">
                            {budgets.map((budget, index) => (
                                <motion.div
                                    key={budget.category}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5, ease: "easeOut" }}
                                >
                                    <CategoryBudgetCard {...budget} />
                                </motion.div>
                            ))}
                        </div>
                        
                        <motion.div
                             initial={{ y: 20, opacity: 0 }}
                             animate={{ y: 0, opacity: 1 }}
                             transition={{ delay: 1.0, duration: 0.5, ease: "easeOut" }}
                             className="mt-4"
                        >
                            <Button variant="outline" className="w-full h-12 border-dashed border-primary/50 text-primary hover:text-primary hover:bg-primary/10">
                                <Plus className="w-4 h-4 mr-2" /> Create New Budget
                            </Button>
                        </motion.div>

                        <motion.div
                             initial={{ y: 20, opacity: 0 }}
                             animate={{ y: 0, opacity: 1 }}
                             transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
                             className="bg-card/30 backdrop-blur-sm border border-white/10 p-3 rounded-lg flex items-center gap-3 shadow-lg mt-4"
                        >
                            <div className="flex-1">
                                <p className="font-semibold text-sm text-foreground">AI Budget Coach</p>
                                <p className="text-xs text-muted-foreground">Get tips to stay on track.</p>
                            </div>
                            <Switch defaultChecked />
                        </motion.div>
                        
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none"></div>
        </div>
    );
};

export default WelcomeBudgetsMockup;
