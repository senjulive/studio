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
import { register } from "@/lib/auth";
import { countries } from "@/lib/countries";

type RegisterFormValues = z.infer<typeof registerSchema>;

const MALDIVES_COUNTRY = countries.find(c => c.code === 'MV')!;

export function RegisterForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

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
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      });
      
      router.push('/login');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Choose a username"
                  className="h-12 bg-background border-border focus:border-primary transition-colors"
                  {...field}
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
              <FormLabel className="text-sm font-medium text-foreground">Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  className="h-12 bg-background border-border focus:border-primary transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="h-12 bg-background border-border focus:border-primary transition-colors pr-12"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
              <FormLabel className="text-sm font-medium text-foreground">Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="h-12 bg-background border-border focus:border-primary transition-colors pr-12"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">Country</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 bg-background border-border focus:border-primary">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center space-x-2">
                          <span>{country.flag}</span>
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

          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">Phone</FormLabel>
                <FormControl>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-muted border border-r-0 border-border rounded-l-md">
                      <span className="text-sm text-muted-foreground">
                        {selectedCountry.dial_code}
                      </span>
                    </div>
                    <Input
                      placeholder="Phone number"
                      className="h-12 bg-background border-border border-l-0 rounded-l-none focus:border-primary transition-colors"
                      {...field}
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
              <FormLabel className="text-sm font-medium text-foreground">Referral Code (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter referral code if you have one"
                  className="h-12 bg-background border-border focus:border-primary transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 transition-colors"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
}
