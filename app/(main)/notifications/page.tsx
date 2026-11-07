'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { AtSign, FileText, Heart, MessageSquare } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";

export type NotificationType = "follow" | "comment" | "mention" | "like" | "post";

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

interface NotificationRecord {
  id: string;
  type: NotificationType;
  read: boolean;
  created_at: string;
  actor:
    | {
        full_name: string | null;
        username: string;
        avatar_url: string | null;
      }
    | {
        full_name: string | null;
        username: string;
        avatar_url: string | null;
      }[]
    | null;
}

const notificationActionText: Record<NotificationType, string> = {
  follow: "started following you",
  comment: "commented on your post",
  mention: "mentioned you in a post",
  like: "liked your post",
  post: "shared a new post",
};

const formatNotificationTime = (createdAt: string) => {
  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000)
  );

  if (elapsedSeconds < 60) return "just now";
  if (elapsedSeconds < 3600) return `${Math.floor(elapsedSeconds / 60)}m ago`;
  if (elapsedSeconds < 86400) return `${Math.floor(elapsedSeconds / 3600)}h ago`;
  if (elapsedSeconds < 604800) return `${Math.floor(elapsedSeconds / 86400)}d ago`;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(createdAt));
};

const mapNotification = (record: NotificationRecord): NotificationItem => {
  const actor = Array.isArray(record.actor) ? record.actor[0] : record.actor;
  const name = actor?.full_name || actor?.username || "Echo user";

  return {
    id: record.id,
    type: record.type,
    user: {
      name,
      initials: name.slice(0, 2).toUpperCase(),
      avatar: actor?.avatar_url ?? undefined,
    },
    actionText: notificationActionText[record.type],
    time: formatNotificationTime(record.created_at),
    isUnread: !record.read,
    followingState: false,
  };
};

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
      );
    case "mention":
      return (
        <div className="border roundwd-sm flex justify-center tems-center p-1 text-sm text-muted-foreground">
          <AtSign height={15} width={15} />
        </div>
      );
    case "like":
      return (
        <div className="border roundwd-sm flex justify-center tems-center p-1 text-sm text-muted-foreground">
          <Heart height={15} width={15} />
        </div>
      );
    case "comment":
      return (
        <div className="border roundwd-sm flex justify-center tems-center p-1 text-sm text-muted-foreground">
          <MessageSquare height={15} width={15} />
        </div>
      );
    case "post":
      return (
        <div className="border roundwd-sm flex justify-center tems-center p-1 text-sm text-muted-foreground">
          <FileText height={15} width={15} />
        </div>
      );
    default:
      return null;
  }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [userId, setUserId] = useState<string | null>(null);
  const layoutId = useId();

  useEffect(() => {
    let isMounted = true;
    const supabase = createSupabaseBrowserClient();

    const loadNotifications = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        if (userError) console.error("Unable to load notification user:", userError);
        return;
      }

      const { data, error } = await supabase
        .from("notifications")
        .select(
          "id, type, read, created_at, actor:profiles!notifications_actor_id_fkey(full_name, username, avatar_url)"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Unable to load notifications:", error);
        return;
      }

      if (isMounted) {
        setUserId(user.id);
        setNotifications((data as NotificationRecord[]).map(mapNotification));
      }
    };

    void loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const filterdNotifications = notifications.filter((item) => {
    switch (activeFilter) {
      case "mentions":
        return item.type === "mention";
      case "unreaded":
        return item.isUnread;
      default:
        return true;
    }
  });

  const toggleFollow = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, followingState: !item.followingState }
          : item
      )
    );
  };

  const markAllAsRead = async () => {
    if (!userId || !notifications.some((item) => item.isUnread)) return;

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (error) {
      console.error("Unable to mark notifications as read:", error);
      return;
    }

    setNotifications((prev) =>
      prev.map((item) => ({ ...item, isUnread: false }))
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
            <button onClick={() => void markAllAsRead()} className="text-xs text-muted-foreground transition-all duration-300 hover:bg-muted p-1 rounded-xs">
              Mark all as read
            </button>
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
                      className="absolute inset-0 bg-foreground rounded-xl z-0"
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
              {filterdNotifications.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">
                  There are no notifications yet.
                </div>
              ) : (
                filterdNotifications.map((item) => (
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
                      <Avatar className="h-8 w-8">
                        {item.user.avatar ? <AvatarImage src={item.user.avatar} /> : null}
                        <AvatarFallback>{item.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-col text-sm">
                        <div className="flex gap-1 items-center">
                          <span>{item.user.name}</span>
                          <span className="text-muted-foreground text-xs">{item.actionText}</span>
                        </div>
                        {item.commentOrSnippet ? (
                          <div className="text-xs text-muted-foreground">{item.commentOrSnippet}</div>
                        ) : null}
                        <div className="text-xs text-muted-foreground text-[11px] font-light">{item.time}</div>
                      </div>
                    </div>
                    <ReturnedElement item={item} onToggleFollow={toggleFollow} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;