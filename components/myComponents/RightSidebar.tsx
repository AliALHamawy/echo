'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { SearchBar } from "@/components/myComponents/SearchBar";
import FollowingCard from "@/components/myComponents/FollowingCard";
import TrendingCard from "@/components/myComponents/TrendingCard";

export default function RightSidebar() {
    const pathname = usePathname();
    const isPage = pathname === "/" || pathname === "/profile";

    if (!isPage) return null;

    return (
        <aside className="hidden xl:flex flex-col w-72 shrink-0 p-5 border-s border-border overflow-y-auto no-scrollbar">
            <div className="flex flex-col justify-start w-full gap-4">
                <SearchBar />
                <FollowingCard />
                <TrendingCard />
                <span className="text-muted-foreground text-[12px]">
                    Echo · <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link> · <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link> · © 2026
                </span>
            </div>
        </aside>
    );
}