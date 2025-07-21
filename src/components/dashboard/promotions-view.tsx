
"use client";

import * as React from "react";
import { getPromotions, type Promotion } from "@/lib/promotions";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Current Promotions
            </h1>
            <p className="mt-3 text-lg text-muted-foreground sm:mt-4">
                Check out the latest offers and events from the AstralCore team.
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
                    title="Exclusive Tier Rewards"
                    description="Unlock new rewards as you climb the VIP tiers."
                    data-ai-hint="digital art"
                />
                <GalleryItem 
                    imageUrl="https://cdn.dribbble.com/userupload/42761901/file/original-be28570edb00fadcbd4adb574a8aac5d.png?resize=1024x768&vertical=center" 
                    title="Squad Goals Challenge"
                    description="Invite friends and earn together to win the monthly squad challenge."
                    data-ai-hint="futuristic city"
                />
                <GalleryItem 
                    imageUrl="https://cdn.dribbble.com/userupload/16578759/file/original-22d4b6fd5cf661342470f433ea9e9656.png?resize=1024x1024&vertical=center" 
                    title="Referral Rush"
                    description="Get double referral bonuses for a limited time."
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
