"use client";

import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { pb } from "@/lib/pocketbase";
import {
  buildConversationSummaries,
  fetchInboxMessages,
  formatConversationTime,
  getInitials,
  getUserAvatarUrl,
  messageInvolvesUser,
  type MessageRecord,
} from "@/lib/messages";

export interface Conversation {
  id: string;
  userId: string;
  name: string;
  username?: string;
  initials: string;
  avatarUrl?: string;
  isVerified?: boolean;
  isOnline: boolean;
  time: string;
  lastMessage: string;
  isRead?: boolean;
  unreadCount?: number;
  lastActivity?: number;
  hasThread: boolean;
}

type FilterTab = "All" | "Unreaded" | "Archived";

const Messages = () => {
  const [tab, setTab] = useState<FilterTab>("All");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const loadConversations = useCallback(async () => {
    const currentUser = pb.authStore.record;

    if (!currentUser) {
      setConversations([]);
      setLoading(false);
      return;
    }

    try {
      const [users, messageRecords] = await Promise.all([
        pb.collection("users").getFullList({
          filter: `id != "${currentUser.id}"`,
          sort: "-updated",
          requestKey: null,
        }),
        fetchInboxMessages(currentUser.id).catch(() => [] as MessageRecord[]),
      ]);

      const summaries = buildConversationSummaries(messageRecords, currentUser.id);

      const list = users
        .map((user: any) => {
          const summary = summaries.get(user.id);
          const record = summary?.lastMessage;
          const name = user.name || user.username || "Echo user";

          return {
            id: user.id,
            userId: user.id,
            name,
            username: user.username ? `@${user.username}` : "",
            initials: getInitials(name),
            avatarUrl: getUserAvatarUrl(user),
            isOnline: Boolean(user.isOnline),
            time: record ? formatConversationTime(record.created) : "",
            lastMessage: record?.text || "Start a conversation",
            isRead: !summary || summary.unreadCount === 0,
            unreadCount: summary?.unreadCount ?? 0,
            lastActivity: record ? new Date(record.created).getTime() : 0,
            hasThread: Boolean(summary),
          } as Conversation;
        })
        .sort((a, b) => {
          const aActivity = a.lastActivity ?? 0;
          const bActivity = b.lastActivity ?? 0;
          if (aActivity !== bActivity) {
            return bActivity - aActivity;
          }
          return a.name.localeCompare(b.name);
        });

      setConversations(list);
    } catch {
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    const currentUser = pb.authStore.record;
    if (!currentUser) return;

    let active = true;
    let unsubscribe: (() => void) | null = null;

    void pb.collection("messages").subscribe("*", (event) => {
      const record = event.record as MessageRecord;
      if (!messageInvolvesUser(record, currentUser.id)) return;
      void loadConversations();
    }).then((unsub) => {
      if (active) {
        unsubscribe = unsub;
        return;
      }
      unsub();
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [loadConversations]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredConversations = useMemo(() => {
    let list = conversations;

    if (tab === "Unreaded") {
      list = list.filter((conversation) => (conversation.unreadCount ?? 0) > 0);
    } else if (tab === "Archived") {
      list = [];
    }

    if (!normalizedQuery) return list;

    return list.filter((conversation) => {
      const haystack = `${conversation.name} ${conversation.username ?? ""}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [conversations, normalizedQuery, tab]);

  return (
    <div className="flex flex-col w-full divide-y divide-border">
      <div className="flex justify-between p-4 items-center">
        <span>Messages</span>
        <div className="flex gap-4 items-center">
          <button
            type="button"
            aria-label="Search conversations"
            onClick={() => setShowSearch((previous) => !previous)}
            className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            <Search height={20} width={20} />
          </button>
          <Link
            href="/search"
            className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
            aria-label="Start a conversation"
          >
            <Plus height={24} width={24} />
          </Link>
        </div>
      </div>

      {showSearch && (
        <div className="px-4 pb-4">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name or username"
            className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
          />
        </div>
      )}

      <div>
        <div className="flex rounded-2xl p-4 w-fit bg-background">
          {(["All", "Unreaded", "Archived"] as FilterTab[]).map((myTab) => {
            const isActive = tab === myTab;
            return (
              <button
                key={myTab}
                onClick={() => setTab(myTab)}
                className={twMerge(
                  "relative text-sm px-3 py-1 rounded-xl transition-colors duration-200 capitalize select-none font-medium z-10",
                  isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="relative z-10">{myTab === "All" ? "All" : myTab}</span>

                {isActive && (
                  <motion.div
                    layoutId="messages-active-pill"
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
      </div>

      <div className="flex flex-col gap-0">
        <div className="flex flex-col items-center w-full border border-border divide-y divide-border">
          {loading ? (
            <div className="w-full p-4 text-sm text-muted-foreground">Loading conversations...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="w-full p-4 text-sm text-muted-foreground">
              {tab === "Unreaded" ? "No unread conversations." : "No conversations yet."}
            </div>
          ) : (
            filteredConversations.map((item) => (
              <Link
                href={`/messages/singleMessage?userId=${item.userId}`}
                key={item.id}
                className={twMerge(
                  "flex w-full justify-between p-4 hover:bg-muted/40 transition-colors",
                  (item.unreadCount ?? 0) > 0 && "bg-muted/20"
                )}
              >
                <div className="flex gap-4 items-center min-w-0">
                  <div className="relative shrink-0">
                    <Avatar className="h-8 w-8 flex">
                      <AvatarImage src={item.avatarUrl} />
                      <AvatarFallback>{item.initials}</AvatarFallback>
                    </Avatar>
                    {item.isOnline && <div className="absolute h-2 w-2 rounded-full bg-green-500 right-0 bottom-px" />}
                  </div>
                  <div className="flex-col text-sm min-w-0">
                    <div className="flex gap-1 items-center">
                      <span className={twMerge((item.unreadCount ?? 0) > 0 && "font-semibold")}>{item.name}</span>
                    </div>
                    <div
                      className={twMerge(
                        "text-xs truncate max-w-[14rem] sm:max-w-xs",
                        (item.unreadCount ?? 0) > 0 ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {item.lastMessage}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-end items-end shrink-0">
                  {item.time ? <span className="text-xs text-muted-foreground">{item.time}</span> : null}
                  {(item.unreadCount ?? 0) > 0 && (
                    <span className="w-fit min-w-5 text-center bg-foreground text-background text-xs px-1.5 py-0.5 rounded-2xl">
                      {item.unreadCount}
                    </span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
