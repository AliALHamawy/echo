"use client"
import { MessageCircle, Heart, LucideIcon } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react";
interface NotificationItem {
    id: number;
    ico?: LucideIcon;
    heading?: string;
    description: string;
    now: boolean;
}

const data: NotificationItem[] = [
    { id: 1, ico: MessageCircle, heading: "Ines Marchetti", description: "Ready for the launch call?", now: true },
    { id: 2, ico: Heart, heading: "Kai Lund", description: "liked your post about slow interfaces", now: true },
    { id: 3, description: "Ines is typing…", now: false }
]

const dotVariants = {
    initial: { opacity: 0.3, y: 0 },
    animate: { opacity: 1, y: -2 }
}

const AuthRightMid = () => {
    const [items, setItems] = useState<NotificationItem[]>(data)

    useEffect(() => {
        const interval = setInterval(() => {
            setItems((prev) => {
                const lastItem = prev[prev.length - 1]
                const remainingItems = prev.slice(0, prev.length - 1)
                return [lastItem, ...remainingItems]
            })
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <div className="flex flex-col items-start gap-4">
                <h1 className="text-4xl font-semibold text-primary">Connect, Share, and Chat in Real-time</h1>
                <p className="text-md text-muted-foreground text-sm">A quieter social space — your feed, your circles, your conversations.</p>
                <div className="flex flex-col w-full mt-4 gap-2 ">
                    <AnimatePresence mode="popLayout">
                        {items.map((item) => {
                            const IconComponent = item.ico;
                            return (
                                <motion.div className="flex flex-row gap-2 border border-border rounded-none p-3 items-start w-full justify-between" key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 350,
                                        damping: 25,
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        {IconComponent ?
                                            <span className="flex size-8 shrink-0 place-items-center p-2 rounded-full bg-muted">
                                                <IconComponent />
                                            </span>
                                            :
                                            <div className="flex flex-row items-center gap-1">
                                                {[0, 1, 2].map((index) => (
                                                    <motion.span
                                                        key={index}
                                                        className="h-1.5 w-1.5 rounded-full bg-primary"
                                                        variants={dotVariants}
                                                        initial="initial"
                                                        animate="animate"
                                                        transition={{
                                                            duration: 0.5,
                                                            repeat: Infinity,
                                                            repeatType: "reverse",
                                                            ease: "easeInOut",
                                                            delay: index * 0.15 // تأخير كل نقطة لإعطاء تأثير الموجة
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        }
                                        <div className="flex flex-col items-start justify-center">
                                            {item.heading && <span className="text-sm text-primary">
                                                {item.heading}
                                            </span>}
                                            <span className="text-xs text-muted-foreground">
                                                {item.description}
                                            </span>
                                        </div>
                                    </div>
                                    {item.now === true && <span className="text-xs text-muted-foreground">{item.now}</span>}
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </>
    )
}

export default AuthRightMid