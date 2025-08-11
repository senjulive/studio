'use client';

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  MessageSquare, 
  Users, 
  Eye, 
  EyeOff,
  Ban,
  Flag,
  Plus,
  Edit,
  Trash2,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Hash
} from "lucide-react";
import { cn } from "@/lib/utils";

type PostStatus = "published" | "pending" | "hidden" | "flagged";

type CommunityPost = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  hashtags: string[];
  mentions: string[];
  likes: number;
  comments: number;
  shares: number;
  status: PostStatus;
  createdAt: string;
  reports: number;
  isVerified: boolean;
};

const mockPosts: CommunityPost[] = [
  {
    id: "post_001",
    userId: "user_123",
    userName: "TradingPro2024",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TradingPro2024",
    content: "Just made 15% profit today with the AstralCore bot! 🚀 #trading #profit #astralcore",
    hashtags: ["trading", "profit", "astralcore"],
    mentions: [],
    likes: 45,
    comments: 12,
    shares: 8,
    status: "published",
    createdAt: "2024-01-15T10:30:00Z",
    reports: 0,
    isVerified: true
  },
  {
    id: "post_002",
    userId: "user_456",
    userName: "CryptoNewbie",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoNewbie",
    content: "Can someone help me understand how the grid trading works? @TradingPro2024 #help #gridtrading",
    hashtags: ["help", "gridtrading"],
    mentions: ["TradingPro2024"],
    likes: 23,
    comments: 18,
    shares: 3,
    status: "published",
    createdAt: "2024-01-15T09:15:00Z",
    reports: 0,
    isVerified: false
  },
  {
    id: "post_003",
    userId: "user_789",
    userName: "ScamAlert",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ScamAlert",
    content: "This platform is a scam! They took my money and won't let me withdraw! #scam #fraud",
    hashtags: ["scam", "fraud"],
    mentions: [],
    likes: 2,
    comments: 35,
    shares: 1,
    status: "flagged",
    createdAt: "2024-01-15T08:45:00Z",
    reports: 12,
    isVerified: false
  }
];

export function ChatPageAdmin() {
  const { toast } = useToast();
  const [posts, setPosts] = React.useState<CommunityPost[]>(mockPosts);
  const [selectedPost, setSelectedPost] = React.useState<CommunityPost | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [moderationReason, setModerationReason] = React.useState("");

  const filteredPosts = posts.filter(post => {
    if (filterStatus === "all") return true;
    if (filterStatus === "flagged") return post.status === "flagged" || post.reports > 0;
    return post.status === filterStatus;
  });

  const getStatusColor = (status: PostStatus) => {
    switch (status) {
      case "published": return "bg-green-500/10 border-green-500/20 text-green-400";
      case "pending": return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
      case "hidden": return "bg-gray-500/10 border-gray-500/20 text-gray-400";
      case "flagged": return "bg-red-500/10 border-red-500/20 text-red-400";
      default: return "bg-gray-500/10 border-gray-500/20 text-gray-400";
    }
  };

  const handleStatusChange = (postId: string, newStatus: PostStatus, reason?: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, status: newStatus }
        : post
    ));
    
    toast({
      title: "Post Status Updated",
      description: `Post ${newStatus}${reason ? ` - ${reason}` : ''}`,
    });
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
    
    toast({
      title: "Post Deleted",
      description: "The post has been permanently removed",
      variant: "destructive"
    });
  };

  const handleBanUser = (userId: string, userName: string) => {
    // In a real app, this would call an API to ban the user
    toast({
      title: "User Banned",
      description: `${userName} has been banned from the community`,
      variant: "destructive"
    });
  };

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === "published").length,
    pending: posts.filter(p => p.status === "pending").length,
    flagged: posts.filter(p => p.status === "flagged" || p.reports > 0).length,
    totalReports: posts.reduce((sum, p) => sum + p.reports, 0)
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
          <Settings className="h-5 w-5" />
          Community Moderation
        </CardTitle>
        <CardDescription>
          Moderate community posts, manage content, and maintain platform safety
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Posts</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
              <div className="text-sm text-muted-foreground">Published</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.flagged}</div>
              <div className="text-sm text-muted-foreground">Flagged</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.totalReports}</div>
              <div className="text-sm text-muted-foreground">Reports</div>
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
              <SelectItem value="all">All Posts</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div key={post.id} className={cn(
              "group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 bg-background/50",
              post.status === "flagged" && "border-red-500/50 bg-red-500/5",
              post.reports > 0 && "border-orange-500/50 bg-orange-500/5"
            )}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.userAvatar}
                      alt={post.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{post.userName}</span>
                        {post.isVerified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                        <Badge variant="outline" className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                        {post.reports > 0 && (
                          <Badge variant="outline" className="bg-red-500/10 border-red-500/20 text-red-400">
                            {post.reports} reports
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-foreground mb-2">{post.content}</p>
                  
                  {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {post.hashtags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Hash className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {post.mentions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {post.mentions.map((mention) => (
                        <Badge key={mention} variant="outline" className="text-xs text-blue-600">
                          @{mention}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                    <span>{post.shares} shares</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {post.status === "published" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(post.id, "hidden", "Hidden by admin")}
                      >
                        <EyeOff className="h-4 w-4 mr-1" />
                        Hide
                      </Button>
                    )}
                    
                    {post.status === "hidden" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(post.id, "published", "Restored by admin")}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Show
                      </Button>
                    )}
                    
                    {post.status === "flagged" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(post.id, "published", "Approved by admin")}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    )}
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Ban className="h-4 w-4 mr-1" />
                          Ban User
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Ban User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to ban {post.userName}? This action will prevent them from posting in the community.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleBanUser(post.userId, post.userName)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Ban User
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePost(post.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Post
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
