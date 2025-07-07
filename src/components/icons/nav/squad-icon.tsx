
import * as React from "react";
import { cn } from "@/lib/utils";

export const SquadIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-5 w-5", className)} {...props}>
        <defs>
            <linearGradient id="c-squad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
        </defs>
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="url(#c-squad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="url(#c-squad)" fillOpacity="0.1" />
        <circle cx="8.5" cy="7" r="4" stroke="url(#c-squad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="url(#c-squad)" fillOpacity="0.2"/>
        <path d="M20 8v6m-3-3h6" stroke="url(#c-squad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);
