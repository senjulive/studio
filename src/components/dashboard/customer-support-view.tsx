"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { 
  Send, 
  Users, 
  Bot, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Headphones,
  MessageSquare,
  FileText,
  HelpCircle,
  Phone,
  Mail,
  Star,
  Brain,
  Zap,
  Shield,
  ThumbsUp,
  User
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import { getUserRank } from "@/lib/ranks";
import { cn } from "@/lib/utils";
import { AstralLogo } from "../icons/astral-logo";
import * as z from "zod";

const supportTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  priority: z.enum(["low", "medium", "high"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const chatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  type: z.enum(["text", "file"]).default("text"),
});

type SupportTicketValues = z.infer<typeof supportTicketSchema>;
type ChatMessageValues = z.infer<typeof chatMessageSchema>;

type SupportMessage = {
  id: string;
  content: string;
  timestamp: number;
  isUser: boolean;
  isAgent?: boolean;
  agentName?: string;
  status?: "sent" | "delivered" | "read";
};

const quickActions = [
  { label: "Account Verification", action: "verification", icon: Shield },
  { label: "Withdrawal Help", action: "withdrawal", icon: Phone },
  { label: "Trading Bot Issues", action: "bot", icon: Bot },
  { label: "Security Questions", action: "security", icon: Shield },
];

const faqs = [
  {
    question: "How long does account verification take?",
    answer: "Account verification typically takes 24-48 hours during business days. You'll receive an email notification once completed.",
    category: "account"
  },
  {
    question: "What are the withdrawal limits?",
    answer: "Withdrawal limits depend on your verification level. Verified accounts can withdraw up to $10,000 daily, while unverified accounts have a $500 daily limit.",
    category: "withdrawal"
  },
  {
    question: "How does the AstralCore Hyperdrive work?",
    answer: "Our AstralCore Hyperdrive uses quantum-enhanced grid trading algorithms to automatically buy low and sell high, generating profits from market volatility with neural network optimization.",
    category: "trading"
  },
  {
    question: "Is my money safe with AstralCore?",
    answer: "Yes, we use military-grade security measures including quantum encryption, cold storage, multi-factor authentication, and regular security audits to protect your funds.",
    category: "security"
  }
];

