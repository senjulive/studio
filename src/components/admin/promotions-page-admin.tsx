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
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Calendar,
  Users,
  Target,
  TrendingUp,
  Gift,
  Percent,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

type PromotionStatus = "active" | "scheduled" | "expired" | "draft";

type Promotion = {
  id: string;
  title: string;
  description: string;
  type: "deposit_bonus" | "trading_bonus" | "referral_bonus" | "cashback";
  value: number;
  valueType: "percentage" | "fixed";
  minAmount?: number;
  maxAmount?: number;
  startDate: string;
  endDate: string;
  status: PromotionStatus;
  targetAudience: "all" | "new_users" | "vip" | "specific_tier";
  usageCount: number;
  maxUsage?: number;
  createdBy: string;
  createdAt: string;
};

const mockPromotions: Promotion[] = [
  {
    id: "promo_001",
    title: "Welcome Bonus",
    description: "Get 20% bonus on your first deposit up to $500",
    type: "deposit_bonus",
    value: 20,
    valueType: "percentage",
    minAmount: 100,
    maxAmount: 500,
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-12-31T23:59:59Z",
    status: "active",
    targetAudience: "new_users",
    usageCount: 234,
    maxUsage: 1000,
    createdBy: "Admin Team",
    createdAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "promo_002",
    title: "VIP Trading Bonus",
    description: "Exclusive 5% trading bonus for VIP members",
    type: "trading_bonus",
    value: 5,
    valueType: "percentage",
    startDate: "2024-01-15T00:00:00Z",
    endDate: "2024-02-15T23:59:59Z",
    status: "active",
    targetAudience: "vip",
    usageCount: 45,
    maxUsage: 100,
    createdBy: "VIP Manager",
    createdAt: "2024-01-10T14:30:00Z"
  },
  {
    id: "promo_003",
    title: "Valentine's Special",
    description: "$50 cashback for deposits over $1000",
    type: "cashback",
    value: 50,
    valueType: "fixed",
    minAmount: 1000,
    startDate: "2024-02-10T00:00:00Z",
    endDate: "2024-02-20T23:59:59Z",
    status: "scheduled",
    targetAudience: "all",
    usageCount: 0,
    maxUsage: 500,
    createdBy: "Marketing Team",
    createdAt: "2024-01-20T09:15:00Z"
  }
];

