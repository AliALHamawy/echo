import React from "react";
import { cn } from "@/lib/utils";

interface EchoIconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
}

export default function EchoIcon({ className, ...props }: EchoIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("size-5 text-foreground", className)}
            aria-hidden="true"
            {...props}
        >
            {/* النقطة المركزية */}
            <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />

            {/* القوس الأول (الداخلي) */}
            <path d="M12 7a5 5 0 0 1 0 10" />

            {/* القوس الثاني (الخارجي) */}
            <path d="M12 3a9 9 0 0 1 0 18" />
        </svg>
    );
}