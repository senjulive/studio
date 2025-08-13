'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  MessageSquare, 
  Users, 
  AlertTriangle,
  CheckCircle,
  X,
  Eye,
  Flag,
  Ban,
  Mute,
  Clock,
  Search,
  Filter,
  Send,
  UserCheck,
  UserX,
  FileText,
  HelpCircle,
  Zap
} from 'lucide-react';

const mockTickets = [
  {
    id: '1',
    user: 'trader_pro',
    subject: 'Withdrawal Issue',
    message: 'My withdrawal has been pending for 3 days. Please help!',
    status: 'open',
    priority: 'high',
    category: 'withdrawal',
    timestamp: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    user: 'crypto_king',
    subject: 'Trading Bot Problem',
    message: 'The bot stopped working suddenly. Lost connection.',
    status: 'in_progress',
    priority: 'medium',
    category: 'technical',
    timestamp: '2024-01-15T09:45:00Z'
  },
  {
    id: '3',
    user: 'newbie_trader',
    subject: 'Account Verification',
    message: 'Need help with account verification process.',
    status: 'resolved',
    priority: 'low',
    category: 'account',
    timestamp: '2024-01-14T16:20:00Z'
  }
];

const mockReports = [
  {
    id: '1',
    reporter: 'honest_trader',
    reported: 'spam_user',
    reason: 'Spam in chat',
    description: 'User keeps posting referral links and spam messages',
    status: 'pending',
    timestamp: '2024-01-15T11:15:00Z'
  },
  {
    id: '2',
    reporter: 'veteran_trader',
    reported: 'scammer_alert',
    reason: 'Suspicious behavior',
    description: 'Asking for private keys and personal information',
    status: 'investigating',
    timestamp: '2024-01-15T08:30:00Z'
  }
];

const mockChatMessages = [
  {
    id: '1',
    user: 'trader_pro',
    message: 'Anyone else having issues with deposits?',
    timestamp: '2024-01-15T12:00:00Z',
    flagged: false
  },
  {
    id: '2',
    user: 'spam_user',
    message: 'Check out my amazing trading signals! Join my group for 50% off!',
    timestamp: '2024-01-15T11:55:00Z',
    flagged: true
  },
  {
    id: '3',
    user: 'helpful_user',
    message: 'Make sure to double-check your wallet address before sending',
    timestamp: '2024-01-15T11:50:00Z',
    flagged: false
  }
];

