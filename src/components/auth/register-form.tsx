"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2, Eye, EyeOff, UserPlus, Globe, Phone, Shield, Sparkles, Gift, ArrowRight, Check, Star, Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { registerSchema } from "@/lib/validators";
import { AstralLogo } from "../icons/astral-logo";
import { register } from "@/lib/auth";
import { countries } from "@/lib/countries";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const MALDIVES_COUNTRY = countries.find(c => c.code === "MV")!;
type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      contactNumber: "",
      country: MALDIVES_COUNTRY.name,
      agreeToTerms: false,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);

    const { error } = await register(values);

    if (error) {
      toast({
        title: "Registration Failed",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome to AstralCore!",
        description: "Your account has been created successfully.",
      });

      // Auto-login after successful registration
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('loggedInEmail', values.email);
      }
      router.push('/dashboard');
    }

    setIsLoading(false);
  };

  const features = [
    { icon: Shield, text: "Bank-level security" },
    { icon: Star, text: "94.7% success rate" },
    { icon: Gift, text: "$10 welcome bonus" },
  ];

  return (
    <div className="relative w-full mobile-container">
      {/* Floating background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-4 left-4 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-4 right-4 w-16 h-16 bg-green-500/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl animate-float" />
      </div>

      <Card className="mobile-card shadow-2xl shadow-purple-500/10 overflow-hidden">
        <CardHeader className="text-center space-y-6 pb-8 safe-top">
          {/* Logo with enhanced animations */}
          <div className="relative mx-auto floating-element">
            <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl animate-pulse-glow" />
            <AstralLogo className="relative mx-auto h-16 w-16 sm:h-20 sm:w-20 animate-float" />
          </div>
          
          {/* Title and branding */}
          <div className="space-y-3">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              <Gift className="h-3 w-3 mr-1" />
              $10 Welcome Bonus
            </Badge>
            
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Join AstralCore
            </CardTitle>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Start Your Trading Journey</span>
              <Sparkles className="h-4 w-4" />
            </div>
            
            <CardDescription className="text-base leading-relaxed">
              Create your account and get instant access to quantum trading
            </CardDescription>
          </div>

          {/* Feature highlights */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <feature.icon className="h-4 w-4 text-primary" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 mobile-padding">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-semibold flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input 
                          placeholder="Choose a unique username" 
                          className="input-modern text-base h-14 pl-6 pr-6"
                          {...field} 
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-semibold flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input 
                          placeholder="your@email.com" 
                          type="email"
                          className="input-modern text-base h-14 pl-6 pr-6"
                          {...field} 
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone and Country Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input 
                            placeholder="+1234567890" 
                            className="input-modern text-base h-14 pl-6 pr-6"
                            {...field} 
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Country
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="input-modern text-base h-14 pl-6 pr-6">
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.name}>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{country.flag}</span>
                                <span>{country.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Create password" 
                            className="input-modern text-base h-14 pl-6 pr-14"
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-foreground transition-colors rounded-xl"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </Button>
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Confirm password" 
                            className="input-modern text-base h-14 pl-6 pr-14"
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-foreground transition-colors rounded-xl"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </Button>
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Terms and Conditions */}
              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-base font-normal cursor-pointer">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        By creating an account, you agree to our terms and conditions
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {/* Create Account Button */}
              <Button
                type="submit"
                className="w-full h-14 btn-primary text-lg font-semibold mt-8 haptic-medium"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
                <UserPlus className="mr-3 h-5 w-5" />
                {isLoading ? "Creating Account..." : "Create Account"}
                {!isLoading && <ArrowRight className="ml-3 h-5 w-5" />}
              </Button>
            </form>
          </Form>

          {/* Benefits Section */}
          <div className="space-y-4 pt-6 border-t border-border/50">
            <div className="text-sm text-center text-muted-foreground font-medium">What you get:</div>
            <div className="space-y-3">
              {[
                "Instant $10 welcome bonus",
                "Access to AI trading bot with 94.7% success rate",
                "Real-time market analytics and insights",
                "24/7 customer support",
                "Bank-level security and encryption"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-500" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-6 pt-6 safe-bottom">
          {/* Sign In Link */}
          <div className="text-center text-base">
            <span className="text-muted-foreground">Already have an account? </span>
            <Button variant="link" asChild className="p-0 h-auto font-semibold text-primary hover:text-primary/80 text-base">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
          
          {/* Security Notice */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-primary/5 rounded-2xl p-4">
            <div className="h-px bg-border flex-1" />
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Your data is protected by military-grade encryption</span>
            </div>
            <div className="h-px bg-border flex-1" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
