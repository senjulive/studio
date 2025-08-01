"use client";

import * as React from "react";
import { format } from "date-fns";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  BookmarkPlus, 
  Send, 
  Image as ImageIcon, 
  Smile, 
  Hash,
  Search,
  TrendingUp,
  Clock,
  Users,
  Eye,
  MoreVertical,
  UserPlus,
  AtSign
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';
import { DiamondRankIcon } from '@/components/icons/ranks/diamond-rank-icon';

const rankIcons: Record<string, React.ElementType> = {
  RecruitRankIcon, BronzeRankIcon, SilverRankIcon, GoldRankIcon, PlatinumRankIcon, DiamondRankIcon,
};

type BlogPost = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRank?: any;
  content: string;
  images?: string[];
  tags: string[];
  timestamp: number;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  isLiked: boolean;
  isBookmarked: boolean;
  mentionedUsers?: string[];
};

type Comment = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: number;
  likes: number;
  isLiked: boolean;
};

const mockPosts: BlogPost[] = [
  {
    id: "1",
    authorId: "user1",
    authorName: "CryptoExplorer",
    authorAvatar: "https://placehold.co/40x40.png",
    content: "Just hit my first major milestone in trading! 🚀 The AI-powered strategies on @AstralCore are incredible. Who else is crushing their goals this month? #TradingSuccess #CryptoGains #AstralCore",
    tags: ["TradingSuccess", "CryptoGains", "AstralCore"],
    timestamp: Date.now() - 3600000,
    likes: 127,
    comments: 23,
    shares: 8,
    views: 456,
    isLiked: false,
    isBookmarked: false,
    mentionedUsers: ["AstralCore"]
  },
  {
    id: "2", 
    authorId: "user2",
    authorName: "DeFiMaster",
    authorAvatar: "https://placehold.co/40x40.png",
    content: "Pro tip: Always diversify your portfolio! I've been using AstralCore's automated rebalancing feature and my returns have been consistently green 📈 What's your strategy? #DeFi #Portfolio #AutoTrading",
    tags: ["DeFi", "Portfolio", "AutoTrading"],
    timestamp: Date.now() - 7200000,
    likes: 89,
    comments: 15,
    shares: 12,
    views: 342,
    isLiked: true,
    isBookmarked: true
  },
  {
    id: "3",
    authorId: "user3", 
    authorName: "BlockchainBabe",
    authorAvatar: "https://placehold.co/40x40.png",
    content: "New to crypto trading? Here are my top 3 beginner tips:\n\n1. Start small and learn the ropes\n2. Use stop-loss orders\n3. Don't let emotions drive your decisions\n\nAstralCore's educational resources helped me so much when I started! 💡 #CryptoTips #BeginnerFriendly",
    tags: ["CryptoTips", "BeginnerFriendly"],
    timestamp: Date.now() - 10800000,
    likes: 234,
    comments: 67,
    shares: 45,
    views: 892,
    isLiked: false,
    isBookmarked: false
  }
];

const trendingTags = [
  "#TradingSuccess", "#CryptoGains", "#DeFi", "#Portfolio", "#AutoTrading", 
  "#CryptoTips", "#BeginnerFriendly", "#AstralCore", "#BlockchainNews", "#TechAnalysis"
];

