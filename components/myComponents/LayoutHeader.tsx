'use client';

import { usePathname } from "next/navigation";
import Logo from "@/components/myComponents/Logo";

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
                <h1 className="border-b h-15 shrink-0 sm:hidden flex items-center pl-5">
                    <Logo myClassName="flex" />
                </h1>
            )}
        </>
    );
}