
"use client";

import * as React from "react";
import { getPromotions, type Promotion } from "@/lib/promotions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gift } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

function PromotionCard({ promotion }: { promotion: Promotion }) {
    return (
      <Card className="overflow-hidden shadow-lg transition-transform hover:scale-[1.02] hover:shadow-xl">
        {promotion.image_url && (
          <div className="aspect-video relative">
            <Image src={promotion.image_url} alt={promotion.title} layout="fill" objectFit="cover" />
          </div>
        )}
        <CardHeader>
          <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-lg">{promotion.title}</CardTitle>
              <Badge variant={
                promotion.status === 'Active' ? 'default' :
                promotion.status === 'Upcoming' ? 'secondary' :
                'outline'
              }>{promotion.status}</Badge>
          </div>
          <CardDescription>{new Date(promotion.created_at).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{promotion.description}</p>
        </CardContent>
      </Card>
    )
}

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
     <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Gift /> Promotions</CardTitle>
            <CardDescription>Check out the latest offers from the AstralCore team.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 w-full" />)
                ) : promotions.length > 0 ? (
                    promotions.map((item) => <PromotionCard key={item.id} promotion={item} />)
                ) : (
                <div className="col-span-full flex h-64 flex-col items-center justify-center rounded-md border border-dashed text-center">
                    <Gift className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 font-medium text-muted-foreground">No active promotions right now.</p>
                    <p className="text-sm text-muted-foreground">Please check back later for special events and offers!</p>
                </div>
            )}
            </div>
        </CardContent>
     </Card>
  );
}
