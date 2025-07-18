
'use client';

import { useState, useRef, useEffect, FormEvent, useCallback } from 'react';
import { Send, User as UserIcon, Loader2, Sparkles, History, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth/auth-provider';
import { getAiChatResponse, getChatHistoryList, getChatSessionMessages } from '@/lib/actions';
import { getChatSuggestions as fetchSuggestions } from '@/lib/actions';
import { type ChatMessage } from '@/ai/flows/chat-flow';
import { type ChatSession, type ChatSuggestion } from '@/lib/data';
import { cn } from '@/lib/utils';
import GeminiLogo from '@/components/icons/GeminiLogo';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

const defaultSuggestionChips: ChatSuggestion[] = [
    { suggestion: "Help me budget for a trip to Japan" },
    { suggestion: "What are some ways to save on groceries?" },
    { suggestion: "Explain compound interest like I'm 5" },
];

export default function ChatPage() {
  const { user } = useAuth();
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For waiting on server
  const [isStreaming, setIsStreaming] = useState(false); // For client-side typing effect
  
  // Suggestions state
  const [suggestions, setSuggestions] = useState<ChatSuggestion[]>(defaultSuggestionChips);

  // History state
  const [historyList, setHistoryList] = useState<ChatSession[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isStreaming]);
  
  // Fetch starter suggestions on initial load
  useEffect(() => {
    async function getSuggestions() {
      if (!user) {
          setSuggestions(defaultSuggestionChips);
          return;
      }
      try {
        const result = await fetchSuggestions(user.uid);
        const suggestionChips = result.map(s => ({ suggestion: s }));
        if (suggestionChips.length > 0) {
            setSuggestions(suggestionChips);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    }
    getSuggestions();
  }, [user]);

  // Fetch chat history
  const fetchHistory = useCallback(async () => {
    if (!user) return;
    setIsHistoryLoading(true);
    try {
      const history = await getChatHistoryList(user.uid);
      setHistoryList(history);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    } finally {
      setIsHistoryLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);
  
  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
  };
  
  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setIsSheetOpen(false);
  };

  const handleSelectChat = async (chatId: string) => {
    setIsSheetOpen(false);
    setActiveChatId(chatId);
    setIsLoading(true);
    try {
        const pastMessages = await getChatSessionMessages(user!.uid, chatId);
        setMessages(pastMessages);
    } catch(e) {
        console.error("Failed to load chat", e);
        setMessages([{ role: 'model', content: "Sorry, I couldn't load this conversation."}]);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || isStreaming || !user) return;

    const userMessage: ChatMessage = { role: 'user', content: inputValue };
    const currentHistory = [...messages, userMessage];
    setMessages(currentHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      const { aiResponse, chatId: newChatId } = await getAiChatResponse(user.uid, currentHistory, activeChatId);
      
      setIsLoading(false);
      setIsStreaming(true);
      
      const placeholderAiMessage: ChatMessage = { role: 'model', content: '' };
      setMessages(prev => [...prev, placeholderAiMessage]);
      
      const fullAiText = aiResponse.content;
      let charIndex = 0;
      const typingInterval = setInterval(() => {
        if (charIndex < fullAiText.length) {
          charIndex++;
          const typedText = fullAiText.slice(0, charIndex);
          setMessages(prev => {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1].content = typedText;
            return updatedMessages;
          });
        } else {
          clearInterval(typingInterval);
          setIsStreaming(false);
        }
      }, 25);

      if (!activeChatId) {
        setActiveChatId(newChatId);
        fetchHistory();
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage: ChatMessage = {
        role: 'model',
        content: "I'm sorry, I encountered an error and can't respond right now. Please try again later.",
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in-up p-6 space-y-4">
      <header className="sticky top-0 -mt-6 pt-6 pb-4 -mx-6 px-6 bg-background/80 backdrop-blur-md z-20 flex justify-between items-center">
            <div>
                <h1 className="text-xl font-bold font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Cahaya AI
                </h1>
                <p className="text-sm text-muted-foreground">Your personal financial assistant.</p>
            </div>
            <div className="flex items-center gap-3">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button onClick={() => fetchHistory()} variant="outline" size="sm" className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 font-semibold">
                    <History className="w-4 h-4 mr-2" /> History
                  </Button>
                </SheetTrigger>
                <SheetContent className="flex flex-col">
                  <SheetHeader>
                    <SheetTitle>Chat History</SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4 space-y-2">
                    {isHistoryLoading ? (
                      Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
                    ) : historyList.length > 0 ? (
                      historyList.map(session => (
                        <button key={session.id} onClick={() => handleSelectChat(session.id)} className={cn(
                            "w-full text-left p-3 rounded-lg border transition-colors",
                            activeChatId === session.id ? "bg-secondary border-primary/50" : "bg-card hover:bg-secondary/50 border-border"
                        )}>
                            <p className="font-semibold text-card-foreground truncate">{session.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(session.lastUpdated), { addSuffix: true })}
                            </p>
                        </button>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center pt-10">No chat history yet.</p>
                    )}
                  </div>
                   <Button onClick={handleNewChat} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" /> New Chat
                  </Button>
                </SheetContent>
              </Sheet>
              <Link href="/profile">
                  <Avatar className="w-11 h-11 bg-primary rounded-full shadow-lg border-2 border-border/50 cursor-pointer">
                    <AvatarImage src={user?.photoURL || "https://placehold.co/128x128.png"} alt={user?.displayName || "User Avatar"} data-ai-hint="person avatar" />
                    <AvatarFallback><UserIcon /></AvatarFallback>
                  </Avatar>
              </Link>
            </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 flex flex-col justify-center overflow-hidden">
          {messages.length === 0 && !isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-full max-w-3xl">
                <h2 className="text-5xl md:text-6xl font-bold font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent pb-2">
                Ask me anything.
                </h2>
                <p className="text-muted-foreground mt-2 text-lg">I can help with budgeting, financial questions, and more.</p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mx-auto">
                    {suggestions.map((suggestion, i) => (
                        <Button key={i} variant="secondary" className="h-auto text-left py-3 whitespace-normal" onClick={() => handleSuggestionClick(suggestion.suggestion)}>
                            {suggestion.suggestion}
                        </Button>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1 w-full" ref={scrollAreaRef}>
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
                        <UserIcon className="w-4 h-4" />
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

      <footer className="w-full max-w-3xl mx-auto flex-shrink-0">
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
            disabled={isLoading || isStreaming}
          />
          <Button type="submit" size="icon" className="w-10 h-10 absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-primary hover:bg-primary/90" disabled={isLoading || isStreaming || !inputValue.trim()}>
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
