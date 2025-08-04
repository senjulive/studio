'use client';

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Lock, Fingerprint, Eye, EyeOff, Shield, CheckCircle, AlertCircle, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface SecurityAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export function SecurityAuth({ isOpen, onClose, onSuccess, title = "Security Verification", description = "Please verify your identity to proceed" }: SecurityAuthProps) {
  const { toast } = useToast();
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [authMethod, setAuthMethod] = React.useState<"password" | "fingerprint">("password");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [fingerprintSupported, setFingerprintSupported] = React.useState(false);
  const [fingerprintStatus, setFingerprintStatus] = React.useState<"idle" | "scanning" | "success" | "error">("idle");

  React.useEffect(() => {
    // Check if Web Authentication API is supported and has fingerprint capability
    const checkFingerprintSupport = async () => {
      if (typeof window !== 'undefined' && 'PublicKeyCredential' in window) {
        try {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setFingerprintSupported(available);
        } catch (error) {
          console.log("Fingerprint check failed:", error);
          setFingerprintSupported(false);
        }
      }
    };

    checkFingerprintSupport();
  }, []);

  const handlePasswordAuth = async () => {
    if (!password.trim()) {
      toast({
        title: "Password Required",
        description: "Please enter your password to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    // Simulate password verification
    setTimeout(() => {
      // In a real app, this would make an API call to verify the password
      if (password === "123456" || password.length >= 6) { // Demo password validation
        toast({
          title: "Authentication Successful",
          description: "Your identity has been verified.",
        });
        setIsVerifying(false);
        onSuccess();
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid password. Please try again.",
          variant: "destructive"
        });
        setIsVerifying(false);
        setPassword("");
      }
    }, 1500);
  };

  const handleFingerprintAuth = async () => {
    if (!fingerprintSupported) {
      toast({
        title: "Fingerprint Not Available",
        description: "Your device doesn't support fingerprint authentication.",
        variant: "destructive"
      });
      return;
    }

    setFingerprintStatus("scanning");
    setIsVerifying(true);

    try {
      // Create a WebAuthn challenge for fingerprint authentication
      const publicKeyCredentialRequestOptions = {
        challenge: new Uint8Array(32).map(() => Math.random() * 256),
        allowCredentials: [],
        userVerification: "required" as UserVerificationRequirement,
        timeout: 60000
      };

      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      });

      if (credential) {
        setFingerprintStatus("success");
        setTimeout(() => {
          toast({
            title: "Fingerprint Verified",
            description: "Authentication successful using biometric data.",
          });
          setIsVerifying(false);
          onSuccess();
        }, 1000);
      }
    } catch (error: any) {
      setFingerprintStatus("error");
      console.error("Fingerprint authentication failed:", error);
      
      setTimeout(() => {
        let errorMessage = "Fingerprint authentication failed. Please try again.";
        
        if (error.name === "NotAllowedError") {
          errorMessage = "Fingerprint authentication was cancelled or not allowed.";
        } else if (error.name === "InvalidStateError") {
          errorMessage = "Please set up fingerprint authentication on your device first.";
        }

        toast({
          title: "Authentication Failed",
          description: errorMessage,
          variant: "destructive"
        });
        
        setIsVerifying(false);
        setFingerprintStatus("idle");
      }, 1000);
    }
  };

  const resetForm = () => {
    setPassword("");
    setShowPassword(false);
    setIsVerifying(false);
    setFingerprintStatus("idle");
  };

  React.useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Authentication Method Selection */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={authMethod === "password" ? "default" : "outline"}
              onClick={() => setAuthMethod("password")}
              className="flex items-center gap-2"
              disabled={isVerifying}
            >
              <Lock className="h-4 w-4" />
              Password
            </Button>
            <Button
              variant={authMethod === "fingerprint" ? "default" : "outline"}
              onClick={() => setAuthMethod("fingerprint")}
              className="flex items-center gap-2"
              disabled={isVerifying || !fingerprintSupported}
            >
              <Fingerprint className="h-4 w-4" />
              Fingerprint
            </Button>
          </div>

          {/* Fingerprint Support Status */}
          {authMethod === "fingerprint" && !fingerprintSupported && (
            <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <Smartphone className="h-4 w-4 text-yellow-500" />
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Fingerprint authentication is not available on this device
              </p>
            </div>
          )}

          {/* Password Authentication */}
          {authMethod === "password" && (
            <div className="space-y-3">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isVerifying}
                  className="pr-10"
                  onKeyDown={(e) => e.key === "Enter" && handlePasswordAuth()}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isVerifying}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter your account password to verify your identity
              </p>
            </div>
          )}

          {/* Fingerprint Authentication */}
          {authMethod === "fingerprint" && fingerprintSupported && (
            <div className="space-y-4">
              <Card className={cn(
                "border-2 transition-all duration-300",
                fingerprintStatus === "scanning" && "border-blue-500 bg-blue-500/5",
                fingerprintStatus === "success" && "border-green-500 bg-green-500/5",
                fingerprintStatus === "error" && "border-red-500 bg-red-500/5"
              )}>
                <CardContent className="p-6 text-center">
                  <div className="space-y-4">
                    <div className={cn(
                      "mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                      fingerprintStatus === "idle" && "bg-primary/10",
                      fingerprintStatus === "scanning" && "bg-blue-500/20 animate-pulse",
                      fingerprintStatus === "success" && "bg-green-500/20",
                      fingerprintStatus === "error" && "bg-red-500/20"
                    )}>
                      {fingerprintStatus === "success" ? (
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      ) : fingerprintStatus === "error" ? (
                        <AlertCircle className="h-8 w-8 text-red-500" />
                      ) : (
                        <Fingerprint className={cn(
                          "h-8 w-8",
                          fingerprintStatus === "scanning" ? "text-blue-500" : "text-primary"
                        )} />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">
                        {fingerprintStatus === "idle" && "Touch Fingerprint Sensor"}
                        {fingerprintStatus === "scanning" && "Scanning..."}
                        {fingerprintStatus === "success" && "Verified!"}
                        {fingerprintStatus === "error" && "Failed"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {fingerprintStatus === "idle" && "Place your finger on the sensor to authenticate"}
                        {fingerprintStatus === "scanning" && "Keep your finger steady on the sensor"}
                        {fingerprintStatus === "success" && "Authentication successful"}
                        {fingerprintStatus === "error" && "Please try again"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security Information */}
          <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <Shield className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Enhanced Security
              </p>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                This additional verification step protects your funds from unauthorized withdrawals.
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isVerifying}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={authMethod === "password" ? handlePasswordAuth : handleFingerprintAuth}
            disabled={isVerifying || (authMethod === "password" && !password.trim()) || (authMethod === "fingerprint" && !fingerprintSupported)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            {isVerifying ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              <>
                {authMethod === "password" ? <Lock className="h-4 w-4 mr-2" /> : <Fingerprint className="h-4 w-4 mr-2" />}
                Authenticate
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
