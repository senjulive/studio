
import * as React from "react";
import { cn } from "@/lib/utils";

export const MarketIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-5 w-5", className)} {...props}>
        <defs>
            <linearGradient id="c-market" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
        </defs>
        <path d="M3 3v18h18" stroke="url(#c-market)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M7 12l5-5 5 5" stroke="url(#c-market)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
);
