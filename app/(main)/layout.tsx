'use client';

import Account from "@/components/myComponents/Account";
import FollowingCard from "@/components/myComponents/FollowingCard";
import Logo from "@/components/myComponents/Logo";
import MobileNav from "@/components/myComponents/MobileNav";
import Navigations from "@/components/myComponents/Navigations";
import { SearchBar } from "@/components/myComponents/SearchBar";
import TrendingCard from "@/components/myComponents/TrendingCard";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { usePathname } from "next/navigation";
import Link from "next/link";

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

    const pathName = usePathname();

    const pageTitle = pageTitles[pathName] || pathName.split("/").filter(Boolean).pop()?.replace(/-/g, " ") || "Dashboard";
    
    // Check if current route is the home page
    const isHomePage = pathName === "/";

    return (
        <>
            <SmoothCursor />
            <div className="flex w-full max-w-350 mx-auto sm:h-screen overflow-hidden">
                <MobileNav />
                <aside className="hidden sm:flex flex-col justify-between py-5 px-2 md:px-4 w-16 md:w-64 shrink-0 border-e border-border transition-all duration-300 sticky">
                    <div className="flex flex-col gap-8 w-full items-center md:items-start">
                        <Logo />
                        <Navigations />
                    </div>
                    <div className="w-full flex justify-center md:justify-start">
                        <Account />
                    </div>
                </aside>
                <main className="flex-1 flex flex-col overflow-y-auto min-w-0 no-scrollbar">
                    <h1 className="border-b h-15 hidden sm:flex items-center p-4 pl-5 ">{pageTitle}</h1>
                    <h1 className="border-b h-15 sm:hidden flex items-center pl-5"><Logo myClassName="flex" /></h1>
                    {children}
                </main>
                
                {isHomePage && (
                    <aside className="hidden xl:flex flex-col w-72 shrink-0 p-5 border-s border-border overflow-y-auto no-scrollbar">
                        <div className="flex flex-col justify-start w-full gap-4">
                            <SearchBar />
                            <FollowingCard />
                            <TrendingCard />
                            <span className="text-muted-foreground text-[12px]">Echo · <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link> · <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link> · © 2026</span>
                        </div>
                    </aside>
                )}
            </div>
        </>
    );
}