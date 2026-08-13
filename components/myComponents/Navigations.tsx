import Link from 'next/link';
import { Bell, House, MessageSquare, Settings, User } from "lucide-react"
import { twMerge } from 'tailwind-merge';
import { usePathname } from 'next/navigation';

const navItems = [
    { id: 1, title: "Feeds", href: "/", icon: House },
    { id: 2, title: "Messages", href: "/messages", icon: MessageSquare },
    { id: 3, title: "Notifications", href: "/notifications", icon: Bell },
    { id: 4, title: "Profile", href: "/profile", icon: User },
    { id: 5, title: "Settings", href: "/settings", icon: Settings },
];

const Navigations = () => {
    
    const pathname = usePathname();
    return (
        <>
            <ul className="navContainer flex flex-col gap-1 font-medium text-muted-foreground text-sm w-12 md:w-full">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        item.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.href);
                    return (

                        <Link href={item.href} className={twMerge("flex px-3 py-2 gap-2 rounded-sm items-center text-muted-foreground transition-all hover:bg-muted hover:text-accent-foreground", isActive && 'bg-muted text-accent-foreground')} key={item.id}>
                            <Icon height={18} width={18} />
                            <p className='hidden md:flex'>
                            {item.title}
                            </p>
                        </Link>
                    )
                })}
            </ul>
        </>
    )
}

export default Navigations