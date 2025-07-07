"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  addAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  type Announcement,
} from "@/lib/announcements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash2, Megaphone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";

const announcementSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  content: z.string().min(10, "Content must be at least 10 characters long."),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

export function AnnouncementManager() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const fetchAnnouncements = React.useCallback(async () => {
    setIsLoading(true);
    const data = getAnnouncements();
    setAnnouncements(data);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const onSubmit = async (values: AnnouncementFormValues) => {
    setIsSubmitting(true);
    await addAnnouncement(values.title, values.content);
    toast({
      title: "Announcement Published",
      description: "The new announcement is now visible to all users.",
    });
    form.reset();
    await fetchAnnouncements();
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    await deleteAnnouncement(id);
    toast({
      title: "Announcement Deleted",
      description: "The announcement has been removed.",
    });
    await fetchAnnouncements();
    setIsDeleting(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>New Announcement</CardTitle>
            <CardDescription>
              Create and publish a new announcement for all users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., System Maintenance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the announcement..." {...field} rows={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PlusCircle className="mr-2 h-4 w-4" />
                  )}
                  Publish Announcement
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Published Announcements</CardTitle>
            <CardDescription>
              A list of all active announcements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4 pr-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
                ) : announcements.length > 0 ? (
                  announcements.map((ann) => (
                    <Card key={ann.id} className="relative bg-muted/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{ann.title}</CardTitle>
                        <CardDescription>{format(new Date(ann.date), "PPP")}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{ann.content}</p>
                      </CardContent>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={() => handleDelete(ann.id)}
                        disabled={!!isDeleting}
                      >
                        {isDeleting === ann.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </Card>
                  ))
                ) : (
                  <div className="flex h-48 flex-col items-center justify-center rounded-md border border-dashed text-center">
                    <Megaphone className="h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium text-muted-foreground">No announcements published yet.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
