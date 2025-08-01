'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GlassCard } from '@/components/ui/glass-card';
import { Send, Users, Crown, Shield, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SquadClanChatProps {
  clanId: string;
}

export function SquadClanChat({ clanId }: SquadClanChatProps) {
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState([
    {
      id: '1',
      user: 'CryptoKing',
      avatar: '/api/placeholder/32/32',
      message: 'Welcome to our clan! 🎉',
      timestamp: '10:30 AM',
      role: 'leader' as const,
    },
    {
      id: '2',
      user: 'TradeWizard',
      avatar: '/api/placeholder/32/32',
      message: 'Great trading session today! Made 12% profit 📈',
      timestamp: '10:32 AM',
      role: 'member' as const,
    },
    {
      id: '3',
      user: 'BlockMaster',
      avatar: '/api/placeholder/32/32',
      message: 'Anyone else seeing this BTC pump?',
      timestamp: '10:35 AM',
      role: 'moderator' as const,
    },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      user: 'You',
      avatar: '/api/placeholder/32/32',
      message: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      role: 'member' as const,
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'leader': return <Crown className="h-3 w-3 text-yellow-400" />;
      case 'moderator': return <Shield className="h-3 w-3 text-blue-400" />;
      default: return null;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'leader': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'moderator': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      default: return 'bg-primary/10 border-primary/30 text-primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Chat Header */}
      <GlassCard variant="gradient" className="border-b-0 rounded-b-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Clan Chat #{clanId}</h1>
              <p className="text-sm text-muted-foreground">12 members online</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
            Active
          </Badge>
        </div>
      </GlassCard>

      {/* Chat Messages */}
      <GlassCard variant="crypto" className="min-h-[60vh] flex flex-col">
        <div className="flex-1 space-y-4 p-6 overflow-y-auto max-h-96">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={msg.avatar} alt={msg.user} />
                <AvatarFallback>{msg.user[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{msg.user}</span>
                  {getRoleIcon(msg.role)}
                  <Badge variant="outline" className={cn("text-xs h-5 px-2", getRoleBadge(msg.role))}>
                    {msg.role}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                </div>
                <p className="text-sm bg-background/50 rounded-lg p-3 border border-border/50">
                  {msg.message}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t border-border/50 p-4">
          <div className="flex gap-3">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-background/50 border-border/50"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              onClick={() => setMessage(prev => prev + ' 😊')}
              variant="outline"
              size="icon"
              className="h-10 w-10"
            >
              <Smile className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSendMessage}
              className="h-10 w-10"
              size="icon"
              disabled={!message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-12 flex-col gap-1">
          <Users className="h-4 w-4" />
          <span className="text-xs">Members</span>
        </Button>
        <Button variant="outline" className="h-12 flex-col gap-1">
          <Shield className="h-4 w-4" />
          <span className="text-xs">Settings</span>
        </Button>
        <Button variant="outline" className="h-12 flex-col gap-1">
          <Crown className="h-4 w-4" />
          <span className="text-xs">Leaderboard</span>
        </Button>
        <Button variant="outline" className="h-12 flex-col gap-1">
          <Send className="h-4 w-4" />
          <span className="text-xs">Invite</span>
        </Button>
      </div>
    </div>
  );
}