export function CustomerSupportView() {
  const { user } = useUser();
  const { toast } = useToast();
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [messages, setMessages] = React.useState<SupportMessage[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("chat");
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (user?.id) {
      getOrCreateWallet(user.id).then((walletData) => {
        setWallet(walletData);
        setIsLoading(false);
      });
    }
  }, [user]);

  const ticketForm = useForm<SupportTicketValues>({
    resolver: zodResolver(supportTicketSchema),
    defaultValues: {
      subject: "",
      category: "technical",
      priority: "medium",
      message: "",
    },
  });

  const messageForm = useForm<ChatMessageValues>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      message: "",
      type: "text",
    },
  });

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmitTicket = async (values: SupportTicketValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Support Ticket Created",
        description: `Your ticket has been submitted successfully. Ticket ID: ASTRAL-${Date.now()}`,
      });
      
      ticketForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create support ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitMessage = async (values: ChatMessageValues) => {
    if (!values.message.trim()) return;

    const newMessage: SupportMessage = {
      id: `msg_${Date.now()}`,
      content: values.message,
      timestamp: Date.now(),
      isUser: true,
      status: "sent"
    };

    setMessages(prev => [...prev, newMessage]);
    messageForm.reset();

    // Simulate auto-response
    setTimeout(() => {
      const autoResponse: SupportMessage = {
        id: `msg_auto_${Date.now()}`,
        content: "Thank you for contacting AstralCore support! An agent will respond within 15 minutes during business hours.",
        timestamp: Date.now(),
        isUser: false,
        isAgent: true,
        agentName: "AstralCore AI Assistant",
        status: "delivered"
      };
      setMessages(prev => [...prev, autoResponse]);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    let response = "";
    switch (action) {
      case "verification":
        response = `Your account verification status: ${wallet?.profile?.verificationStatus === 'verified' ? 'Verified ✅' : 'Pending verification 🔄'}. Upload required documents in the KYC section to complete verification.`;
        break;
      case "withdrawal":
        response = "For withdrawal assistance: 1) Ensure account is verified 2) Check minimum withdrawal amounts 3) Verify wallet addresses 4) Contact support if transactions fail.";
        break;
      case "bot":
        response = "AstralCore Hyperdrive Status: The quantum trading system is operational. Ensure sufficient balance for grid trading. Configure your risk settings in the Hyperdrive panel.";
        break;
      case "security":
        response = "Security recommendations: Enable 2FA, use strong passwords, never share login details, and regularly monitor your account activity. Report suspicious activity immediately.";
        break;
      default:
        response = "Hello! How can AstralCore support assist you today?";
    }

    const botMessage: SupportMessage = {
      id: `msg_bot_${Date.now()}`,
      content: response,
      timestamp: Date.now(),
      isUser: false,
      isAgent: true,
      agentName: "AstralCore AI Assistant",
      status: "delivered"
    };

    setMessages(prev => [...prev, botMessage]);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="h-20 w-20 rounded-full bg-gray-700 animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-6 w-48 bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalBalance = wallet?.balances?.usdt ?? 0;
  const rank = getUserRank(totalBalance);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Profile-style Header */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-lg animate-neural-pulse"></div>
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 relative border-2 border-cyan-400/40 backdrop-blur-xl">
                  <AvatarImage
                    src={wallet?.profile?.avatarUrl}
                    alt={wallet?.profile?.username || 'User'}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500/30 to-blue-500/20 text-cyan-400 font-bold text-lg backdrop-blur-xl">
                    {wallet?.profile?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <Headphones className="h-6 w-6 text-cyan-400" />
                    Customer Support
                  </h1>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  Get expert help from the AstralCore support team
                </p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge className="flex items-center gap-1 text-xs bg-cyan-500/20 text-cyan-300 border-cyan-400/40">
                    <MessageSquare className="h-3 w-3" />
                    Live Support
                  </Badge>
                  <Badge variant="outline" className="text-xs border-green-400/40 text-green-300 bg-green-400/10">
                    <Clock className="h-3 w-3 mr-1" />
                    24/7 Available
                  </Badge>
                  <Badge variant="outline" className="text-xs border-purple-400/40 text-purple-300 bg-purple-400/10">
                    <Brain className="h-3 w-3 mr-1" />
                    AI Enhanced
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </Button>
              <Button
                size="sm"
                className="flex-1 sm:flex-none bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Support Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-green-400/20 rounded-lg blur-sm"></div>
              <div className="relative bg-gradient-to-br from-green-500/20 to-green-600/10 p-2 rounded-lg border border-green-400/30">
                <Clock className="h-5 w-5 mx-auto text-green-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-white">Response Time</p>
            <p className="text-xs text-green-400">< 15 min</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-sm"></div>
              <div className="relative bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-2 rounded-lg border border-blue-400/30">
                <Users className="h-5 w-5 mx-auto text-blue-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-white">Agents Online</p>
            <p className="text-xs text-blue-400">12 Available</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-lg blur-sm"></div>
              <div className="relative bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 p-2 rounded-lg border border-yellow-400/30">
                <Star className="h-5 w-5 mx-auto text-yellow-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-white">Satisfaction</p>
            <p className="text-xs text-yellow-400">98.5%</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-purple-400/20 rounded-lg blur-sm"></div>
              <div className="relative bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-2 rounded-lg border border-purple-400/30">
                <Brain className="h-5 w-5 mx-auto text-purple-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-white">AI Assist</p>
            <p className="text-xs text-purple-400">Active</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardContent className="p-0">
          <div className="flex border-b border-border/40">
            <button
              onClick={() => setActiveTab("chat")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === "chat"
                  ? "text-cyan-400 bg-cyan-500/10"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Live Chat
              </div>
              {activeTab === "chat" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("ticket")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === "ticket"
                  ? "text-blue-400 bg-blue-500/10"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" />
                Create Ticket
              </div>
              {activeTab === "ticket" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("faq")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === "faq"
                  ? "text-purple-400 bg-purple-500/10"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <HelpCircle className="h-4 w-4" />
                FAQ
              </div>
              {activeTab === "faq" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400"></div>
              )}
            </button>
          </div>

          <div className="p-6">
            {activeTab === "chat" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Live Support Chat</h3>
                  <p className="text-sm text-gray-400">
                    Connect with our expert support team for immediate assistance
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {quickActions.map((action) => {
                    const IconComponent = action.icon;
                    return (
                      <Button
                        key={action.action}
                        variant="outline"
                        size="sm"
                        className="h-auto py-3 px-4 flex flex-col items-center gap-2 bg-black/20 border-border/40"
                        onClick={() => handleQuickAction(action.action)}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span className="text-xs text-center">{action.label}</span>
                      </Button>
                    );
                  })}
                </div>

                {/* Chat Interface */}
                <Card className="bg-black/20 backdrop-blur-xl border-border/20">
                  <CardContent className="p-4">
                    <ScrollArea className="h-[400px] pr-4 mb-4" viewportRef={scrollAreaRef}>
                      {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-lg animate-pulse"></div>
                            <AstralLogo className="h-16 w-16 relative text-cyan-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">Welcome to AstralCore Support</p>
                            <p className="text-sm text-gray-400">
                              Start a conversation or use quick actions above
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={cn(
                                "flex gap-3",
                                message.isUser ? "justify-end" : "justify-start"
                              )}
                            >
                              {!message.isUser && (
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-gradient-to-br from-cyan-500/30 to-blue-500/20 text-cyan-400">
                                    {message.agentName ? message.agentName[0] : 'A'}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              
                              <div className={cn(
                                "max-w-xs lg:max-w-md space-y-1",
                                message.isUser && "items-end"
                              )}>
                                {!message.isUser && message.agentName && (
                                  <p className="text-xs text-cyan-400 font-medium">
                                    {message.agentName}
                                  </p>
                                )}
                                <div className={cn(
                                  "rounded-lg px-3 py-2 text-sm",
                                  message.isUser
                                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                                    : "bg-black/20 border border-border/40 backdrop-blur-xl text-gray-100"
                                )}>
                                  {message.content}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <span>{format(new Date(message.timestamp), "HH:mm")}</span>
                                  {message.isUser && message.status && (
                                    <>
                                      <span>•</span>
                                      {message.status === "sent" && <Clock className="h-3 w-3" />}
                                      {message.status === "delivered" && <CheckCircle className="h-3 w-3" />}
                                      {message.status === "read" && <CheckCircle className="h-3 w-3 text-cyan-400" />}
                                    </>
                                  )}
                                </div>
                              </div>

                              {message.isUser && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={wallet?.profile?.avatarUrl} />
                                  <AvatarFallback className="bg-gradient-to-br from-purple-500/30 to-blue-500/20 text-purple-400">
                                    {(wallet?.profile?.username || user?.email || 'U')[0].toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>

                    <Form {...messageForm}>
                      <form
                        onSubmit={messageForm.handleSubmit(onSubmitMessage)}
                        className="flex gap-2"
                      >
                        <FormField
                          control={messageForm.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder="Type your message..."
                                  {...field}
                                  className="bg-black/20 border-border/40 backdrop-blur-xl"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" size="icon" className="bg-gradient-to-r from-cyan-500 to-blue-600">
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "ticket" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Create Support Ticket</h3>
                  <p className="text-sm text-gray-400">
                    Submit a detailed request and our team will respond within 24 hours
                  </p>
                </div>

                <Form {...ticketForm}>
                  <form onSubmit={ticketForm.handleSubmit(onSubmitTicket)} className="space-y-6">
                    <FormField
                      control={ticketForm.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-400" />
                            Subject
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Brief description of your issue" 
                              {...field} 
                              className="bg-black/20 border-border/40 backdrop-blur-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={ticketForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-black/20 border-border/40 backdrop-blur-xl">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-black/90 backdrop-blur-xl border-border/40">
                                <SelectItem value="technical">Technical Issue</SelectItem>
                                <SelectItem value="account">Account Related</SelectItem>
                                <SelectItem value="trading">Hyperdrive Trading</SelectItem>
                                <SelectItem value="deposit">Deposit Issues</SelectItem>
                                <SelectItem value="withdrawal">Withdrawal Issues</SelectItem>
                                <SelectItem value="security">Security Concerns</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={ticketForm.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-black/20 border-border/40 backdrop-blur-xl">
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-black/90 backdrop-blur-xl border-border/40">
                                <SelectItem value="low">Low - General inquiry</SelectItem>
                                <SelectItem value="medium">Medium - Standard issue</SelectItem>
                                <SelectItem value="high">High - Urgent problem</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={ticketForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-blue-400" />
                            Message
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please provide detailed information about your issue, including any error messages and steps to reproduce the problem..."
                              className="min-h-[120px] bg-black/20 border-border/40 backdrop-blur-xl resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-center">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full sm:w-auto min-w-48 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                            Creating Ticket...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Create Support Ticket
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}

            {activeTab === "faq" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Frequently Asked Questions</h3>
                  <p className="text-sm text-gray-400">
                    Find quick answers to common questions about AstralCore
                  </p>
                </div>

                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <Card key={index} className="bg-black/20 backdrop-blur-xl border-border/20">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-400/30 mt-1">
                              <HelpCircle className="h-4 w-4 text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white mb-2">{faq.question}</h4>
                              <p className="text-sm text-gray-300 leading-relaxed">{faq.answer}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-border/20">
                            <Badge variant="outline" className="text-xs border-purple-400/40 text-purple-300 bg-purple-400/10">
                              {faq.category}
                            </Badge>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <MessageSquare className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}