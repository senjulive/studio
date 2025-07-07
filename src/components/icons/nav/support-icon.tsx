
import * as React from "react";
import { cn } from "@/lib/utils";

export const SupportIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-5 w-5", className)} {...props}>
        <defs>
            <linearGradient id="c-support" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
        </defs>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="url(#c-support)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="url(#c-support)" fillOpacity="0.15" />
    </svg>
);
