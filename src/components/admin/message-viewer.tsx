"use client";

import * as React from "react";
import { format } from "date-fns";
import { getAllChats, type ChatHistory, type Message } from "@/lib/chat";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function MessageViewer() {
  const [chats, setChats] = React.useState<ChatHistory | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchChats() {
      setIsLoading(true);
      const data = await getAllChats();
      setChats(data);
      setIsLoading(false);
    }
    fetchChats();
  }, []);

  const sortedChats = chats ? Object.entries(chats).sort(([, a], [, b]) => {
    const lastMsgA = a[a.length - 1]?.timestamp ?? 0;
    const lastMsgB = b[b.length - 1]?.timestamp ?? 0;
    return lastMsgB - lastMsgA;
  }) : [];


  if (!chats || sortedChats.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">No messages found.</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {sortedChats.map(([email, messages]) => (
        <AccordionItem value={email} key={email}>
          <AccordionTrigger>
            <div className="flex items-center gap-3 w-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{email.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                  <p className="font-medium">{email}</p>
                  <p className="text-xs text-muted-foreground">{messages.length} message(s)</p>
              </div>
              <Badge variant={messages.some(m => m.sender === 'user') ? 'destructive' : 'secondary'} className="mr-4">
                {messages.some(m => m.sender === 'user') ? 'New' : 'Viewed'}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-64 w-full rounded-md border p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex flex-col">
                    <div className="text-xs text-muted-foreground flex justify-between">
                        <span className="font-bold">{message.sender === 'user' ? email : 'Admin'}</span>
                        <span>{format(new Date(message.timestamp), "PPp")}</span>
                    </div>
                    <p className={cn(
                      "rounded-md p-3 text-sm",
                      message.silent ? "bg-accent text-accent-foreground/80 italic" : "bg-muted/50"
                    )}>
                      {message.text}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
