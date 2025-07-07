
'use client';

import { cn } from "@/lib/utils";
import { ClipboardList, Plus, Edit, Tag, Banknote, Check, CalendarIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";

const initialBudgets = [
    { id: 'food', name: 'Monthly Food & Drink', category: 'Food & Drink', current: 5500000, target: 5000000, progress: 110, color: 'destructive', startDate: '2024-07-01', endDate: '2024-07-31' },
    { id: 'shopping', name: 'Monthly Shopping', category: 'Shopping', current: 2700000, target: 3000000, progress: 90, color: 'yellow-500', startDate: '2024-07-01', endDate: '2024-07-31' },
    { id: 'transport', name: 'Monthly Transport', category: 'Transportation', current: 1125000, target: 1500000, progress: 75, color: 'primary', startDate: '2024-07-01', endDate: '2024-07-31' },
];

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(value);

const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${format(start, 'd MMM')} - ${format(end, 'd MMM yyyy')}`;
}

type DisplayBudget = typeof initialBudgets[0] & { isNew?: boolean };
type AnimationPhase = 'idle' | 'showing_list' | 'button_active' | 'show_form' | 'fill_form' | 'create_budget' | 'show_new_budget' | 'resetting';

export default function WelcomeBudgetsMockup({ className, isActive }: { className?: string, isActive?: boolean }) {
    const [displayBudgets, setDisplayBudgets] = useState<DisplayBudget[]>(initialBudgets);
    const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('idle');
    const [formState, setFormState] = useState({ name: '', category: '', amount: '', startDate: '', endDate: '' });
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive) {
            setAnimationPhase('idle');
            setDisplayBudgets(initialBudgets);
            setFormState({ name: '', category: '', amount: '', startDate: '', endDate: '' });
            if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
            return;
        }

        const timeouts: NodeJS.Timeout[] = [];
        
        const type = (text: string, updater: (newText: string) => void, onComplete?: () => void) => {
            let currentText = '';
            const interval = setInterval(() => {
                currentText = text.slice(0, currentText.length + 1);
                updater(currentText);
                if (currentText === text) {
                    clearInterval(interval);
                    if (onComplete) onComplete();
                }
            }, 80);
            timeouts.push(interval as unknown as NodeJS.Timeout);
        };

        const sequence = () => {
            setAnimationPhase('showing_list');
            timeouts.push(setTimeout(() => setAnimationPhase('button_active'), 1500));
            timeouts.push(setTimeout(() => setAnimationPhase('show_form'), 2000));
            timeouts.push(setTimeout(() => {
                setAnimationPhase('fill_form');
                type("Japan Trip", t => setFormState(p => ({ ...p, name: t })), () => {
                    timeouts.push(setTimeout(() => {
                        type("Travel", t => setFormState(p => ({ ...p, category: t })), () => {
                            timeouts.push(setTimeout(() => {
                                type("20000000", t => setFormState(p => ({ ...p, amount: t })), () => {
                                    timeouts.push(setTimeout(() => {
                                        setFormState(p => ({...p, startDate: "Aug 01, 2024"}));
                                    }, 300));
                                    timeouts.push(setTimeout(() => {
                                        setFormState(p => ({...p, endDate: "Aug 31, 2024"}));
                                    }, 600));

                                    timeouts.push(setTimeout(() => setAnimationPhase('create_budget'), 1100));
                                    timeouts.push(setTimeout(() => {
                                        const newBudget: DisplayBudget = { id: 'new', name: 'Japan Trip', category: 'Travel', current: 0, target: 20000000, progress: 0, color: 'primary', isNew: true, startDate: '2024-08-01', endDate: '2024-08-31' };
                                        setDisplayBudgets(prev => [...prev, newBudget]);
                                        setAnimationPhase('show_new_budget');
                                        timeouts.push(setTimeout(() => {
                                            if (scrollContainerRef.current) {
                                                scrollContainerRef.current.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: 'smooth' });
                                            }
                                        }, 200));
                                        timeouts.push(setTimeout(() => setAnimationPhase('resetting'), 3000));
                                        timeouts.push(setTimeout(() => {
                                            setDisplayBudgets(initialBudgets);
                                            setFormState({ name: '', category: '', amount: '', startDate: '', endDate: '' });
                                            if(scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
                                            sequence();
                                        }, 3500));
                                    }, 1600));
                                });
                            }, 500));
                        });
                    }, 500));
                });
            }, 2500));
        };
        
        sequence();
        return () => timeouts.forEach(clearTimeout);
    }, [isActive]);

    const showList = animationPhase !== 'show_form' && animationPhase !== 'fill_form' && animationPhase !== 'create_budget';

    return (
        <div className={cn(
            "relative w-full max-w-sm h-[450px] rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/20 bg-card/50 p-4 backdrop-blur-sm overflow-hidden flex flex-col gap-4",
            className
        )}>
             <div className="absolute inset-0 p-4 flex flex-col gap-4 transition-all duration-300"
                style={{ opacity: showList ? 1 : 0, transform: showList ? 'scale(1)' : 'scale(0.95)', pointerEvents: showList ? 'auto' : 'none' }}
            >
                <div className="flex-shrink-0">
                    <h1 className="text-xl font-bold font-serif text-foreground">Smart Budgets</h1>
                </div>
                <div ref={scrollContainerRef} className="space-y-3 overflow-y-auto custom-scrollbar pr-2 -mr-3 flex-1">
                    {displayBudgets.map(budget => (
                         <div key={budget.id} className={cn(
                            "bg-secondary/50 rounded-xl p-3 border border-border transition-all duration-500",
                            budget.isNew ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0',
                            animationPhase === 'resetting' && 'opacity-0'
                         )} ref={el => { if (el && budget.isNew) { setTimeout(() => el.classList.remove('opacity-0', 'translate-y-4'), 50); }}}>
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-foreground font-medium text-sm truncate">{budget.name}</p>
                                    <p className="text-xs text-muted-foreground font-medium">{budget.category} &bull; <span className="text-primary/80">{formatDateRange(budget.startDate, budget.endDate)}</span></p>
                                </div>
                            </div>
                            <Progress value={budget.progress} className={cn("h-2", `[&>div]:bg-${budget.color}`)} />
                            <div className="flex justify-between text-xs mt-1.5">
                                <p className="text-muted-foreground font-medium">{formatCurrency(budget.current)} <span className="text-muted-foreground/70">of {formatCurrency(budget.target)}</span></p>
                                <p className={`font-semibold ${budget.target - budget.current < 0 ? 'text-destructive' : 'text-primary'}`}>
                                    {formatCurrency(Math.abs(budget.target - budget.current))} {budget.target - budget.current < 0 ? 'over' : 'left'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={cn(
                    "w-full bg-card p-4 rounded-xl flex items-center justify-center text-muted-foreground border-2 border-dashed border-border transition-all duration-200 flex-shrink-0",
                    animationPhase === 'button_active' && "border-primary/80 bg-primary/20 text-primary"
                )}>
                    <Plus className="w-5 h-5 mr-2" />
                    <span className="font-semibold text-sm">Create New Budget</span>
                </div>
            </div>

            <div className="absolute inset-0 p-4 flex flex-col gap-3 transition-all duration-300"
                style={{ opacity: !showList ? 1 : 0, transform: !showList ? 'scale(1)' : 'scale(0.95)', pointerEvents: !showList ? 'auto' : 'none' }}
            >
                <h3 className="text-xl font-bold font-serif text-center text-foreground flex-shrink-0">Create New Budget</h3>
                 <div className="space-y-3">
                    <div className="relative">
                        <Edit className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input value={formState.name} readOnly className="bg-input border-border h-10 pl-9 text-sm" placeholder="Budget Name" />
                    </div>
                     <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input value={formState.category} readOnly className="bg-input border-border h-10 pl-9 text-sm" placeholder="Category" />
                    </div>
                    <div className="relative">
                        <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input value={formState.amount ? formatCurrency(Number(formState.amount)) : ''} readOnly className="bg-input border-border h-10 pl-9 text-sm" placeholder="Amount" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input value={formState.startDate} readOnly className="bg-input border-border h-10 pl-9 text-sm" placeholder="Start Date" />
                        </div>
                         <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input value={formState.endDate} readOnly className="bg-input border-border h-10 pl-9 text-sm" placeholder="End Date" />
                        </div>
                    </div>
                </div>
                <Button className={cn("w-full h-12 text-base mt-auto flex-shrink-0 transition-colors duration-200", animationPhase === 'create_budget' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground')}>
                    {animationPhase === 'create_budget' ? <Check className="w-5 h-5"/> : 'Create Budget'}
                 </Button>
            </div>
        </div>
    )
}
