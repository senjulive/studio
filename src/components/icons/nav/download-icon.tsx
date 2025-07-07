
import * as React from "react";
import { cn } from "@/lib/utils";

export const DownloadIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-5 w-5", className)} {...props}>
        <defs>
            <linearGradient id="c-download" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
        </defs>
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="url(#c-download)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <polyline points="7 10 12 15 17 10" stroke="url(#c-download)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <line x1="12" y1="15" x2="12" y2="3" stroke="url(#c-download)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);
