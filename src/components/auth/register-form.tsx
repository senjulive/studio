"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
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
        description: "Your account has been created successfully. You can now log in.",
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
    <div className="w-full space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 text-sm">Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="your_username" 
                      {...field} 
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50 transition-all duration-200 h-10 text-sm"
                    />
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
                  <FormLabel className="text-white/90 text-sm">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="name@example.com" 
                      {...field} 
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50 transition-all duration-200 h-10 text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 text-sm">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        {...field} 
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50 transition-all duration-200 h-10 text-sm pr-9"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-white/70 hover:text-white hover:bg-white/20"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
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
                  <FormLabel className="text-white/90 text-sm">Confirm</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        {...field} 
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50 transition-all duration-200 h-10 text-sm pr-9"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-white/70 hover:text-white hover:bg-white/20"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 text-sm">Country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white focus:bg-white/30 focus:border-white/50 transition-all duration-200 h-10">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-900/95 border-white/20">
                      {countries.map(c => (
                        <SelectItem key={c.code} value={c.code} className="text-white hover:bg-white/10">
                          <div className="flex items-center gap-2">
                            <span>{c.flag}</span>
                            <span className="text-xs">{c.name}</span>
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
                  <FormLabel className="text-white/90 text-sm">Phone</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      <div className="flex h-10 w-14 items-center justify-center rounded-md border border-white/30 bg-white/20 px-1 text-xs shrink-0 text-white">
                        <span className="mr-1">{selectedCountry.flag}</span>
                        <span className="text-xs">{selectedCountry.dial_code}</span>
                      </div>
                      <Input
                        placeholder="Phone number"
                        {...field}
                        className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50 transition-all duration-200 h-10 text-sm"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="referralCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/90 text-sm">Squad Code (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter squad code" 
                    {...field} 
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50 transition-all duration-200 h-10 text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 h-11 mt-6" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
      </Form>
      
      <div className="text-center text-sm">
        <p className="text-white/70">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-white hover:text-white/80 font-semibold transition-colors duration-200 underline underline-offset-2"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