export function ModeratorDashboardMobile() {
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = React.useState<any>(null);
  const [ticketResponse, setTicketResponse] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || ticket.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleTicketAction = (ticketId: string, action: string) => {
    toast({
      title: `Ticket ${action}`,
      description: `Ticket has been ${action}.`,
    });
    if (action === 'resolved') {
      setSelectedTicket(null);
    }
  };

  const handleReportAction = (reportId: string, action: string) => {
    toast({
      title: `Report ${action}`,
      description: `Report has been ${action}.`,
    });
  };

  const handleChatAction = (messageId: string, action: string) => {
    toast({
      title: `Message ${action}`,
      description: `Chat message has been ${action}.`,
    });
  };

  const sendTicketResponse = () => {
    if (!ticketResponse.trim()) return;
    
    toast({
      title: "Response Sent",
      description: "Your response has been sent to the user.",
    });
    setTicketResponse('');
  };

  const moderatorStats = {
    openTickets: mockTickets.filter(t => t.status === 'open').length,
    inProgressTickets: mockTickets.filter(t => t.status === 'in_progress').length,
    pendingReports: mockReports.filter(r => r.status === 'pending').length,
    flaggedMessages: mockChatMessages.filter(m => m.flagged).length
  };

  return (
    <div className="space-y-4">
      {/* Moderator Header */}
      <div className="mobile-card">
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mx-auto mb-4 flex items-center justify-center electric-glow">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Moderator Panel</h1>
          <p className="text-muted-foreground">Support and community management</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mobile-card">
        <div className="p-6">
          <h2 className="font-bold text-lg mb-4">Quick Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-background/50 rounded-xl border border-primary/10">
              <HelpCircle className="w-5 h-5 text-orange-400 mb-2" />
              <p className="text-xs text-muted-foreground">Open Tickets</p>
              <p className="font-bold text-orange-400">{moderatorStats.openTickets}</p>
            </div>
            <div className="p-4 bg-background/50 rounded-xl border border-primary/10">
              <Clock className="w-5 h-5 text-blue-400 mb-2" />
              <p className="text-xs text-muted-foreground">In Progress</p>
              <p className="font-bold text-blue-400">{moderatorStats.inProgressTickets}</p>
            </div>
            <div className="p-4 bg-background/50 rounded-xl border border-primary/10">
              <Flag className="w-5 h-5 text-red-400 mb-2" />
              <p className="text-xs text-muted-foreground">Reports</p>
              <p className="font-bold text-red-400">{moderatorStats.pendingReports}</p>
            </div>
            <div className="p-4 bg-background/50 rounded-xl border border-primary/10">
              <MessageSquare className="w-5 h-5 text-purple-400 mb-2" />
              <p className="text-xs text-muted-foreground">Flagged</p>
              <p className="font-bold text-purple-400">{moderatorStats.flaggedMessages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Moderator Tabs */}
      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="tickets" className="text-xs">Support</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs">Reports</TabsTrigger>
          <TabsTrigger value="chat" className="text-xs">Chat</TabsTrigger>
        </TabsList>

        {/* Support Tickets */}
        <TabsContent value="tickets" className="space-y-4 mt-4">
          {/* Search and Filters */}
          <div className="mobile-card">
            <div className="p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="mobile-card">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{ticket.subject}</h3>
                      <p className="text-sm text-muted-foreground">From: {ticket.user}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={ticket.priority === 'high' ? 'destructive' : ticket.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {ticket.priority}
                      </Badge>
                      <Badge 
                        variant={ticket.status === 'open' ? 'destructive' : ticket.status === 'in_progress' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-3 line-clamp-2">{ticket.message}</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {new Date(ticket.timestamp).toLocaleString()}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    {ticket.status === 'open' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs text-blue-400 border-blue-400/50"
                        onClick={() => handleTicketAction(ticket.id, 'assigned')}
                      >
                        <UserCheck className="w-3 h-3 mr-1" />
                        Take
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* User Reports */}
        <TabsContent value="reports" className="space-y-4 mt-4">
          <div className="space-y-3">
            {mockReports.map((report) => (
              <div key={report.id} className="mobile-card">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{report.reason}</h3>
                      <p className="text-sm text-muted-foreground">
                        {report.reporter} reported {report.reported}
                      </p>
                    </div>
                    <Badge 
                      variant={report.status === 'pending' ? 'destructive' : 'default'}
                      className="text-xs"
                    >
                      {report.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm mb-3">{report.description}</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {new Date(report.timestamp).toLocaleString()}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs text-green-400 border-green-400/50"
                      onClick={() => handleReportAction(report.id, 'resolved')}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs text-red-400 border-red-400/50"
                      onClick={() => handleReportAction(report.id, 'dismissed')}
                    >
                      <X className="w-3 h-3 mr-1" />
                      Dismiss
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => handleReportAction(report.id, 'investigate')}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Investigate
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Chat Moderation */}
        <TabsContent value="chat" className="space-y-4 mt-4">
          <div className="space-y-3">
            {mockChatMessages.map((message) => (
              <div key={message.id} className={cn(
                "mobile-card",
                message.flagged && "border-red-500/50 bg-red-500/5"
              )}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{message.user}</span>
                      {message.flagged && (
                        <Badge variant="destructive" className="text-xs">
                          Flagged
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="text-sm mb-3">{message.message}</p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs text-red-400 border-red-400/50"
                      onClick={() => handleChatAction(message.id, 'deleted')}
                    >
                      <X className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs text-orange-400 border-orange-400/50"
                      onClick={() => handleChatAction(message.id, 'warned')}
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Warn
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleChatAction(message.id, 'muted')}
                    >
                      <Mute className="w-3 h-3 mr-1" />
                      Mute
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="mobile-card w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Support Ticket</h3>
                <Button variant="ghost" size="icon" onClick={() => setSelectedTicket(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{selectedTicket.subject}</h4>
                  <div className="flex gap-2 mb-3">
                    <Badge variant="outline">{selectedTicket.category}</Badge>
                    <Badge variant={selectedTicket.priority === 'high' ? 'destructive' : 'default'}>
                      {selectedTicket.priority}
                    </Badge>
                    <Badge variant="secondary">{selectedTicket.status}</Badge>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">From: {selectedTicket.user}</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Created: {new Date(selectedTicket.timestamp).toLocaleString()}
                  </p>
                </div>

                <div className="p-4 bg-background/50 rounded-xl">
                  <p className="text-sm">{selectedTicket.message}</p>
                </div>

                <div>
                  <h5 className="font-semibold mb-2">Response</h5>
                  <Textarea
                    placeholder="Type your response..."
                    value={ticketResponse}
                    onChange={(e) => setTicketResponse(e.target.value)}
                    className="mb-3"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={sendTicketResponse}
                      className="flex-1"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      Send
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTicketAction(selectedTicket.id, 'resolved')}
                      className="flex-1 text-green-400 border-green-400/50"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Resolve
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
