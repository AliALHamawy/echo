'use client';

import { Bell, House, MessageSquare, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { id: 1, title: "Messages", href: "/messages", icon: MessageSquare },
    { id: 2, title: "Profile", href: "/profile", icon: User },
    { id: 3, title: "Feeds", href: "/", icon: House },
    { id: 4, title: "Notifications", href: "/notifications", icon: Bell },
    { id: 5, title: "Settings", href: "/settings", icon: Settings },
];

const allowedRoutes = ["/", "/profile", "/settings", "/messages", "/notifications"];
const rainbowClass = "stroke-[url(#rainbow-gradient)] drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]";

const MobileNav = () => {
    const pathname = usePathname(); 

    // إخفاء المكون إذا كان المسار غير مدرج بالقائمة
    if (!allowedRoutes.includes(pathname)) return null;

    return (
        <div className="flex sm:hidden fixed h-15 w-[90%] bg-accent items-center justify-center rounded-4xl bottom-5 left-[50%] -translate-x-[50%] border border-border shadow-lg z-50">
            <svg width="0" height="0" className="absolute">
                <defs>
                    <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff4d4d">
                            <animate attributeName="stop-color" values="#ff4d4d; #a855f7; #3b82f6; #22c55e; #eab308; #ff4d4d" dur="4s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="25%" stopColor="#a855f7">
                            <animate attributeName="stop-color" values="#a855f7; #3b82f6; #22c55e; #eab308; #ff4d4d; #a855f7" dur="4s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="50%" stopColor="#3b82f6">
                            <animate attributeName="stop-color" values="#3b82f6; #22c55e; #eab308; #ff4d4d; #a855f7; #3b82f6" dur="4s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="75%" stopColor="#22c55e">
                            <animate attributeName="stop-color" values="#22c55e; #eab308; #ff4d4d; #a855f7; #3b82f6; #22c55e" dur="4s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="100%" stopColor="#eab308">
                            <animate attributeName="stop-color" values="#eab308; #ff4d4d; #a855f7; #3b82f6; #22c55e; #eab308" dur="4s" repeatCount="indefinite" />
                        </stop>
                    </linearGradient>
                </defs>
            </svg>

            <ul className="flex justify-between items-center w-full px-6">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <li key={item.id}>
                            <Link href={item.href} className="p-2 flex items-center justify-center">
                                <Icon 
                                    className={isActive ? rainbowClass : "text-muted-foreground hover:text-foreground transition-colors"} 
                                    height={25} 
                                    width={25} 
                                />
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default MobileNav;