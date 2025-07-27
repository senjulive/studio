
"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { Send, Loader2, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "@/contexts/UserContext";

// Mock implementation for public chat
type PublicMessage = {
  id: string;
  user: { id: string, name: string; avatarUrl?: string };
  text: string;
  timestamp: number;
};

const mockPublicMessages: PublicMessage[] = [
  { id: '1', user: { id: 'user1', name: 'CryptoKing' }, text: 'Welcome to the AstralCore public chat!', timestamp: Date.now() - 5 * 60 * 1000 },
  { id: '2', user: { id: 'user2', name: 'WhaleWatcher' }, text: 'BTC is looking bullish today!', timestamp: Date.now() - 3 * 60 * 1000 },
  { id: '3', user: { id: 'user3', name: 'Shill_Ganon' }, text: 'Anyone else excited for the new update?', timestamp: Date.now() - 1 * 60 * 1000 },
];

export function PublicChatView({ isPopup = false }: { isPopup?: boolean }) {
  const { toast } = useToast();
  const [messages, setMessages] = React.useState<PublicMessage[]>(mockPublicMessages);
  const [newMessage, setNewMessage] = React.useState("");
  const { user } = useUser();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            user: {id: `user${Date.now()}`, name: `User${Math.floor(Math.random() * 100)}` },
            text: `Random market thought #${Math.floor(Math.random() * 1000)}`,
            timestamp: Date.now()
        }]);
    }, 15000); // New message every 15 seconds
    
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.email) return;

    setIsSending(true);
    
    // Simulate sending message
    await new Promise(res => setTimeout(res, 500));
    
    const sentMessage: PublicMessage = {
      id: Date.now().toString(),
      user: { id: user.id, name: user.email.split('@')[0] },
      text: newMessage,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, sentMessage]);
    setNewMessage("");
    setIsSending(false);
  };
  
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <Card className={cn("w-full flex flex-col", isPopup ? "h-full shadow-2xl border-2 border-primary/20" : "h-[calc(100vh-10rem)]")}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Users />
            <span>Public Chat</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4" viewportRef={scrollAreaRef}>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-16 w-3/4 ml-auto" />
              <Skeleton className="h-16 w-3/4" />
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3",
                    message.user.id === user?.id ? "justify-end" : "justify-start"
                  )}
                >
                    {message.user.id !== user?.id && (
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={message.user.avatarUrl} />
                            <AvatarFallback>{message.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    )}
                  <div className={cn("flex flex-col space-y-1 max-w-xs sm:max-w-md", message.user.id === user?.id ? "items-end" : "items-start")}>
                     <div className="text-xs text-muted-foreground font-medium">{message.user.name}</div>
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 text-sm",
                        message.user.id === user?.id
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted rounded-bl-none"
                      )}
                    >
                      {message.text}
                    </div>
                    <span className="text-xs text-muted-foreground/80">
                      {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                   {message.user.id === user?.id && (
                        <Avatar className="h-8 w-8">
                             <AvatarFallback>{userInitial}</AvatarFallback>
                        </Avatar>
                    )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isSending || isLoading}
          />
          <Button type="submit" size="icon" disabled={isSending || isLoading || !newMessage.trim()}>
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
