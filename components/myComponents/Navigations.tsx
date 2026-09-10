'use client';

import Link from 'next/link';
import { Bell, House, MessageSquare, Settings, User, Sun, Moon } from "lucide-react";
import { twMerge } from 'tailwind-merge';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BlurFade } from '../ui/blur-fade';
import { motion } from 'framer-motion';
import { useAnimatedTheme } from '@/hooks/useAnimatedTheme'; 

const navItems = [
    { id: 1, title: "Feeds", href: "/", icon: House },
    { id: 2, title: "Messages", href: "/messages", icon: MessageSquare },
    { id: 3, title: "Notifications", href: "/notifications", icon: Bell },
    { id: 4, title: "Profile", href: "/profile", icon: User },
    { id: 5, title: "Settings", href: "/settings", icon: Settings },
];

const Navigations = () => {
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const pathname = usePathname();
    
    const { isDark, toggleTheme } = useAnimatedTheme("circle", 450);

    return (
        <ul className="navContainer flex flex-col gap-1 font-medium text-muted-foreground text-sm w-fit sm:w-full" onMouseLeave={() => setHoveredId(null)}>
            {navItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive =
                    item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);
                return (
                    <BlurFade key={item.id} delay={0.05 + idx * 0.05} inView>
                        <Link
                            href={item.href}
                            onMouseEnter={() => setHoveredId(item.id)}
                            className={twMerge(
                                "relative flex px-3 py-2 gap-2 rounded-sm items-center transition-colors duration-200 sm:w-full z-10",
                                isActive ? "text-accent-foreground font-semibold bg-muted" : "text-muted-foreground hover:text-accent-foreground"
                            )}
                        >
                            {hoveredId === item.id && (
                                <motion.div
                                    layoutId="navbar-hover"
                                    className="absolute inset-0 bg-muted rounded-sm -z-10"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}

                            <Icon height={18} width={18} className='cursor-none' />
                            <p className='hidden md:flex'>
                                {item.title}
                            </p>
                        </Link>
                    </BlurFade>
                )
            })}
            
            <BlurFade delay={0.05 + navItems.length * 0.05} inView>
                <li
                    onMouseEnter={() => setHoveredId(99)}
                    className="relative flex px-3 py-2 gap-2 rounded-sm items-center text-muted-foreground transition-colors duration-200 sm:w-full select-none z-10 hover:text-accent-foreground"
                    onClick={(e) => toggleTheme(e)}
                >
                    {hoveredId === 99 && (
                        <motion.div
                            layoutId="navbar-hover"
                            className="absolute inset-0 bg-muted rounded-sm -z-10"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                    )}

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
            </BlurFade>
        </ul>
    );
};

export default Navigations;