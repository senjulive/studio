
"use client";

import * as React from "react";
import Image from "next/image";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
  } from "@/components/ui/table";
import { type GenericAsset } from "../market-view";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number, decimals = 2) =>
    `$${value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;

export function TopCoinsCard({ assets, isLoading }: { assets: GenericAsset[], isLoading: boolean }) {

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-5 w-5"/>
            Top 10 Coins
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <Table>
            <TableBody>
            {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            <Skeleton className="h-4 w-12 ml-auto" />
                        </TableCell>
                    </TableRow>
                ))
            ) : (
                assets.map(asset => (
                    <TableRow key={asset.id}>
                        <TableCell className="p-2">
                            <div className="flex items-center gap-2">
                                <Image src={asset.iconUrl} alt={asset.name} width={24} height={24} className="rounded-full" />
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{asset.name}</span>
                                    <span className="text-xs text-muted-foreground">{asset.ticker}</span>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-right p-2">
                             <div className="flex flex-col items-end">
                                <span className="font-mono text-sm">{formatCurrency(asset.price, asset.price < 1 ? 4 : 2)}</span>
                                <span className={cn("text-xs", asset.change24h >= 0 ? "text-green-600" : "text-red-600")}>
                                    {asset.change24h.toFixed(2)}%
                                </span>
                             </div>
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
