'use client';

import * as React from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/hooks/use-toast';
import {Skeleton} from '@/components/ui/skeleton';
import {
  Loader2,
  PlusCircle,
  Gift,
  Image as ImageIcon,
  Trash2,
  Edit,
} from 'lucide-react';
import Image from 'next/image';
import {useAdmin} from '@/contexts/AdminContext';
import {type Promotion} from '@/lib/promotions';
import {createClient} from '@/lib/supabase/client';
import {Badge} from '@/components/ui/badge';

const promotionSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long.'),
  status: z.enum(['Upcoming', 'Active', 'Expired']),
  image: z.instanceof(File).optional(),
});

type PromotionFormValues = z.infer<typeof promotionSchema>;

export function PromotionManager() {
  const {toast} = useToast();
  const {adminPassword} = useAdmin();
  const [promotions, setPromotions] = React.useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingPromotion, setEditingPromotion] =
    React.useState<Promotion | null>(null);

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
  });

  const fetchPromotions = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/promotions/all');
      if (!response.ok) throw new Error('Failed to fetch promotions.');
      const data = await response.json();
      setPromotions(
        data.sort(
          (a: Promotion, b: Promotion) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
    } catch (error: any) {
      toast({title: 'Error', description: error.message, variant: 'destructive'});
      setPromotions([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleOpenDialog = (promo: Promotion | null = null) => {
    setEditingPromotion(promo);
    form.reset({
      title: promo?.title || '',
      description: promo?.description || '',
      status: promo?.status || 'Upcoming',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (promotionId: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;

    try {
      const response = await fetch(`/api/admin/promotions`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({adminPassword, promotionId}),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete promotion');
      }
      toast({
        title: 'Promotion Deleted',
        description: 'The promotion has been successfully removed.',
      });
      await fetchPromotions();
    } catch (error: any) {
      toast({title: 'Error', description: error.message, variant: 'destructive'});
    }
  };

  const onSubmit = async (values: PromotionFormValues) => {
    if (!adminPassword) {
      toast({
        title: 'Auth Error',
        description: 'Admin password not found.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);

    try {
      let imageUrl = editingPromotion?.image_url || undefined;
      const supabase = createClient();

      if (values.image) {
        const file = values.image;
        const filePath = `promotions/${Date.now()}_${file.name}`;
        const {data, error: uploadError} = await supabase.storage
          .from('verifications') // Reusing verifications bucket for simplicity
          .upload(filePath, file);

        if (uploadError)
          throw new Error(`Image upload failed: ${uploadError.message}`);

        const {
          data: {publicUrl},
        } = supabase.storage.from('verifications').getPublicUrl(data.path);
        imageUrl = publicUrl;
      }

      const endpoint = editingPromotion
        ? `/api/admin/promotions?id=${editingPromotion.id}`
        : '/api/admin/promotions';
      const method = editingPromotion ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          adminPassword,
          title: values.title,
          description: values.description,
          status: values.status,
          image_url: imageUrl,
        }),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || 'Failed to save promotion.');

      toast({
        title: `Promotion ${editingPromotion ? 'Updated' : 'Created'}`,
        description: 'The promotion has been saved.',
      });
      setIsDialogOpen(false);
      await fetchPromotions();
    } catch (error: any) {
      toast({title: 'Error', description: error.message, variant: 'destructive'});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Promotion Management</CardTitle>
          <CardDescription>
            Create and manage promotions visible to all users.
          </CardDescription>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Promotion
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({length: 3}).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-10 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-20 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : promotions.length > 0 ? (
              promotions.map(promo => (
                <TableRow key={promo.id}>
                  <TableCell>
                    {promo.image_url ? (
                      <Image
                        src={promo.image_url}
                        alt={promo.title}
                        width={64}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-10 w-16 bg-muted rounded-md flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{promo.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        promo.status === 'Active'
                          ? 'default'
                          : promo.status === 'Upcoming'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {promo.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(promo)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(promo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Gift className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  No promotions created yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Summer Trading Bonus" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the promotion..."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Set status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Upcoming">Upcoming</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({field: {onChange, value, ...rest}}) => (
                  <FormItem>
                    <FormLabel>Image (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={e => onChange(e.target.files?.[0])}
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Promotion
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
