
"use client";

import * as React from "react";
import { getPromotions, type Promotion } from "@/lib/promotions";
import { Gift } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { GalleryItem } from "./gallery-item";

export function PromotionsView() {
    const [promotions, setPromotions] = React.useState<Promotion[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const data = await getPromotions();
            setPromotions(data.filter(p => p.status !== 'Expired'));
            setIsLoading(false);
        }
        fetchData();
    }, []);

  return (
     <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Current Promotions
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Check out our latest events and special offers to maximize your earnings.
            </p>
        </div>

        {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3] w-full rounded-lg" />)}
            </div>
        ) : promotions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotions.map((item) => (
                    <GalleryItem 
                        key={item.id} 
                        imageUrl={item.image_url!} 
                        title={item.title}
                        description={item.description}
                    />
                ))}
                 {/* Adding the other images from the user's example */}
                 <GalleryItem 
                    imageUrl="https://cdn.dribbble.com/userupload/20812023/file/original-f847da681530f812dd38e256eff7bfc9.png?resize=1024x768&vertical=center" 
                    title="Digital Universe"
                    description="Explore new dimensions."
                    data-ai-hint="digital art"
                />
                <GalleryItem 
                    imageUrl="https://cdn.dribbble.com/userupload/42761901/file/original-be28570edb00fadcbd4adb574a8aac5d.png?resize=1024x768&vertical=center" 
                    title="Cybernetic Dreams"
                    description="The future is now."
                    data-ai-hint="futuristic city"
                />
                <GalleryItem 
                    imageUrl="https://cdn.dribbble.com/userupload/16578759/file/original-22d4b6fd5cf661342470f433ea9e9656.png?resize=1024x1024&vertical=center" 
                    title="Cosmic Wonders"
                    description="A journey through space."
                    data-ai-hint="space illustration"
                />
            </div>
        ) : (
            <div className="col-span-full flex h-64 flex-col items-center justify-center rounded-md border border-dashed text-center">
                <Gift className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 font-medium text-muted-foreground">No active promotions right now.</p>
                <p className="text-sm text-muted-foreground">Please check back later for special events and offers!</p>
            </div>
        )}
     </div>
  );
}
