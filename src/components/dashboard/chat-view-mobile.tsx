'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Globe,
  Crown,
  Star,
  Settings,
  Smile,
  Image,
  Paperclip,
  Phone,
  Video,
  MoreHorizontal,
  Search,
  Pin,
  Mute,
  VolumeX
} from 'lucide-react';

const chatRooms = [
  {
    id: 'general',
    name: 'General Chat',
    description: 'General discussion for all members',
    icon: <Globe className="w-5 h-5" />,
    members: 1247,
    isActive: true,
    unread: 5
  },
  {
    id: 'vip',
    name: 'VIP Lounge',
    description: 'Exclusive chat for VIP members',
    icon: <Crown className="w-5 h-5" />,
    members: 156,
    isActive: true,
    unread: 2,
    restricted: true
  },
  {
    id: 'trading',
    name: 'Trading Signals',
    description: 'Share trading insights and signals',
    icon: <Star className="w-5 h-5" />,
    members: 892,
    isActive: true,
    unread: 0
  },
  {
    id: 'support',
    name: 'Technical Support',
    description: 'Get help from our support team',
    icon: <MessageSquare className="w-5 h-5" />,
    members: 234,
    isActive: false,
    unread: 0
  }
];

const mockMessages = [
  {
    id: '1',
    user: 'admin',
    username: 'AstralCore Admin',
    message: 'Welcome to AstralCore! Please follow our community guidelines.',
    timestamp: '2024-01-15T09:00:00Z',
    isAdmin: true,
    avatar: null
  },
  {
    id: '2',
    user: 'trader_pro',
    username: 'TraderPro',
    message: 'Hey everyone! Just made a successful trade on BTC/USDT 🚀',
    timestamp: '2024-01-15T10:15:00Z',
    isAdmin: false,
    avatar: null,
    reactions: ['🚀', '👍', '💰']
  },
  {
    id: '3',
    user: 'crypto_king',
    username: 'CryptoKing',
    message: 'Anyone else seeing this bullish pattern on ETH?',
    timestamp: '2024-01-15T10:20:00Z',
    isAdmin: false,
    avatar: null
  },
  {
    id: '4',
    user: 'newbie_trader',
    username: 'NewbieTrader',
    message: 'Can someone help me understand how the bot works?',
    timestamp: '2024-01-15T10:25:00Z',
    isAdmin: false,
    avatar: null
  },
  {
    id: '5',
    user: 'helpful_user',
    username: 'HelpfulUser',
    message: 'Check out the tutorial section in the dashboard. It explains everything step by step.',
    timestamp: '2024-01-15T10:27:00Z',
    isAdmin: false,
    avatar: null
  }
];

const popularEmojis = ['😀', '😎', '🚀', '💰', '👍', '❤️', '🔥', '💪', '🎉', '⚡'];

export function ChatViewMobile() {
  const { wallet } = useUser();
  const { toast } = useToast();
  const [selectedRoom, setSelectedRoom] = React.useState(chatRooms[0]);
  const [messages, setMessages] = React.useState(mockMessages);
  const [newMessage, setNewMessage] = React.useState('');
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const username = wallet?.profile?.username || 'User';
  const userInitial = username.charAt(0).toUpperCase();

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      user: 'current_user',
      username: username,
      message: newMessage,
      timestamp: new Date().toISOString(),
      isAdmin: false,
      avatar: wallet?.profile?.avatarUrl || null
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Auto-scroll to bottom
    setTimeout(() => {
      scrollAreaRef.current?.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[600px]">
      {/* Chat Header */}
      <div className="mobile-card mb-4">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center electric-glow">
                {selectedRoom.icon}
              </div>
              <div>
                <h2 className="font-bold">{selectedRoom.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {selectedRoom.members} members online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Room Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {chatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all min-w-fit",
                  selectedRoom.id === room.id
                    ? "border-primary bg-primary/10 electric-glow"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className={cn(
                  "w-6 h-6 flex items-center justify-center",
                  selectedRoom.id === room.id ? "text-primary" : "text-muted-foreground"
                )}>
                  {room.icon}
                </div>
                <span className="text-sm font-medium">{room.name}</span>
                {room.unread > 0 && (
                  <Badge variant="destructive" className="h-5 min-w-[20px] text-xs">
                    {room.unread}
                  </Badge>
                )}
                {room.restricted && (
                  <Crown className="w-3 h-3 text-yellow-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="mobile-card flex-1 flex flex-col">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8 border-2 border-primary/20">
                  <AvatarImage src={message.avatar} alt={message.username} />
                  <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-secondary/20">
                    {message.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={cn(
                      "font-semibold text-sm",
                      message.isAdmin && "text-red-400"
                    )}>
                      {message.username}
                    </span>
                    {message.isAdmin && (
                      <Badge variant="destructive" className="text-xs h-4">
                        Admin
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  
                  <div className="p-3 bg-background/50 rounded-xl border border-primary/10 mb-2">
                    <p className="text-sm break-words">{message.message}</p>
                  </div>
                  
                  {message.reactions && (
                    <div className="flex gap-1">
                      {message.reactions.map((reaction, index) => (
                        <button
                          key={index}
                          className="text-xs bg-primary/10 hover:bg-primary/20 rounded-full px-2 py-1 transition-colors"
                        >
                          {reaction}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></div>
                </div>
                <span className="text-sm">Someone is typing...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="mb-3 p-3 bg-background/50 rounded-xl border border-primary/10">
              <div className="grid grid-cols-5 gap-2">
                {popularEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    className="text-xl hover:bg-primary/10 rounded-lg p-2 transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="pr-20 bg-background/50 border-primary/20 focus:border-primary/60"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="h-10 w-10 bg-gradient-to-r from-primary to-secondary electric-glow"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Rules */}
      <div className="mobile-card mt-4">
        <div className="p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Pin className="w-4 h-4 text-primary" />
            Chat Guidelines
          </h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Be respectful to all community members</p>
            <p>• No spam, self-promotion, or referral links</p>
            <p>• Keep discussions relevant to trading and AstralCore</p>
            <p>• Use appropriate language at all times</p>
          </div>
        </div>
      </div>
    </div>
  );
}
