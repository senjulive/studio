'use client';

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  UserCog, 
  Plus, 
  Edit, 
  Trash2, 
  Shield,
  Check,
  X,
  Users,
  Eye,
  AlertCircle,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";

type ModeratorPermission = 
  | 'chat_moderation'
  | 'support_management' 
  | 'profile_verification'
  | 'promotions_management'
  | 'user_management'
  | 'content_moderation';

type Moderator = {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  permissions: ModeratorPermission[];
  assignedBy: string;
  assignedAt: string;
  lastActive: string;
};

const permissionLabels: Record<ModeratorPermission, string> = {
  chat_moderation: 'Chat Moderation',
  support_management: 'Support Management',
  profile_verification: 'Profile Verification',
  promotions_management: 'Promotions Management',
  user_management: 'User Management',
  content_moderation: 'Content Moderation'
};

const mockModerators: Moderator[] = [
  {
    id: 'mod_001',
    email: 'moderator@astralcore.io',
    username: 'ModeratorUser',
    isActive: true,
    permissions: ['chat_moderation', 'support_management'],
    assignedBy: 'admin@astralcore.io',
    assignedAt: '2024-01-15T10:30:00Z',
    lastActive: '2024-01-20T14:20:00Z'
  },
  {
    id: 'mod_002',
    email: 'mod2@astralcore.io',
    username: 'ContentMod',
    isActive: false,
    permissions: ['content_moderation', 'chat_moderation'],
    assignedBy: 'admin@astralcore.io',
    assignedAt: '2024-01-10T09:15:00Z',
    lastActive: '2024-01-18T11:45:00Z'
  }
];

