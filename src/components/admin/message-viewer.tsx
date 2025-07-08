
"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  getAllChats,
  sendAdminMessage,
  type ChatHistory,
  type Message,
} from "@/lib/chat";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCircuit, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { addNotification } from "@/lib/notifications";
import { useToast } from "@/hooks/use-toast";
import { type SupportAgentOutput } from "@/ai/flows/support-agent-flow";
import { Card, CardContent } from "@/components/ui/card";
import { getAllWallets, type WalletData } from "@/lib/wallet";

export function MessageViewer() {
  const [chats, setChats] = React.useState<ChatHistory | null>(null);
  const [wallets, setWallets] = React.useState<Record<string, WalletData> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [replyMessages, setReplyMessages] = React.useState<Record<string, string>>({});
  const [isSending, setIsSending] = React.useState<Record<string, boolean>>({});
  const [analysis, setAnalysis] = React.useState<Record<string, SupportAgentOutput | null>>({});
  const [isAnalyzing, setIsAnalyzing] = React.useState<Record<string, boolean>>({});
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [chatData, walletData] = await Promise.all([
          getAllChats(),
          getAllWallets()
      ]);
      setChats(chatData);
      setWallets(walletData);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleSendMessage = async (userId: string) => {
    const text = replyMessages[userId];
    if (!text || !text.trim()) return;

    setIsSending((prev) => ({ ...prev, [userId]: true }));

    await sendAdminMessage(userId, text);

    await addNotification(userId, {
      title: "New Support Message",
      content: "An administrator has replied to your support ticket.",
      href: "/dashboard/support"
    });

    const data = await getAllChats();
    setChats(data);

    setReplyMessages((prev) => ({ ...prev, [userId]: "" }));
    setIsSending((prev) => ({ ...prev, [userId]: false }));
  };
  
  const handleAnalyze = async (userId: string, messages: Message[]) => {
    setIsAnalyzing((prev) => ({ ...prev, [userId]: true }));
    setAnalysis((prev) => ({ ...prev, [userId]: null }));
    try {
      const response = await fetch('/api/support-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error('Failed to get analysis from the server.');
      }

      const result: SupportAgentOutput = await response.json();
      setAnalysis((prev) => ({ ...prev, [userId]: result }));
    } catch (e) {
      console.error(e);
      toast({
        title: "AI Analysis Failed",
        description: "Could not analyze the conversation.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const sortedChats = chats
    ? Object.entries(chats).sort(([, a], [, b]) => {
        const lastMsgA = a[a.length - 1]?.timestamp ?? 0;
        const lastMsgB = b[b.length - 1]?.timestamp ?? 0;
        return lastMsgB - lastMsgA;
      })
    : [];

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }
  
  if (!chats || sortedChats.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">No messages found.</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {sortedChats.map(([userId, messages]) => {
        const wallet = wallets?.[userId];
        const displayName = wallet?.profile?.username || userId;

        return (
          <AccordionItem value={userId} key={userId}>
            <AccordionTrigger>
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {messages.length} message(s) from {userId}
                  </p>
                </div>
                <Badge
                  variant={
                    messages[messages.length - 1]?.sender === "user"
                      ? "destructive"
                      : "secondary"
                  }
                  className="mr-4"
                >
                  {messages[messages.length - 1]?.sender === "user" ? "New" : "Viewed"}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                 <Card className="bg-muted/30">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAnalyze(userId, messages)} 
                          disabled={isAnalyzing[userId] || isLoading}
                      >
                          {isAnalyzing[userId] ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                              <BrainCircuit className="mr-2 h-4 w-4" />
                          )}
                          Analyze with AI
                      </Button>
                    </div>

                    {isAnalyzing[userId] && (
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-4/5" />
                            </div>
                             <div className="space-y-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    )}

                    {analysis[userId] && (
                        <div className="space-y-3 animate-in fade-in-50">
                            <div>
                                <h4 className="font-semibold text-sm text-foreground">AI Summary</h4>
                                <p className="text-sm text-muted-foreground">{analysis[userId]?.summary}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-foreground">Suggested Reply</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap p-3 bg-background rounded-md border">{analysis[userId]?.suggestedReply}</p>
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="mt-2 px-2"
                                    onClick={() => setReplyMessages(prev => ({ ...prev, [userId]: analysis[userId]?.suggestedReply || '' }))}
                                >
                                    Use this reply
                                </Button>
                            </div>
                        </div>
                    )}
                  </CardContent>
                </Card>

                <ScrollArea className="h-64 w-full rounded-md border p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="flex flex-col">
                        <div className="text-xs text-muted-foreground flex justify-between">
                          <span className="font-bold">
                            {message.sender === "user" ? displayName : "Admin"}
                          </span>
                          <span>{format(new Date(message.timestamp), "PPp")}</span>
                        </div>
                        <div
                          className={cn(
                            "rounded-md p-3 text-sm",
                            message.silent
                              ? "bg-accent text-accent-foreground/80 italic"
                              : "bg-muted/50"
                          )}
                        >
                          <p>{message.text}</p>
                           {message.file && message.file.type.startsWith('image/') && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={message.file.dataUrl} alt={message.file.name} className="mt-2 rounded-md max-w-full h-auto" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(userId);
                  }}
                  className="flex w-full items-center space-x-2 border-t pt-4"
                >
                  <Input
                    value={replyMessages[userId] || ""}
                    onChange={(e) =>
                      setReplyMessages((prev) => ({
                        ...prev,
                        [userId]: e.target.value,
                      }))
                    }
                    placeholder="Type your reply..."
                    disabled={isSending[userId]}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isSending[userId] || !replyMessages[userId]?.trim()}
                  >
                    {isSending[userId] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  );
}
