'use client';

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  MessageSquare, 
  Users, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCog,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";

type SupportTicket = {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  status: "open" | "pending" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: "technical" | "billing" | "general" | "complaint";
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  responses: number;
};

const mockTickets: SupportTicket[] = [
  {
    id: "ticket_001",
    userId: "user_123",
    userName: "John Doe",
    subject: "Unable to withdraw funds",
    message: "I've been trying to withdraw my USDT but the transaction keeps failing...",
    status: "open",
    priority: "high",
    category: "technical",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    responses: 0
  },
  {
    id: "ticket_002",
    userId: "user_456",
    userName: "Jane Smith",
    subject: "Account verification pending",
    message: "My KYC verification has been pending for 5 days...",
    status: "pending",
    priority: "medium",
    category: "billing",
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-15T09:20:00Z",
    assignedTo: "Admin Team",
    responses: 2
  },
  {
    id: "ticket_003",
    userId: "user_789",
    userName: "Mike Johnson",
    subject: "Trading bot not working",
    message: "My trading bot stopped working yesterday and I'm losing money...",
    status: "resolved",
    priority: "urgent",
    category: "technical",
    createdAt: "2024-01-13T08:15:00Z",
    updatedAt: "2024-01-14T16:30:00Z",
    assignedTo: "Tech Support",
    responses: 5
  }
];

export function SupportPageAdmin() {
  const { toast } = useToast();
  const [tickets, setTickets] = React.useState<SupportTicket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = React.useState<SupportTicket | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = React.useState(false);
  const [responseText, setResponseText] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [filterPriority, setFilterPriority] = React.useState<string>("all");

  const filteredTickets = tickets.filter(ticket => {
    if (filterStatus !== "all" && ticket.status !== filterStatus) return false;
    if (filterPriority !== "all" && ticket.priority !== filterPriority) return false;
    return true;
  });

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case "open": return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      case "pending": return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
      case "resolved": return "bg-green-500/10 border-green-500/20 text-green-400";
      case "closed": return "bg-gray-500/10 border-gray-500/20 text-gray-400";
      default: return "bg-gray-500/10 border-gray-500/20 text-gray-400";
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case "low": return "bg-green-500/10 border-green-500/20 text-green-400";
      case "medium": return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
      case "high": return "bg-orange-500/10 border-orange-500/20 text-orange-400";
      case "urgent": return "bg-red-500/10 border-red-500/20 text-red-400";
      default: return "bg-gray-500/10 border-gray-500/20 text-gray-400";
    }
  };

  const handleStatusChange = (ticketId: string, newStatus: SupportTicket['status']) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() }
        : ticket
    ));
    
    toast({
      title: "Status Updated",
      description: `Ticket status changed to ${newStatus}`,
    });
  };

  const handleAssignTicket = (ticketId: string, assignee: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, assignedTo: assignee, updatedAt: new Date().toISOString() }
        : ticket
    ));
    
    toast({
      title: "Ticket Assigned",
      description: `Ticket assigned to ${assignee}`,
    });
  };

  const handleSendResponse = () => {
    if (!selectedTicket || !responseText.trim()) return;

    setTickets(prev => prev.map(ticket => 
      ticket.id === selectedTicket.id 
        ? { 
            ...ticket, 
            responses: ticket.responses + 1,
            updatedAt: new Date().toISOString(),
            status: ticket.status === "open" ? "pending" : ticket.status
          }
        : ticket
    ));

    toast({
      title: "Response Sent",
      description: "Your response has been sent to the user",
    });

    setResponseText("");
    setIsResponseDialogOpen(false);
    setSelectedTicket(null);
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    pending: tickets.filter(t => t.status === "pending").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
    urgent: tickets.filter(t => t.priority === "urgent").length
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-red-500/5 to-orange-500/5 border-red-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
          <Settings className="h-5 w-5" />
          Support Administration
        </CardTitle>
        <CardDescription>
          Manage support tickets, respond to users, and track support metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Tickets</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.open}</div>
              <div className="text-sm text-muted-foreground">Open</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
              <div className="text-sm text-muted-foreground">Urgent</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="group relative overflow-hidden rounded-xl border p-4 hover:border-primary/50 transition-all duration-300 bg-background/50">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground">{ticket.subject}</h4>
                      <Badge variant="outline" className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      From: <span className="font-medium">{ticket.userName}</span> • 
                      Category: <span className="font-medium">{ticket.category}</span> • 
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {ticket.message}
                    </p>
                    
                    {ticket.assignedTo && (
                      <div className="flex items-center gap-1 mt-2">
                        <UserCog className="h-3 w-3" />
                        <span className="text-xs text-muted-foreground">
                          Assigned to: {ticket.assignedTo}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {ticket.responses} responses
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{ticket.subject}</DialogTitle>
                          <DialogDescription>
                            Ticket #{ticket.id} from {ticket.userName}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm">{ticket.message}</p>
                          </div>
                          <div className="grid gap-2 grid-cols-2 text-sm">
                            <div>Status: <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge></div>
                            <div>Priority: <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge></div>
                            <div>Category: {ticket.category}</div>
                            <div>Created: {new Date(ticket.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Select 
                      value={ticket.status} 
                      onValueChange={(value) => handleStatusChange(ticket.id, value as SupportTicket['status'])}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setIsResponseDialogOpen(true);
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Respond
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Response Dialog */}
        <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Respond to Ticket</DialogTitle>
              <DialogDescription>
                {selectedTicket && `Responding to "${selectedTicket.subject}" from ${selectedTicket.userName}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Type your response here..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendResponse} disabled={!responseText.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Send Response
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
