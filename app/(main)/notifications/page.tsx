'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AtSign, Heart, MessageSquare } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";
export type NotificationType = "follow" | "comment" | "mention" | "like";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  user: {
    name: string;
    initials: string;
    avatar?: string;
  };
  actionText: string;
  commentOrSnippet?: string;
  time: string;
  isUnread: boolean;
  followingState?: boolean;
}

export const mockNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    type: "follow",
    user: {
      name: "Kai Lund",
      initials: "KL",
    },
    actionText: "started following you",
    time: "2m ago",
    isUnread: true,
    followingState: false,
  },
  {
    id: "notif-2",
    type: "comment",
    user: {
      name: "Ines Marchetti",
      initials: "IM",
    },
    actionText: "commented on your post",
    commentOrSnippet: "The token rewrite reads so much faster now.",
    time: "14m ago",
    isUnread: true,
  },
  {
    id: "notif-3",
    type: "mention",
    user: {
      name: "Ada Vinter",
      initials: "AV",
    },
    actionText: "mentioned you in a post",
    commentOrSnippet: "@jules called this months ago — monochrome wins.",
    time: "1h ago",
    isUnread: true,
  },
  {
    id: "notif-4",
    type: "like",
    user: {
      name: "Ren Okafor",
      initials: "RO",
    },
    actionText: "liked your post",
    commentOrSnippet: "Boring wins are still wins.",
    time: "3h ago",
    isUnread: false,
  },
  {
    id: "notif-5",
    type: "follow",
    user: {
      name: "Tomas Reyes",
      initials: "TR",
    },
    actionText: "started following you",
    time: "6h ago",
    isUnread: false,
    followingState: true,
  },
  {
    id: "notif-6",
    type: "mention",
    user: {
      name: "Noor Halim",
      initials: "NH",
    },
    actionText: "mentioned you in a comment",
    commentOrSnippet: "ask @jules about the hydration profile",
    time: "1d ago",
    isUnread: false,
  },
  {
    id: "notif-7",
    type: "like",
    user: {
      name: "Mira Sol",
      initials: "MS",
    },
    actionText: "liked your comment",
    commentOrSnippet: "Type scale is a product decision.",
    time: "2d ago",
    isUnread: false,
  },
];

interface ReturnedElementProps {
  item: NotificationItem;
  onToggleFollow: (id: string) => void;
}

type FilterTab = "all" | "unreaded" | "mentions";

const ReturnedElement = ({ item, onToggleFollow }: ReturnedElementProps) => {
  switch (item.type) {
    case "follow":
      return (
        <button
          onClick={() => onToggleFollow(item.id)}
          className={twMerge(
            "px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-200 select-none shrink-0",
            item.followingState
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              : "border border-border bg-transparent text-foreground hover:bg-accent"
          )}
        >
          {item.followingState ? "Following" : "Follow"}
        </button>
      )
    case "mention":
      return (
        <div className="border roundwd-sm flex justify-center tems-center p-1 text-sm text-muted-foreground">
          <AtSign height={15} width={15} />
        </div>
      )
    case "like":
      return (
        <div className="border roundwd-sm flex justify-center tems-center p-1 text-sm text-muted-foreground">
          <Heart height={15} width={15} />
        </div>
      )
    case "comment":
      return (
        <div className="border roundwd-sm flex justify-center tems-center p-1 text-sm text-muted-foreground">
          <MessageSquare height={15} width={15} />
        </div>
      )
    default:
      return null;
  }
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all")
  const [isMounted, setIsMounted] = useState(false);

const layoutId = useId();

useEffect(() => {
  setIsMounted(true);
}, []);

  const filterdNotifications = notifications.filter((item) => {
    switch (activeFilter) {
      case "mentions":
        return item.type === "mention"
      case "unreaded":
        return item.isUnread
      default:
        return true
    }
  })

  const toggleFollow = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, followingState: !item.followingState }
          : item
      )
    );
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center py-10 px-4">
        <div className="max-w-168.75 w-full flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-xl font-bold">Notifications</span>
              <span className="text-xs text-muted-foreground">3 unreaded</span>
            </div>
            <button className="text-xs text-muted-foreground transition-all duration-300 hover:bg-muted p-1 rounded-xs">Mark all as read</button>
          </div>
          <div className="flex rounded-2xl p-1 border border-muted w-fit gap-1 bg-background">
            {(["all", "unreaded", "mentions"] as FilterTab[]).map((tab) => {
              const isActive = activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={twMerge(
                    "relative text-sm px-3 py-1 rounded-xl transition-colors duration-200 capitalize select-none font-medium z-10",
                    isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="relative z-10">
                    {tab === "unreaded" ? "Unread" : tab}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId={`active-pill-${layoutId}`}
                      className="absolute inset-0 bg-foreground rounded-xl -z-0"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex flex-col w-full border border-muted divide-y divide-border">
            <AnimatePresence mode="popLayout">
              {filterdNotifications.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={twMerge(
                    "flex flex-row justify-between w-full p-4 items-center",
                    item.isUnread ? "bg-muted/20" : "bg-background"
                  )}
                >
                  <div className="flex flex-row gap-2 items-center">
                    <Avatar className='h-8 w-8'>
                      {item.user.avatar ? <AvatarImage src={item.user.avatar} /> : null}
                      <AvatarFallback>{item.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-col text-sm">
                      <div className="flex gap-1 items-center">
                        <span>{item.user.name}</span>
                        <span className="text-muted-foreground text-xs">{item.actionText}</span>
                      </div>
                      {item.commentOrSnippet ?
                        <div className="text-xs text-muted-foreground">{item.commentOrSnippet}</div> : null
                      }
                      <div className="text-xs text-muted-foreground text-[11px] font-light">{item.time}</div>
                    </div>
                  </div>
                  <ReturnedElement item={item} onToggleFollow={toggleFollow} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}

export default Notifications