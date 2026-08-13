'use client';

import Account from "@/components/myComponents/Account";
import Logo from "@/components/myComponents/Logo";
import MobileNav from "@/components/myComponents/MobileNav";
import Navigations from "@/components/myComponents/Navigations";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
    "/": "Feeds",
    "/messages": "Messages",
    "/notifications": "Notifications",
    "/profile": "Profile",
    "/settings": "Settings",
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const pathName = usePathname() 

    const pageTitle = pageTitles[pathName] || pathName.split("/").filter(Boolean).pop()?.replace(/-/g, " ")|| "Dashboard";

    return (
        <>
            <SmoothCursor />
            <div className="flex w-full max-w-350 mx-auto sm:min-h-screen overflow-hidden">
                        <MobileNav />
                <aside className="hidden sm:flex flex-col justify-between py-5 px-2 md:px-4 w-16 md:w-64 shrink-0 border-e border-border transition-all duration-300">
                    <div className="flex flex-col gap-8 w-full items-center md:items-start">
                        <Logo />
                        <Navigations />
                    </div>
                    <div className="w-full flex justify-center md:justify-start">
                        <Account />
                    </div>
                </aside>
                <main className="flex-1 flex flex-col overflow-y-auto min-w-0">
                    <div className="border-b h-15 flex items-center pl-5">{pageTitle}</div>
                    {children}
                </main>
                <aside className="hidden xl:flex flex-col w-72 shrink-0 p-5 border-s border-border">
                    <div className="w-full">
                    </div>
                </aside>
            </div>
        </>
    );
}