
import * as React from "react";
import { cn } from "@/lib/utils";

export const LogoutIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-5 w-5", className)} {...props}>
        <defs>
            <linearGradient id="c-logout" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
        </defs>
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="url(#c-logout)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <polyline points="16 17 21 12 16 7" stroke="url(#c-logout)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <line x1="21" y1="12" x2="9" y2="12" stroke="url(#c-logout)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
);
