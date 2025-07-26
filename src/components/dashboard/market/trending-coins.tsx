
"use client";

import * as React from "react";
import Image from "next/image";
import { Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
  } from "@/components/ui/table";
  
export type TrendingCoin = {
    item: {
        id: string;
        coin_id: number;
        name: string;
        symbol: string;
        market_cap_rank: number;
        thumb: string;
        small: string;
        large: string;
        slug: string;
        score: number;
    }
}

export function TrendingCoins({ coins, isLoading }: { coins: TrendingCoin[], isLoading: boolean }) {

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
            <Flame className="h-5 w-5 text-orange-500"/>
            Trending Coins
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <Table>
            <TableBody>
            {isLoading ? (
                Array.from({ length: 7 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            <Skeleton className="h-4 w-8 ml-auto" />
                        </TableCell>
                    </TableRow>
                ))
            ) : (
                coins.map(coin => (
                    <TableRow key={coin.item.id}>
                        <TableCell className="p-2">
                            <div className="flex items-center gap-2">
                                <Image src={coin.item.small} alt={coin.item.name} width={24} height={24} className="rounded-full" />
                                <span className="font-medium text-sm">{coin.item.name}</span>
                                <span className="text-xs text-muted-foreground">{coin.item.symbol.toUpperCase()}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right p-2 text-sm text-muted-foreground">
                            #{coin.item.market_cap_rank}
                        </TableCell>
                    </TableRow>
                ))
            )}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
