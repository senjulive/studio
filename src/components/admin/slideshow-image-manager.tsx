'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Image, Eye, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SlideshowImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
}

export function SlideshowImageManager() {
  const { toast } = useToast();
  const [images, setImages] = React.useState<SlideshowImage[]>([]);
  const [newImageUrl, setNewImageUrl] = React.useState('');
  const [newImageTitle, setNewImageTitle] = React.useState('');
  const [newImageDescription, setNewImageDescription] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  // Load images on component mount
  React.useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const response = await fetch('/api/admin/slideshow-images', {
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Failed to load images:', error);
    }
  };

  const saveImages = async (updatedImages: SlideshowImage[]) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/slideshow-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: updatedImages }),
      });

      if (response.ok) {
        setImages(updatedImages);
        toast({
          title: 'Images Updated',
          description: 'Slideshow images have been updated successfully.',
        });
      } else {
        throw new Error('Failed to update images');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update slideshow images.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addImage = async () => {
    if (!newImageUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an image URL.',
        variant: 'destructive',
      });
      return;
    }

    const newImage: SlideshowImage = {
      id: `img-${Date.now()}`,
      url: newImageUrl.trim(),
      title: newImageTitle.trim() || undefined,
      description: newImageDescription.trim() || undefined,
    };

    const updatedImages = [...images, newImage];
    await saveImages(updatedImages);

    // Reset form
    setNewImageUrl('');
    setNewImageTitle('');
    setNewImageDescription('');
  };

  const removeImage = async (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    await saveImages(updatedImages);
  };

  const moveImage = async (imageId: string, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex(img => img.id === imageId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const updatedImages = [...images];
    [updatedImages[currentIndex], updatedImages[newIndex]] = [updatedImages[newIndex], updatedImages[currentIndex]];
    
    await saveImages(updatedImages);
  };

  const isValidImageUrl = (url: string) => {
    try {
      new URL(url);
      return url.match(/\.(jpeg|jpg|gif|png|webp)$/i) || url.includes('cdn.builder.io');
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Welcome Page Slideshow Manager
          </CardTitle>
          <CardDescription>
            Manage the background images that appear on the welcome page slideshow. 
            These images will cycle automatically every 3.5 seconds.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Image Form */}
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">Add New Image</h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="imageUrl">Image URL *</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
                {newImageUrl && !isValidImageUrl(newImageUrl) && (
                  <p className="text-sm text-destructive mt-1">
                    Please enter a valid image URL
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="imageTitle">Title (Optional)</Label>
                  <Input
                    id="imageTitle"
                    placeholder="Image title"
                    value={newImageTitle}
                    onChange={(e) => setNewImageTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="imageDescription">Description (Optional)</Label>
                  <Input
                    id="imageDescription"
                    placeholder="Image description"
                    value={newImageDescription}
                    onChange={(e) => setNewImageDescription(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={addImage} 
                disabled={!newImageUrl.trim() || !isValidImageUrl(newImageUrl) || isLoading}
                className="w-fit"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>
          </div>

          {/* Current Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Current Slideshow Images</h3>
              <Badge variant="secondary">
                {images.length} image{images.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            {images.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No images in slideshow yet.</p>
                <p className="text-sm">Add your first image above to get started.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {images.map((image, index) => (
                  <Card key={image.id} className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Image Preview */}
                      <div className="flex-shrink-0">
                        <img
                          src={image.url}
                          alt={image.title || `Slideshow image ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-image.png';
                          }}
                        />
                      </div>

                      {/* Image Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          {image.title && (
                            <h4 className="font-medium truncate">{image.title}</h4>
                          )}
                        </div>
                        {image.description && (
                          <p className="text-sm text-muted-foreground mb-2">{image.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground font-mono break-all">
                          {image.url}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(image.url, '_blank')}
                          title="View full image"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveImage(image.id, 'up')}
                            disabled={index === 0}
                            title="Move up"
                          >
                            ↑
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveImage(image.id, 'down')}
                            disabled={index === images.length - 1}
                            title="Move down"
                          >
                            ↓
                          </Button>
                        </div>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Image</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove this image from the slideshow? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => removeImage(image.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Tips */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Tips:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use high-quality images (1920x1080 or higher recommended)</li>
                <li>• Images should be in JPG, PNG, or WebP format</li>
                <li>• Builder.io CDN URLs are automatically supported</li>
                <li>• Images will automatically cycle every 3.5 seconds</li>
                <li>• Drag images up/down to reorder them</li>
                <li>• Changes take effect immediately on the welcome page</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
