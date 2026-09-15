'use client';

import { usePathname } from "next/navigation";
import Logo from "@/components/myComponents/Logo";
import Link from "next/link";
import { Search } from "lucide-react";

const pageTitles: Record<string, string> = {
    "/": "Feeds",
    "/messages": "Messages",
    "/notifications": "Notifications",
    "/profile": "Profile",
    "/settings": "Settings",
};

export default function LayoutHeader() {
    const pathName = usePathname();

    const pageTitle =
        pageTitles[pathName] ||
        pathName.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ||
        "Dashboard";

    const showDesktopHeader = pathName === "/";
    const showMobileHeader =
        pathName === "/" ||
        pathName === "/messages" ||
        pathName === "/notifications" ||
        pathName === "/settings";

    if (!showDesktopHeader && !showMobileHeader) return null;

    return (
        <>
            {showDesktopHeader && (
                <h1 className="border-b h-15 shrink-0 hidden sm:flex items-center p-4 pl-5">
                    {pageTitle}
                </h1>
            )}
            {showMobileHeader && (
                <h1 className="border-b h-15 shrink-0 sm:hidden flex items-center px-5 justify-between w-full">
                    <Logo myClassName="flex" />
                    <Link href="/mobileSearch" className=""><Search className="h-6 w-6 p-1 hover:bg-muted transition-all duration-300"/></Link>
                </h1>
            )}
        </>
    );
}