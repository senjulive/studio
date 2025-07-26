
"use client";

import * as React from "react";
import { Gauge, Zap, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type FearGreedData = {
  value: string;
  value_classification: string;
  timestamp: string;
};

export function FearGreedGauge({ data, isLoading }: { data: FearGreedData | null, isLoading: boolean }) {
  const value = data ? parseInt(data.value, 10) : 0;
  const classification = data ? data.value_classification : "Loading...";
  
  const getProgressColor = () => {
    if (value <= 25) return "bg-red-600";
    if (value <= 45) return "bg-orange-500";
    if (value <= 55) return "bg-yellow-400";
    if (value <= 75) return "bg-lime-500";
    return "bg-green-500";
  };

  const content = isLoading ? (
    <>
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-full mt-2" />
      <Skeleton className="h-6 w-24 mt-1" />
    </>
  ) : (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Progress
              value={value}
              className="h-4"
              indicatorClassName={getProgressColor()}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Index: {value} / 100
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex justify-between items-baseline mt-2">
        <span className="text-xl font-bold">{classification}</span>
        <span className="text-sm text-muted-foreground">{value}</span>
      </div>
    </>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
            <Gauge className="h-5 w-5" />
            Market Sentiment
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}

    