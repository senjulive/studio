
"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type GenericAsset } from "../market-view";
import { cn } from "@/lib/utils";

const MoverCard = ({ type, asset, isLoading }: { type: 'Gainer' | 'Loser', asset: GenericAsset | null, isLoading: boolean }) => {
    const isGainer = type === 'Gainer';

    if (isLoading) {
        return (
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                </div>
            </div>
        )
    }

    if (!asset) {
        return <p className="text-sm text-muted-foreground">Data unavailable</p>;
    }
    
    return (
        <div>
            <p className="text-xs text-muted-foreground mb-1">{isGainer ? "Top Gainer" : "Top Loser"}</p>
            <div className="flex items-center gap-2">
                <Image src={asset.iconUrl} alt={asset.name} width={24} height={24} className="rounded-full" />
                <div className="flex-1">
                    <p className="text-sm font-semibold leading-tight">{asset.ticker}</p>
                    <p className={cn(
                        "text-sm font-bold leading-tight",
                        isGainer ? "text-green-600" : "text-red-600"
                    )}>{asset.change24h.toFixed(2)}%</p>
                </div>
            </div>
        </div>
    );
};


export function MarketMovers({ assets, isLoading }: { assets: GenericAsset[], isLoading: boolean }) {
    const { topGainer, topLoser } = React.useMemo(() => {
        if (!assets || assets.length === 0) {
            return { topGainer: null, topLoser: null };
        }
        
        const sortedAssets = [...assets].sort((a, b) => a.change24h - b.change24h);
        
        return {
            topGainer: sortedAssets[sortedAssets.length - 1],
            topLoser: sortedAssets[0]
        };
    }, [assets]);

  return (
     <Card>
        <CardContent className="p-4 grid grid-cols-2 gap-4">
            <MoverCard type="Gainer" asset={topGainer} isLoading={isLoading} />
            <MoverCard type="Loser" asset={topLoser} isLoading={isLoading} />
        </CardContent>
    </Card>
  );
}

    