export function PromotionsPageAdmin() {
  const { toast } = useToast();
  const [promotions, setPromotions] = React.useState<Promotion[]>(mockPromotions);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [editingPromotion, setEditingPromotion] = React.useState<Promotion | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [newPromotion, setNewPromotion] = React.useState<Partial<Promotion>>({
    title: "",
    description: "",
    type: "deposit_bonus",
    value: 0,
    valueType: "percentage",
    targetAudience: "all",
    status: "draft"
  });

  const filteredPromotions = promotions.filter(promotion => {
    if (filterStatus === "all") return true;
    return promotion.status === filterStatus;
  });

  const getStatusColor = (status: PromotionStatus) => {
    switch (status) {
      case "active": return "bg-green-500/10 border-green-500/20 text-green-400";
      case "scheduled": return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      case "expired": return "bg-red-500/10 border-red-500/20 text-red-400";
      case "draft": return "bg-gray-500/10 border-gray-500/20 text-gray-400";
      default: return "bg-gray-500/10 border-gray-500/20 text-gray-400";
    }
  };

  const getTypeIcon = (type: Promotion['type']) => {
    switch (type) {
      case "deposit_bonus": return DollarSign;
      case "trading_bonus": return TrendingUp;
      case "referral_bonus": return Users;
      case "cashback": return Gift;
      default: return Gift;
    }
  };

  const handleCreatePromotion = () => {
    const promotion: Promotion = {
      id: `promo_${Date.now()}`,
      title: newPromotion.title || "",
      description: newPromotion.description || "",
      type: newPromotion.type || "deposit_bonus",
      value: newPromotion.value || 0,
      valueType: newPromotion.valueType || "percentage",
      minAmount: newPromotion.minAmount,
      maxAmount: newPromotion.maxAmount,
      startDate: newPromotion.startDate || new Date().toISOString(),
      endDate: newPromotion.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: newPromotion.status || "draft",
      targetAudience: newPromotion.targetAudience || "all",
      usageCount: 0,
      maxUsage: newPromotion.maxUsage,
      createdBy: "Admin",
      createdAt: new Date().toISOString()
    };

    setPromotions(prev => [promotion, ...prev]);
    setNewPromotion({
      title: "",
      description: "",
      type: "deposit_bonus",
      value: 0,
      valueType: "percentage",
      targetAudience: "all",
      status: "draft"
    });
    setIsCreateDialogOpen(false);

    toast({
      title: "Promotion Created",
      description: "New promotion has been created successfully",
    });
  };

  const handleUpdateStatus = (promotionId: string, newStatus: PromotionStatus) => {
    setPromotions(prev => prev.map(promotion => 
      promotion.id === promotionId 
        ? { ...promotion, status: newStatus }
        : promotion
    ));
    
    toast({
      title: "Status Updated",
      description: `Promotion status changed to ${newStatus}`,
    });
  };

  const handleDeletePromotion = (promotionId: string) => {
    setPromotions(prev => prev.filter(promotion => promotion.id !== promotionId));
    
    toast({
      title: "Promotion Deleted",
      description: "Promotion has been permanently removed",
      variant: "destructive"
    });
  };

  const isPromotionActive = (promotion: Promotion) => {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);
    return promotion.status === "active" && now >= start && now <= end;
  };

  const stats = {
    total: promotions.length,
    active: promotions.filter(p => p.status === "active").length,
    scheduled: promotions.filter(p => p.status === "scheduled").length,
    totalUsage: promotions.reduce((sum, p) => sum + p.usageCount, 0),
    totalValue: promotions.filter(p => p.status === "active").reduce((sum, p) => sum + (p.usageCount * p.value), 0)
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-orange-500/5 to-red-500/5 border-orange-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
          <Settings className="h-5 w-5" />
          Promotions Management
        </CardTitle>
        <CardDescription>
          Create, manage, and track promotional campaigns and bonuses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Promos</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.scheduled}</div>
              <div className="text-sm text-muted-foreground">Scheduled</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalUsage}</div>
              <div className="text-sm text-muted-foreground">Total Usage</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">${stats.totalValue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Promotion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Promotion</DialogTitle>
                <DialogDescription>
                  Set up a new promotional campaign for users
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      placeholder="Promotion title"
                      value={newPromotion.title}
                      onChange={(e) => setNewPromotion(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select 
                      value={newPromotion.type} 
                      onValueChange={(value) => setNewPromotion(prev => ({ ...prev, type: value as Promotion['type'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deposit_bonus">Deposit Bonus</SelectItem>
                        <SelectItem value="trading_bonus">Trading Bonus</SelectItem>
                        <SelectItem value="referral_bonus">Referral Bonus</SelectItem>
                        <SelectItem value="cashback">Cashback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Promotion description"
                    value={newPromotion.description}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-4 grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Value</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newPromotion.value}
                      onChange={(e) => setNewPromotion(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Value Type</label>
                    <Select 
                      value={newPromotion.valueType} 
                      onValueChange={(value) => setNewPromotion(prev => ({ ...prev, valueType: value as "percentage" | "fixed" }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Audience</label>
                    <Select 
                      value={newPromotion.targetAudience} 
                      onValueChange={(value) => setNewPromotion(prev => ({ ...prev, targetAudience: value as Promotion['targetAudience'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="new_users">New Users</SelectItem>
                        <SelectItem value="vip">VIP Users</SelectItem>
                        <SelectItem value="specific_tier">Specific Tier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePromotion} disabled={!newPromotion.title || !newPromotion.description}>
                  Create Promotion
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Promotions List */}
        <div className="space-y-4">
          {filteredPromotions.map((promotion) => {
            const TypeIcon = getTypeIcon(promotion.type);
            const isCurrentlyActive = isPromotionActive(promotion);
            
            return (
              <div key={promotion.id} className={cn(
                "group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 bg-background/50",
                isCurrentlyActive && "border-green-500/50 bg-green-500/5"
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20">
                          <TypeIcon className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{promotion.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={getStatusColor(promotion.status)}>
                              {promotion.status}
                            </Badge>
                            <Badge variant="outline">
                              {promotion.type.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline">
                              {promotion.valueType === "percentage" ? `${promotion.value}%` : `$${promotion.value}`}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{promotion.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{promotion.usageCount} used</span>
                          {promotion.maxUsage && <span>/ {promotion.maxUsage} max</span>}
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          <span>{promotion.targetAudience.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Created by {promotion.createdBy} on {new Date(promotion.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Select 
                        value={promotion.status} 
                        onValueChange={(value) => handleUpdateStatus(promotion.id, value as PromotionStatus)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePromotion(promotion.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
