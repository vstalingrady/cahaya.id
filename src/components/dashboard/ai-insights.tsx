'use client';

import { useState } from 'react';
import { Lightbulb, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getSavingSuggestions } from '@/lib/actions';
import { type Transaction } from '@/lib/data';

type AIInsightsProps = {
  allTransactions: Transaction[];
};

export default function AIInsights({ allTransactions }: AIInsightsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    const result = await getSavingSuggestions(allTransactions);

    if ('error' in result) {
      setError(result.error);
    } else {
      setSuggestions(result.suggestions);
    }

    setIsLoading(false);
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-accent/20 shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/5 to-transparent -z-10 group-hover:from-accent/10 transition-all duration-500"></div>
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
                <Lightbulb className="h-6 w-6 text-accent" />
            </div>
            <div>
                <CardTitle>Smart Spending Analysis</CardTitle>
                <CardDescription>Let AI uncover saving opportunities for you.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 && !isLoading && !error && (
            <div className="text-center p-4 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">Click the button to get your personalized tips!</p>
                <Button onClick={handleGenerateInsights} disabled={isLoading} variant="secondary">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Get AI Saving Tips
                </Button>
            </div>
        )}
        
        {isLoading && (
          <div className="flex items-center justify-center p-8 space-x-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Analyzing your spending patterns...</span>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center p-8 text-destructive space-y-2">
            <AlertTriangle className="h-6 w-6" />
            <span>{error}</span>
            <Button onClick={handleGenerateInsights} variant="secondary">Try Again</Button>
          </div>
        )}

        {suggestions.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            {suggestions.map((suggestion, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>Suggestion #{index + 1}</AccordionTrigger>
                <AccordionContent>{suggestion}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
