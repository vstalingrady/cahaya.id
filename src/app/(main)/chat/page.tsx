
'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, User, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth/auth-provider';
import { getAiChatResponse, getChatSuggestions } from '@/lib/actions';
import { type ChatMessage } from '@/ai/flows/chat-flow';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import GeminiLogo from '@/components/icons/GeminiLogo';
import { Skeleton } from '@/components/ui/skeleton';

const defaultSuggestionChips = [
    { text: "Help me budget for a trip to Japan" },
    { text: "What are some ways to save on groceries?" },
    { text: "Explain compound interest like I'm 5" },
];

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);
  
  useEffect(() => {
    if (!user) return;
    async function fetchSuggestions() {
      setIsSuggestionsLoading(true);
      try {
        const result = await getChatSuggestions(user.uid);
        if (result && result.length > 0) {
          setSuggestions(result);
        } else {
          setSuggestions(defaultSuggestionChips.map(c => c.text));
        }
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions(defaultSuggestionChips.map(c => c.text));
      } finally {
        setIsSuggestionsLoading(false);
      }
    }
    fetchSuggestions();
  }, [user]);

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: inputValue };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await getAiChatResponse({ history: newMessages });
      const modelMessage: ChatMessage = { role: 'model', content: aiResponse };
      setMessages([...newMessages, modelMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'model',
        content: "I'm sorry, I encountered an error and can't respond right now. Please try again later.",
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto animate-fade-in-up">
      <main className="flex-1 flex flex-col min-h-0">
        <header className="flex items-center relative py-4 flex-shrink-0">
            <h1 className="text-2xl font-bold mx-auto font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Cahaya AI
            </h1>
        </header>
        
        <div className="flex-1 flex flex-col justify-center overflow-hidden">
          {messages.length === 0 && !isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <div className="w-full max-w-3xl">
                <h2 className="text-5xl md:text-6xl font-bold font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent pb-2">
                Ask me anything.
                </h2>
                <p className="text-muted-foreground mt-2 text-lg">I can help with budgeting, financial questions, and more.</p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mx-auto">
                    {isSuggestionsLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-14 w-full" />
                        ))
                    ) : (
                        suggestions.map((text, i) => (
                            <Button key={i} variant="secondary" className="h-auto text-left py-3 whitespace-normal" onClick={() => handleSuggestionClick(text)}>
                                {text}
                            </Button>
                        ))
                    )}
                </div>
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1 w-full p-4" ref={scrollAreaRef}>
            <div className="space-y-6 max-w-3xl mx-auto">
                {messages.map((message, index) => (
                <div
                    key={index}
                    className={cn(
                    'flex items-start gap-4',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                >
                    {message.role === 'model' && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                    )}
                    <div
                    className={cn(
                        'max-w-[85%] rounded-xl px-4 py-3 text-sm text-left whitespace-pre-wrap',
                        message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground'
                    )}
                    >
                    {message.content}
                    </div>
                    {message.role === 'user' && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                        <AvatarFallback>
                        <User className="w-4 h-4" />
                        </AvatarFallback>
                    </Avatar>
                    )}
                </div>
                ))}
                {isLoading && (
                <div className="flex items-start gap-4 justify-start max-w-3xl mx-auto">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div className="bg-secondary rounded-xl px-4 py-3 text-sm">
                    <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                    </div>
                </div>
                )}
            </div>
            </ScrollArea>
          )}
        </div>
      </main>

      <footer className="p-4 w-full max-w-3xl mx-auto flex-shrink-0">
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-2">
            <GeminiLogo />
            <span>Powered by Gemini</span>
        </div>
        <form onSubmit={handleSubmit} className="relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Cahaya anything..."
            className="flex-1 bg-input border border-border h-14 text-base pl-6 pr-14 rounded-full"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="w-10 h-10 absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-primary hover:bg-primary/90" disabled={isLoading || !inputValue.trim()}>
            <Send className="w-5 h-5" />
          </Button>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-2 px-4">
          Cahaya AI may display inaccurate info, including about people, so double-check its responses.
        </p>
      </footer>
    </div>
  );
}
