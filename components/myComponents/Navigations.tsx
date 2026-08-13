'use client';
import Link from 'next/link';
import { Bell, House, MessageSquare, Settings, User, Sun, Moon } from "lucide-react"
import { twMerge } from 'tailwind-merge';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
    { id: 1, title: "Feeds", href: "/", icon: House },
    { id: 2, title: "Messages", href: "/messages", icon: MessageSquare },
    { id: 3, title: "Notifications", href: "/notifications", icon: Bell },
    { id: 4, title: "Profile", href: "/profile", icon: User },
    { id: 5, title: "Settings", href: "/settings", icon: Settings },
    // { id: 6, title: "Sun", href: "/settings", icon: Sun },
];

const Navigations = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains("dark") ||
            localStorage.getItem("theme") === "dark";

        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            setIsDark(true);
        }
    }, []);
    
    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDark(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDark(true);
        }
    };
    const pathname = usePathname();
    return (
        <>
            <ul className="navContainer flex flex-col gap-1 font-medium text-muted-foreground text-sm w-fit sm:w-full">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        item.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.href);
                    return (

                        <Link href={item.href} className={twMerge("flex px-3 py-2 gap-2 rounded-sm items-center text-muted-foreground transition-all hover:bg-muted hover:text-accent-foreground  sm:w-full", isActive && 'bg-muted text-accent-foreground')} key={item.id}>
                            <Icon height={18} width={18} />
                            <p className='hidden md:flex'>
                            {item.title}
                            </p>
                        </Link>
                    )
                })}
                <li className="flex px-3 py-2 gap-2 rounded-sm items-center text-muted-foreground transition-all hover:bg-muted hover:text-accent-foreground  sm:w-full" onClick={toggleTheme}>
                            {isDark ? (
                        <>
                            <Sun height={18} width={18} />
                            <p className='hidden md:flex'>Light Mode</p>
                        </>
                    ) : (
                        <>
                            <Moon height={18} width={18} />
                            <p className='hidden md:flex'>Dark Mode</p>
                        </>
                    )}
                        </li>
            </ul>
        </>
    )
}

export default Navigations