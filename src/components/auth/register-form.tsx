"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2, Eye, EyeOff, UserPlus, Globe, Phone, Shield, Sparkles, Gift } from "lucide-react";
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
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "MV",
      contactNumber: "",
      referralCode: "",
    },
  });

  const selectedCountryCode = form.watch("country");
  const selectedCountry = React.useMemo(
    () => countries.find((c) => c.code === selectedCountryCode) || MALDIVES_COUNTRY,
    [selectedCountryCode]
  );

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);

    const countryInfo = countries.find(c => c.code === values.country);
    if (!countryInfo) {
      toast({ title: "Invalid Country", description: "Please select a valid country.", variant: "destructive"});
      setIsLoading(false);
      return;
    }

    const fullContactNumber = `${countryInfo.dial_code}${values.contactNumber}`;

    try {
      const { error } = await register({
        email: values.email,
        password: values.password,
        options: {
            data: {
                username: values.username,
                contact_number: fullContactNumber,
                country: countryInfo.name,
                referral_code: values.referralCode,
            }
        }
      });
      
      if (error) {
        throw new Error(error);
      }
      
      toast({
        title: "Account Created",
        description: "Welcome to the future of trading!",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-8 right-8 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-500" />
        <div className="absolute bottom-8 left-8 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-4 w-16 h-16 bg-primary/15 rounded-full blur-2xl animate-float delay-700" />
      </div>

      <Card className="glass border-primary/20 shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="relative mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-full blur-2xl animate-pulse-glow" />
            <AstralLogo className="relative mx-auto h-16 w-16 animate-float" />
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Join Astral Core
            </CardTitle>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <UserPlus className="h-4 w-4" />
              <span>Create Your Trading Account</span>
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          
          <CardDescription className="text-sm leading-relaxed">
            Begin your journey with next-generation automated trading technology
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Personal Information</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Username</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input 
                              placeholder="your_username" 
                              className="h-11 bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                              {...field} 
                            />
                            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Email</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input 
                              placeholder="your@email.com" 
                              className="h-11 bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                              {...field} 
                            />
                            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Security */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Security Settings</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Password</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Create password" 
                              className="h-11 pr-11 bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                              {...field} 
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
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
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input 
                              type={showConfirmPassword ? "text" : "password"} 
                              placeholder="Confirm password" 
                              className="h-11 pr-11 bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                              {...field} 
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>Contact Details</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60">
                            {countries.map(c => (
                              <SelectItem key={c.code} value={c.code}>
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{c.flag}</span>
                                  <span>{c.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <div className="flex h-11 w-20 items-center justify-center rounded-md border border-primary/30 bg-background/50 px-2 text-sm shrink-0">
                              <span className="text-lg mr-1">{selectedCountry.flag}</span>
                              <span className="text-xs">{selectedCountry.dial_code}</span>
                            </div>
                            <div className="relative group flex-1">
                              <Input
                                placeholder="Phone number"
                                className="h-11 bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                                {...field}
                              />
                              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Referral Code */}
              <FormField
                control={form.control}
                name="referralCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <Gift className="h-4 w-4" />
                      Squad Code (Optional)
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input 
                          placeholder="Enter squad invitation code" 
                          className="h-11 bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                          {...field} 
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </FormControl>
                    <div className="text-xs text-muted-foreground">Join a squad to unlock exclusive benefits</div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold shadow-lg shadow-primary/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isLoading ? "Creating Account..." : "Join Astral Core"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-6">
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button variant="link" asChild className="p-0 h-auto font-semibold text-primary hover:text-primary/80">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="h-px bg-border flex-1" />
            <span>Quantum Secured Registration</span>
            <div className="h-px bg-border flex-1" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