export function ModeratorManagementAdmin() {
  const { toast } = useToast();
  const [moderators, setModerators] = React.useState<Moderator[]>(mockModerators);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [editingModerator, setEditingModerator] = React.useState<Moderator | null>(null);
  const [newModeratorEmail, setNewModeratorEmail] = React.useState('');
  const [newModeratorPermissions, setNewModeratorPermissions] = React.useState<ModeratorPermission[]>([]);

  // Load and save permissions to localStorage
  React.useEffect(() => {
    const savedPermissions = localStorage.getItem('moderatorPermissions');
    if (savedPermissions) {
      try {
        const permissions = JSON.parse(savedPermissions);
        setModerators(permissions);
      } catch (error) {
        console.error('Failed to load moderator permissions:', error);
      }
    }
  }, []);

  const savePermissions = (updatedModerators: Moderator[]) => {
    localStorage.setItem('moderatorPermissions', JSON.stringify(updatedModerators));
  };

  const handleAddModerator = () => {
    if (!newModeratorEmail || newModeratorPermissions.length === 0) {
      toast({
        title: "Invalid Input",
        description: "Please provide email and at least one permission",
        variant: "destructive"
      });
      return;
    }

    const newModerator: Moderator = {
      id: `mod_${Date.now()}`,
      email: newModeratorEmail,
      username: newModeratorEmail.split('@')[0],
      isActive: true,
      permissions: newModeratorPermissions,
      assignedBy: 'admin@astralcore.io',
      assignedAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    const updatedModerators = [...moderators, newModerator];
    setModerators(updatedModerators);
    savePermissions(updatedModerators);

    setNewModeratorEmail('');
    setNewModeratorPermissions([]);
    setIsAddDialogOpen(false);

    toast({
      title: "Moderator Added",
      description: `${newModeratorEmail} has been added as a moderator`,
    });
  };

  const handleUpdatePermissions = (moderatorId: string, permissions: ModeratorPermission[]) => {
    const updatedModerators = moderators.map(mod => 
      mod.id === moderatorId 
        ? { ...mod, permissions }
        : mod
    );
    setModerators(updatedModerators);
    savePermissions(updatedModerators);

    toast({
      title: "Permissions Updated",
      description: "Moderator permissions have been updated",
    });
  };

  const handleToggleActive = (moderatorId: string) => {
    const updatedModerators = moderators.map(mod => 
      mod.id === moderatorId 
        ? { ...mod, isActive: !mod.isActive }
        : mod
    );
    setModerators(updatedModerators);
    savePermissions(updatedModerators);

    const moderator = moderators.find(m => m.id === moderatorId);
    toast({
      title: moderator?.isActive ? "Moderator Deactivated" : "Moderator Activated",
      description: `${moderator?.email} has been ${moderator?.isActive ? 'deactivated' : 'activated'}`,
    });
  };

  const handleRemoveModerator = (moderatorId: string) => {
    const moderator = moderators.find(m => m.id === moderatorId);
    const updatedModerators = moderators.filter(mod => mod.id !== moderatorId);
    setModerators(updatedModerators);
    savePermissions(updatedModerators);

    toast({
      title: "Moderator Removed",
      description: `${moderator?.email} has been removed from moderators`,
      variant: "destructive"
    });
  };

  const togglePermission = (permission: ModeratorPermission) => {
    setNewModeratorPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const stats = {
    total: moderators.length,
    active: moderators.filter(m => m.isActive).length,
    inactive: moderators.filter(m => !m.isActive).length,
    totalPermissions: moderators.reduce((sum, m) => sum + m.permissions.length, 0)
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
          <Settings className="h-5 w-5" />
          Moderator Management
        </CardTitle>
        <CardDescription>
          Manage moderator permissions and access to admin panels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Moderators</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
              <div className="text-sm text-muted-foreground">Inactive</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalPermissions}</div>
              <div className="text-sm text-muted-foreground">Total Permissions</div>
            </div>
          </div>
        </div>

        {/* Add Moderator Button */}
        <div className="flex justify-end">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Moderator
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Moderator</DialogTitle>
                <DialogDescription>
                  Grant moderator permissions to a user
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    placeholder="moderator@example.com"
                    value={newModeratorEmail}
                    onChange={(e) => setNewModeratorEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Permissions</label>
                  <div className="space-y-2">
                    {Object.entries(permissionLabels).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Switch
                          checked={newModeratorPermissions.includes(key as ModeratorPermission)}
                          onCheckedChange={() => togglePermission(key as ModeratorPermission)}
                        />
                        <label className="text-sm">{label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddModerator} disabled={!newModeratorEmail || newModeratorPermissions.length === 0}>
                  Add Moderator
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Moderators List */}
        <div className="space-y-4">
          {moderators.map((moderator) => (
            <div key={moderator.id} className={cn(
              "group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 bg-background/50",
              !moderator.isActive && "opacity-60"
            )}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                      <UserCog className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{moderator.username}</h4>
                        <Badge variant={moderator.isActive ? "default" : "secondary"}>
                          {moderator.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{moderator.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Last active: {new Date(moderator.lastActive).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {moderator.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        {permissionLabels[permission]}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Assigned by {moderator.assignedBy} on {new Date(moderator.assignedAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Permissions
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Permissions</DialogTitle>
                          <DialogDescription>
                            Update permissions for {moderator.email}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                          {Object.entries(permissionLabels).map(([key, label]) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Switch
                                checked={moderator.permissions.includes(key as ModeratorPermission)}
                                onCheckedChange={(checked) => {
                                  const newPermissions = checked
                                    ? [...moderator.permissions, key as ModeratorPermission]
                                    : moderator.permissions.filter(p => p !== key);
                                  handleUpdatePermissions(moderator.id, newPermissions);
                                }}
                              />
                              <label className="text-sm">{label}</label>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(moderator.id)}
                    >
                      {moderator.isActive ? (
                        <>
                          <X className="h-4 w-4 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Moderator</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {moderator.email} from moderators? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveModerator(moderator.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Remove Moderator
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {moderators.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Moderators</h3>
              <p className="text-muted-foreground">Add moderators to help manage the platform</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
