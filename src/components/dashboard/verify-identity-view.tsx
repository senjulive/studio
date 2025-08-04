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
  CardFooter,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { addNotification } from "@/lib/notifications";
import { useRouter } from "next/navigation";
import { Loader2, Save, ShieldCheck, Upload, X } from "lucide-react";
import Image from "next/image";

const profileSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters.").max(50),
  idCardNo: z.string().regex(/^\d{9,}$/, "ID Card Number must be at least 9 digits and contain only numbers."),
  address: z.string().min(10, "Please enter a full address.").max(100, "Address is too long."),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format. Please use YYYY-MM-DD.",
  }).refine((val) => new Date(val) < new Date() && new Date(val) > new Date("1900-01-01"), {
    message: "Please enter a valid date of birth."
  }),
  idCardFront: z.instanceof(File, { message: "Front of ID card is required." }),
  idCardBack: z.instanceof(File, { message: "Back of ID card is required." }),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

const ImageUploadField = ({
  field,
  label,
  preview,
  clearFn,
}: {
  field: any;
  label: string;
  preview: string | null;
  clearFn: () => void;
}) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert("File is too large. Please select a file smaller than 5MB.");
                return;
            }
            if (!file.type.startsWith('image/')) {
                alert("Invalid file type. Please select an image.");
                return;
            }
            field.onChange(file);
        }
    };
  
    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <div>
                     <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={inputRef}
                        onChange={handleFileChange}
                     />
                    {preview ? (
                        <div className="relative group aspect-video rounded-md border border-dashed flex items-center justify-center overflow-hidden">
                            <Image src={preview} alt="ID preview" layout="fill" objectFit="contain" />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={clearFn}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="w-full aspect-video rounded-md border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                            <Upload className="h-8 w-8 mb-2" />
                            <span className="text-sm font-medium">Click to upload</span>
                            <span className="text-xs">PNG, JPG, or WEBP (max 5MB)</span>
                        </button>
                    )}
                </div>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
};

export function VerifyIdentityView() {
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [frontPreview, setFrontPreview] = React.useState<string | null>(null);
  const [backPreview, setBackPreview] = React.useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      idCardNo: "",
      address: "",
      dateOfBirth: "",
    },
  });

  const frontFile = form.watch("idCardFront");
  const backFile = form.watch("idCardBack");

  React.useEffect(() => {
    if (frontFile) {
      const reader = new FileReader();
      reader.onloadend = () => setFrontPreview(reader.result as string);
      reader.readAsDataURL(frontFile);
    } else {
      setFrontPreview(null);
    }
  }, [frontFile]);

  React.useEffect(() => {
    if (backFile) {
      const reader = new FileReader();
      reader.onloadend = () => setBackPreview(reader.result as string);
      reader.readAsDataURL(backFile);
    } else {
      setBackPreview(null);
    }
  }, [backFile]);


  const onSubmit = async (values: ProfileFormValues) => {
    if (!user?.id) return;
    setIsSubmitting(true);
    
    try {
      // Mock file upload and data persistence
      const idCardFrontUrl = frontPreview; // Using data URL for mock
      const idCardBackUrl = backPreview;

      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          fullName: values.fullName,
          idCardNo: values.idCardNo,
          address: values.address,
          dateOfBirth: new Date(values.dateOfBirth).toISOString(),
          idCardFrontUrl,
          idCardBackUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile.');
      }

      toast({
        title: "Profile Submitted",
        description: "Your information is being verified. This may take a few minutes.",
      });

      await addNotification(user.id, {
        title: "Verification in Progress",
        content: "Your profile information has been submitted for verification.",
        href: "/dashboard/profile"
      });
      
      router.push('/dashboard/profile');

    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary"/>
            <span>KYC / UPDATE</span>
        </CardTitle>
        <CardDescription>
          Please provide your details and upload photos of your ID to complete verification.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name (as on ID)</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter your full legal name" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="idCardNo"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>ID Card Number</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter your national ID number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="YYYY-MM-DD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Residential Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="idCardFront"
                    render={({ field }) => (
                        <ImageUploadField
                            field={field}
                            label="ID Card (Front)"
                            preview={frontPreview}
                            clearFn={() => {
                                form.setValue("idCardFront", undefined as any, { shouldValidate: true });
                            }}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="idCardBack"
                    render={({ field }) => (
                        <ImageUploadField
                            field={field}
                            label="ID Card (Back)"
                            preview={backPreview}
                            clearFn={() => {
                                form.setValue("idCardBack", undefined as any, { shouldValidate: true });
                            }}
                        />
                    )}
                />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Submit for Verification
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
