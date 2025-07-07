
import * as React from "react";
import { cn } from "@/lib/utils";

export const WithdrawIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-5 w-5", className)} {...props}>
        <defs>
            <linearGradient id="c-withdraw" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" stroke="url(#c-withdraw)" strokeWidth="2" fill="url(#c-withdraw)" fillOpacity="0.1" />
        <path d="M12 16V8m-4 4h8" stroke="url(#c-withdraw)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M8 12h8" stroke="url(#c-withdraw)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);
