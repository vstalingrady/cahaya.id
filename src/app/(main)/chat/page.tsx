
'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, User, Loader2, Menu, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth/auth-provider';
import { getAiChatResponse } from '@/lib/actions';
import { type ChatMessage } from '@/ai/flows/chat-flow';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import GeminiLogo from '@/components/icons/GeminiLogo';

const suggestionChips = [
    { text: "Help me budget for a trip to Japan" },
    { text: "What are some ways to save on groceries?" },
    { text: "Explain compound interest like I'm 5" },
]

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('2.5 Pro');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

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
    <div className="flex flex-col h-full max-h-[calc(100vh-4rem)] w-full max-w-4xl mx-auto animate-fade-in-up">
      <header className="flex items-center justify-between p-2 md:p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Menu className="w-6 h-6" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 text-xl font-medium">
                Gemini <ChevronDown className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setModel('2.5 Pro')}>Gemini 2.5 Pro</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setModel('Flash')}>Gemini Flash</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden md:inline-flex">PRO</Button>
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
            <AvatarFallback>
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center pb-4">
        {messages.length === 0 && !isLoading && (
          <div className="text-center w-full px-4">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent pb-2">
              Hello, {user?.displayName?.split(' ')[0] || 'there'}
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">How can I help you today?</p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
                {suggestionChips.map((chip, i) => (
                    <Button key={i} variant="outline" className="h-auto text-left py-3 whitespace-normal" onClick={() => handleSuggestionClick(chip.text)}>
                        {chip.text}
                    </Button>
                ))}
            </div>
          </div>
        )}
        
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
                    <GeminiLogo className="w-8 h-8 flex-shrink-0" />
                )}
                <div
                  className={cn(
                    'max-w-[85%] rounded-xl px-4 py-3 text-sm text-left whitespace-pre-wrap',
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-secondary text-foreground'
                  )}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4 justify-start max-w-3xl mx-auto">
                <GeminiLogo className="w-8 h-8 flex-shrink-0" />
                <div className="bg-secondary rounded-xl px-4 py-3 text-sm">
                  <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </main>

      <footer className="p-4 w-full max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Message Gemini ${model}...`}
            className="flex-1 bg-secondary h-14 text-base pl-14 pr-14 rounded-full"
            disabled={isLoading}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon" className="w-8 h-8 rounded-full">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <Button type="submit" size="icon" className="w-10 h-10 absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 hover:bg-blue-700" disabled={isLoading || !inputValue.trim()}>
            <Send className="w-5 h-5" />
          </Button>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-2 px-4">
          Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy & Gemini Apps
        </p>
      </footer>
    </div>
  );
}
