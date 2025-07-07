
import * as React from "react";
import { cn } from "@/lib/utils";

export const SettingsIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-5 w-5", className)} {...props}>
        <defs>
            <linearGradient id="c-settings" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#475569" />
            </linearGradient>
        </defs>
        <path d="M12.22 2h-0.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 010 2l-.15.08a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.38a2 2 0 00-.73-2.73l-.15-.08a2 2 0 010-2l.15-.08a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" stroke="url(#c-settings)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="url(#c-settings)" fillOpacity="0.1"/>
        <circle cx="12" cy="12" r="3" stroke="url(#c-settings)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="url(#c-settings)" fillOpacity="0.2"/>
    </svg>
);
