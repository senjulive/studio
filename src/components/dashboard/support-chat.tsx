"use client";

import * as React from "react";
import { format } from "date-fns";
import { Send, Loader2, Paperclip, X } from "lucide-react";
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
import { getChatHistoryForUser, sendMessage, type Message } from "@/lib/chat";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useUser } from "@/app/dashboard/layout";

export function SupportChat() {
  const { toast } = useToast();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const { user } = useUser();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSending, setIsSending] = React.useState(false);
  
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (user?.id) {
      async function fetchHistory() {
        setIsLoading(true);
        const history = await getChatHistoryForUser(user.id);
        setMessages(history.filter(m => !m.silent));
        setIsLoading(false);
      }
      fetchHistory();
    } else {
        setIsLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "File too large", description: "Please select a file smaller than 5MB.", variant: "destructive" });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid file type", description: "Only image files are supported.", variant: "destructive" });
        return;
      }
      setSelectedFile(file);
    }
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !user?.id) return;

    setIsSending(true);
    
    let fileData: Message['file'] | undefined = undefined;
    if (selectedFile) {
      try {
        fileData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({
              name: selectedFile.name,
              type: selectedFile.type,
              dataUrl: event.target?.result as string,
            });
          };
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(selectedFile);
        });
      } catch (error) {
        toast({ title: "Error reading file", description: "Could not process the selected file.", variant: "destructive" });
        setIsSending(false);
        return;
      }
    }
    
    try {
      const sentMessage = await sendMessage(user.id, newMessage, fileData);
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
  
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

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
                  <div className="flex flex-col space-y-1 max-w-xs sm:max-w-md">
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 text-sm",
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.text}
                      {message.file && message.file.type.startsWith('image/') && (
                         // eslint-disable-next-line @next/next/no-img-element
                        <img src={message.file.dataUrl} alt={message.file.name} className="mt-2 rounded-md max-w-full h-auto" />
                      )}
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
      <CardFooter className="flex flex-col items-stretch gap-2">
        {selectedFile && (
          <div className="flex items-center justify-between rounded-md border bg-muted/50 p-2 text-sm">
            <span className="truncate text-muted-foreground">
              {selectedFile.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending || isLoading}
          >
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isSending || isLoading}
          />
          <Button type="submit" disabled={isSending || isLoading || (!newMessage.trim() && !selectedFile)}>
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
