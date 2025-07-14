
import * as React from "react";
import { cn } from "@/lib/utils";

export const GoldTierIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-4 w-4", className)} {...props}>
        <defs>
            <linearGradient id="gold-tier-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
        </defs>
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" fill="url(#gold-tier-gradient)" />
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 11.5l1.06 2.16.27.55.6.09 2.38.36-1.72 1.68-.4.39.09.6 1.4 3.96-2.13-1.12-.51-.27-.51.27-2.13 1.12 1.4-3.96.09-.6-.4-.39-1.72-1.68 2.38-.36.6-.09.27-.55L12 11.5z" fill="white" fillOpacity="0.8" />
    </svg>
);
