"use client";

import * as React from "react";
import { format } from "date-fns";
import { Send, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUserEmail } from "@/lib/auth";
import { getChatHistoryForUser, sendMessage, type Message } from "@/lib/chat";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function SupportChat() {
  const { toast } = useToast();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSending, setIsSending] = React.useState(false);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const email = getCurrentUserEmail();
    setUserEmail(email);
  }, []);

  React.useEffect(() => {
    if (userEmail) {
      async function fetchHistory() {
        setIsLoading(true);
        const history = await getChatHistoryForUser(userEmail!);
        setMessages(history.filter(m => !m.silent));
        setIsLoading(false);
      }
      fetchHistory();
    }
  }, [userEmail]);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userEmail) return;

    setIsSending(true);
    try {
      const sentMessage = await sendMessage(userEmail, newMessage);
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Error Sending Message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "U";

  return (
    <Card className="w-full h-[calc(100vh-10rem)] flex flex-col">
      <CardHeader>
        <CardTitle>Customer Support</CardTitle>
        <CardDescription>
          Have a question or issue? Send us a message below.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4" viewportRef={scrollAreaRef}>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-16 w-3/4 ml-auto" />
              <Skeleton className="h-16 w-3/4" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end gap-3",
                    message.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                    {message.sender === 'admin' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                    )}
                  <div className="flex flex-col space-y-1 max-w-md">
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 text-sm",
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.text}
                    </div>
                    <span className={cn(
                        "text-xs text-muted-foreground",
                        message.sender === "user" ? "text-right" : "text-left"
                    )}>
                      {format(new Date(message.timestamp), "h:mm a")}
                    </span>
                  </div>
                   {message.sender === 'user' && (
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
          <Button type="submit" disabled={isSending || isLoading || !newMessage.trim()}>
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
