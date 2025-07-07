
import * as React from "react";
import { cn } from "@/lib/utils";

export const ProfileIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-5 w-5", className)} {...props}>
        <defs>
            <linearGradient id="c-profile" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
        </defs>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="url(#c-profile)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="url(#c-profile)" fillOpacity="0.1" />
        <circle cx="12" cy="7" r="4" stroke="url(#c-profile)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="url(#c-profile)" fillOpacity="0.2" />
    </svg>
);
