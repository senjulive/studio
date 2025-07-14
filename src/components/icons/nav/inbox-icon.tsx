
import * as React from "react";
import { cn } from "@/lib/utils";

export const InboxIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-5 w-5", className)} {...props}>
        <defs>
            <linearGradient id="c-inbox" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
        </defs>
        <path d="M22 12h-6l-2 3h-4l-2-3H2" stroke="url(#c-inbox)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" stroke="url(#c-inbox)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="url(#c-inbox)" fillOpacity="0.1"/>
    </svg>
);
