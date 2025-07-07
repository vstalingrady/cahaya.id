
'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, Sparkles, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth/auth-provider';
import { getAiChatResponse } from '@/lib/actions';
import { type ChatMessage } from '@/ai/flows/chat-flow';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: "Hello! I'm Cahaya, your personal AI financial assistant. How can I help you today? You can ask me about budgeting, saving, or understanding your finances.",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

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
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-10rem)] animate-fade-in-up">
       <header className="text-center mb-4">
        <h1 className="text-3xl font-bold font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AI Financial Chat
        </h1>
        <p className="text-muted-foreground">Ask me anything about your finances.</p>
      </header>
      
      <div className="flex-1 overflow-hidden bg-card border border-border rounded-2xl shadow-lg shadow-primary/10 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-4',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'model' && (
                  <Avatar className="w-8 h-8 border-2 border-primary/50">
                    <div className="bg-gradient-to-br from-primary to-accent w-full h-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground'
                  )}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4 justify-start">
                <Avatar className="w-8 h-8 border-2 border-primary/50">
                    <div className="bg-gradient-to-br from-primary to-accent w-full h-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                </Avatar>
                <div className="bg-secondary rounded-xl px-4 py-3 text-sm">
                  <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border bg-card/50">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about saving tips..."
              className="flex-1 bg-input h-12 text-base"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" className="w-12 h-12 flex-shrink-0" disabled={isLoading}>
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