export function CommunityBlog({ isFloating = false }: { isFloating?: boolean }) {
  const { toast } = useToast();
  const { user, wallet, rank } = useUser();
  const [posts, setPosts] = React.useState<BlogPost[]>(mockPosts);
  const [newPost, setNewPost] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<BlogPost | null>(null);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [newComment, setNewComment] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTag, setSelectedTag] = React.useState("");
  const [showMentions, setShowMentions] = React.useState(false);

  const squadMembers = wallet?.squad?.members || [];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || post.tags.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase()));
    return matchesSearch && matchesTag;
  });

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user?.id || !wallet) return;

    if (!wallet.profile?.displayName && !wallet.profile?.username) {
      toast({ 
        title: "Display Name Required", 
        description: "Please set a display name in your profile before posting.", 
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Extract hashtags and mentions
    const hashtagRegex = /#(\w+)/g;
    const mentionRegex = /@(\w+)/g;
    const tags = [...new Set(Array.from(newPost.matchAll(hashtagRegex), m => m[1]))];
    const mentions = [...new Set(Array.from(newPost.matchAll(mentionRegex), m => m[1]))];

    const post: BlogPost = {
      id: Date.now().toString(),
      authorId: user.id,
      authorName: wallet.profile?.displayName || wallet.profile?.username || "Anonymous",
      authorAvatar: wallet.profile?.avatarUrl,
      authorRank: rank,
      content: newPost,
      tags,
      timestamp: Date.now(),
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      isLiked: false,
      isBookmarked: false,
      mentionedUsers: mentions
    };

    setPosts(prev => [post, ...prev]);
    setNewPost("");
    setIsLoading(false);

    toast({
      title: "Post Published!",
      description: "Your post has been shared with the community.",
    });
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const handleShare = (post: BlogPost) => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.authorName}`,
        text: post.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${post.content}\n\n- ${post.authorName} on AstralCore`);
      toast({
        title: "Copied!",
        description: "Post content copied to clipboard",
      });
    }
  };

  const handleMentionSelect = (username: string) => {
    setNewPost(prev => prev + `@${username} `);
    setShowMentions(false);
  };

  const formatPostContent = (content: string) => {
    // Convert hashtags and mentions to styled spans
    return content
      .split(/(#\w+|@\w+)/)
      .map((part, index) => {
        if (part.startsWith('#')) {
          return (
            <span 
              key={index} 
              className="text-primary hover:text-primary/80 cursor-pointer font-medium"
              onClick={() => setSelectedTag(part.slice(1))}
            >
              {part}
            </span>
          );
        } else if (part.startsWith('@')) {
          return (
            <span key={index} className="text-blue-600 dark:text-blue-400 font-medium">
              {part}
            </span>
          );
        }
        return part;
      });
  };

  const PostCard = ({ post }: { post: BlogPost }) => {
    const RankIcon = post.authorRank ? rankIcons[post.authorRank.Icon] : null;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.authorAvatar} />
                <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{post.authorName}</p>
                  {RankIcon && post.authorRank && (
                    <Badge variant="outline" className={cn("h-5 px-1.5", post.authorRank.className)}>
                      <RankIcon className="h-3 w-3" />
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(post.timestamp), "PPp")}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground whitespace-pre-line">
              {formatPostContent(post.content)}
            </p>
          </div>
          
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {post.tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-xs cursor-pointer hover:bg-primary/10"
                  onClick={() => setSelectedTag(tag)}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(post.id)}
                className={cn("gap-2", post.isLiked && "text-red-500")}
              >
                <Heart className={cn("h-4 w-4", post.isLiked && "fill-current")} />
                {post.likes}
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    {post.comments}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Comments</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {/* Original post */}
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={post.authorAvatar} />
                              <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="font-semibold text-sm">{post.authorName}</p>
                          </div>
                          <p className="text-sm">{formatPostContent(post.content)}</p>
                        </div>
                        
                        {/* Comments would go here */}
                        <div className="text-center text-muted-foreground py-8">
                          <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No comments yet. Be the first to comment!</p>
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                  <DialogFooter className="mt-4">
                    <div className="flex w-full gap-2">
                      <Input
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <Button onClick={() => setNewComment("")}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare(post)}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                {post.shares}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.views}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBookmark(post.id)}
                className={cn(post.isBookmarked && "text-primary")}
              >
                <BookmarkPlus className={cn("h-4 w-4", post.isBookmarked && "fill-current")} />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className={cn("space-y-6", !isFloating && "lg:grid lg:grid-cols-4 lg:gap-6 lg:space-y-0")}>
      {/* Sidebar */}
      {!isFloating && (
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Trending Tags */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {trendingTags.map(tag => (
                  <Button
                    key={tag}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start h-auto p-2 text-left",
                      selectedTag === tag.slice(1) && "bg-primary/10 text-primary"
                    )}
                    onClick={() => setSelectedTag(selectedTag === tag.slice(1) ? "" : tag.slice(1))}
                  >
                    <Hash className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span className="truncate">{tag}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Users */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                Squad Members Online
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {squadMembers.slice(0, 5).map((member: any, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {member.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 bg-green-500 rounded-full border border-background" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {member.username || `User ${index + 1}`}
                    </span>
                  </div>
                ))}
                {squadMembers.length === 0 && (
                  <p className="text-xs text-muted-foreground">No squad members yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Feed */}
      <div className={cn("space-y-6", !isFloating && "lg:col-span-3")}>
        {/* Create Post */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Share with the Community</CardTitle>
            <CardDescription>
              What's on your mind? Share your trading insights, tips, or experiences!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Share your thoughts... Use #hashtags and @mentions to connect with others!"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" disabled>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Image
                  </Button>
                  <Button variant="ghost" size="sm" disabled>
                    <Smile className="h-4 w-4 mr-2" />
                    Emoji
                  </Button>
                  
                  <Popover open={showMentions} onOpenChange={setShowMentions}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <AtSign className="h-4 w-4 mr-2" />
                        Mention
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Squad Members</h4>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {squadMembers.length === 0 ? (
                            <p className="text-xs text-muted-foreground">No squad members found</p>
                          ) : (
                            squadMembers.map((member: any, index) => (
                              <button
                                key={index}
                                onClick={() => handleMentionSelect(member.username || `User${index + 1}`)}
                                className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-accent text-left"
                              >
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {member.username?.[0]?.toUpperCase() || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{member.username || `User ${index + 1}`}</span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <Button 
                  onClick={handleCreatePost}
                  disabled={!newPost.trim() || isLoading}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Publish
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Info */}
        {(selectedTag || searchQuery) && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filtering by:</span>
                {selectedTag && (
                  <Badge variant="secondary" className="gap-1">
                    <Hash className="h-3 w-3" />
                    {selectedTag}
                    <button
                      onClick={() => setSelectedTag("")}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    <Search className="h-3 w-3" />
                    "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedTag 
                    ? "Try adjusting your search or filters" 
                    : "Be the first to share something with the community!"}
                </p>
                {(searchQuery || selectedTag) && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedTag("");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
