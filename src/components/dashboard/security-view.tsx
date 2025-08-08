"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import { getUserRank } from "@/lib/ranks";
import { cn } from "@/lib/utils";
import { 
  KeyRound, 
  Loader2, 
  Save, 
  Shield, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  Smartphone,
  Eye,
  EyeOff,
  Fingerprint,
  Key,
  Settings,
  Brain,
  AlertCircle
} from "lucide-react";

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

const withdrawalPasscodeSchema = z.object({
    currentPassword: z.string().min(1, "Your account password is required."),
    newPasscode: z.string().regex(/^\d{4,6}$/, "Passcode must be 4-6 digits."),
    confirmPasscode: z.string(),
}).refine(data => data.newPasscode === data.confirmPasscode, {
    message: "Passcodes do not match.",
    path: ["confirmPasscode"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;
type PasscodeFormValues = z.infer<typeof withdrawalPasscodeSchema>;

export function SecurityView() {
  const { toast } = useToast();
  const { user } = useUser();
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSavingPassword, setIsSavingPassword] = React.useState(false);
  const [isSavingPasscode, setIsSavingPasscode] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("password");
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);

  React.useEffect(() => {
    if (user?.id) {
      getOrCreateWallet(user.id).then((walletData) => {
        setWallet(walletData);
        setIsLoading(false);
      });
    }
  }, [user]);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });
  
  const passcodeForm = useForm<PasscodeFormValues>({
      resolver: zodResolver(withdrawalPasscodeSchema),
      defaultValues: { currentPassword: "", newPasscode: "", confirmPasscode: "" },
  });

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setIsSavingPassword(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Password change request:", values);
    setIsSavingPassword(false);
    toast({
      title: "Password Updated",
      description: "Your account password has been changed successfully.",
    });
    passwordForm.reset();
  };
  
  const onPasscodeSubmit = async (values: PasscodeFormValues) => {
      setIsSavingPasscode(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Passcode change request:", values);
      setIsSavingPasscode(false);
      toast({
        title: "Withdrawal Passcode Set",
        description: "Your new passcode is now active.",
      });
      passcodeForm.reset();
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
                <div className="absolute inset-0 bg-red-400/30 rounded-full blur-lg animate-neural-pulse"></div>
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 relative border-2 border-red-400/40 backdrop-blur-xl">
                  <AvatarImage
                    src={wallet?.profile?.avatarUrl}
                    alt={wallet?.profile?.username || 'User'}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-red-500/30 to-orange-500/20 text-red-400 font-bold text-lg backdrop-blur-xl">
                    {wallet?.profile?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <Shield className="h-6 w-6 text-red-400" />
                    Security Center
                  </h1>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  Secure your AstralCore account and protect your assets
                </p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge className="flex items-center gap-1 text-xs bg-red-500/20 text-red-300 border-red-400/40">
                    <Lock className="h-3 w-3" />
                    Security Management
                  </Badge>
                  <Badge variant="outline" className="text-xs border-green-400/40 text-green-300 bg-green-400/10">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Protected
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Security Status Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-green-400/20 rounded-lg blur-sm"></div>
              <div className="relative bg-gradient-to-br from-green-500/20 to-green-600/10 p-2 rounded-lg border border-green-400/30">
                <CheckCircle className="h-5 w-5 mx-auto text-green-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-white">Password</p>
            <p className="text-xs text-green-400">Secure</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-sm"></div>
              <div className="relative bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-2 rounded-lg border border-blue-400/30">
                <Smartphone className="h-5 w-5 mx-auto text-blue-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-white">2FA</p>
            <p className="text-xs text-blue-400">Enabled</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-lg blur-sm"></div>
              <div className="relative bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 p-2 rounded-lg border border-yellow-400/30">
                <Key className="h-5 w-5 mx-auto text-yellow-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-white">Withdrawal</p>
            <p className="text-xs text-yellow-400">Set Passcode</p>
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
            <p className="text-xs font-medium text-white">Hyperdrive</p>
            <p className="text-xs text-purple-400">Protected</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardContent className="p-0">
          <div className="flex border-b border-border/40">
            <button
              onClick={() => setActiveTab("password")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === "password"
                  ? "text-red-400 bg-red-500/10"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <KeyRound className="h-4 w-4" />
                Password
              </div>
              {activeTab === "password" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-400"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("passcode")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === "passcode"
                  ? "text-orange-400 bg-orange-500/10"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <Shield className="h-4 w-4" />
                Withdrawal Passcode
              </div>
              {activeTab === "passcode" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === "settings"
                  ? "text-blue-400 bg-blue-500/10"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <Settings className="h-4 w-4" />
                Security Settings
              </div>
              {activeTab === "settings" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"></div>
              )}
            </button>
          </div>

          <div className="p-6">
            {activeTab === "password" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Change Account Password</h3>
                  <p className="text-sm text-gray-400">
                    For your security, we recommend choosing a strong, unique password.
                  </p>
                </div>

                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <FormField 
                      control={passwordForm.control} 
                      name="currentPassword" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-red-400" />
                            Current Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showCurrentPassword ? "text" : "password"} 
                                placeholder="Enter your current password" 
                                {...field} 
                                className="bg-black/20 border-border/40 backdrop-blur-xl pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                {showCurrentPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} 
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField 
                        control={passwordForm.control} 
                        name="newPassword" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <KeyRound className="h-4 w-4 text-red-400" />
                              New Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showNewPassword ? "text" : "password"} 
                                  placeholder="Enter new password" 
                                  {...field} 
                                  className="bg-black/20 border-border/40 backdrop-blur-xl pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                  {showNewPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                      <FormField 
                        control={passwordForm.control} 
                        name="confirmPassword" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-red-400" />
                              Confirm New Password
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Confirm new password" 
                                {...field} 
                                className="bg-black/20 border-border/40 backdrop-blur-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                    </div>

                    <div className="flex justify-center">
                      <Button 
                        type="submit" 
                        disabled={isSavingPassword}
                        className="w-full sm:w-auto min-w-48 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700"
                      >
                        {isSavingPassword ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        {isSavingPassword ? "Updating..." : "Update Password"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}

            {activeTab === "passcode" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Withdrawal Passcode</h3>
                  <p className="text-sm text-gray-400">
                    Set a separate 4-6 digit passcode for an extra layer of security when withdrawing funds.
                  </p>
                </div>

                <Form {...passcodeForm}>
                  <form onSubmit={passcodeForm.handleSubmit(onPasscodeSubmit)} className="space-y-6">
                    <FormField 
                      control={passcodeForm.control} 
                      name="currentPassword" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-orange-400" />
                            Current Account Password
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter your login password" 
                              {...field} 
                              className="bg-black/20 border-border/40 backdrop-blur-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} 
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField 
                        control={passcodeForm.control} 
                        name="newPasscode" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Key className="h-4 w-4 text-orange-400" />
                              New 4-6 Digit Passcode
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                maxLength={6} 
                                placeholder="Enter new passcode" 
                                {...field} 
                                className="bg-black/20 border-border/40 backdrop-blur-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                      <FormField 
                        control={passcodeForm.control} 
                        name="confirmPasscode" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-orange-400" />
                              Confirm New Passcode
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                maxLength={6} 
                                placeholder="Confirm new passcode" 
                                {...field} 
                                className="bg-black/20 border-border/40 backdrop-blur-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                    </div>

                    <div className="flex justify-center">
                      <Button 
                        type="submit" 
                        disabled={isSavingPasscode}
                        className="w-full sm:w-auto min-w-48 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                      >
                        {isSavingPasscode ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        {isSavingPasscode ? "Setting..." : "Set Passcode"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Security Settings</h3>
                  <p className="text-sm text-gray-400">
                    Additional security options and account protection features
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-black/20 backdrop-blur-xl border-border/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-white flex items-center gap-2">
                        <Fingerprint className="h-4 w-4 text-blue-400" />
                        Two-Factor Authentication
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">SMS Authentication</span>
                        <Badge className="bg-green-500/20 text-green-300 border-green-400/40">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">App Authentication</span>
                        <Badge className="bg-gray-500/20 text-gray-300 border-gray-400/40">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Not Set
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Configure 2FA
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/20 backdrop-blur-xl border-border/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-white flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        Security Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Login Notifications</span>
                        <Badge className="bg-green-500/20 text-green-300 border-green-400/40">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Enabled
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Withdrawal Alerts</span>
                        <Badge className="bg-green-500/20 text-green-300 border-green-400/40">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Enabled
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Manage Alerts
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-black/20 backdrop-blur-xl border-border/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-white flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-400" />
                      AstralCore Hyperdrive Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-400">
                      Your AstralCore account benefits from quantum-enhanced security protocols and neural network threat detection.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-400">256-bit</div>
                        <div className="text-xs text-gray-400">Encryption</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">24/7</div>
                        <div className="text-xs text-gray-400">Monitoring</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">99.9%</div>
                        <div className="text-xs text-gray-400">Uptime</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
