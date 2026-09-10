"use client";

import { motion } from "framer-motion"
import { Plus, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export interface Conversation {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  isVerified?: boolean;
  isOnline: boolean;
  time: string;
  lastMessage: string;
  isRead?: boolean;
  unreadCount?: number; // 🟢 إضافة خاصية عدد الرسائل غير المقروءة
}

export const CONVERSATIONS_DATA: Conversation[] = [
  {
    id: "conv-1",
    name: "Ada Vinter",
    initials: "AV",
    avatarUrl: "",
    isVerified: true,
    isOnline: true,
    time: "2m ago",
    lastMessage: "The token rewrite is on staging — take a look?",
    isRead: false,
    unreadCount: 2,
  },
  {
    id: "conv-2",
    name: "Noor Halim",
    initials: "NH",
    avatarUrl: "",
    isVerified: false,
    isOnline: true,
    time: "24m ago",
    lastMessage: "Deleted half the charts. Nobody noticed. 😌",
    isRead: false,
    unreadCount: 1,
  },
  {
    id: "conv-3",
    name: "Kai Lund",
    initials: "KL",
    avatarUrl: "",
    isVerified: true,
    isOnline: false,
    time: "1h ago",
    lastMessage: "Sent the contract over — signed copy attached.",
    isRead: false,
    unreadCount: 1,
  },
  {
    id: "conv-4",
    name: "Ines Marchetti",
    initials: "IM",
    avatarUrl: "",
    isVerified: false,
    isOnline: false,
    time: "Yesterday",
    lastMessage: "Thanks for the review — merging now.",
    isRead: true,
    unreadCount: 0,
  },
  {
    id: "conv-5",
    name: "Sol Brenner",
    initials: "SB",
    avatarUrl: "",
    isVerified: false,
    isOnline: false,
    time: "2d ago",
    lastMessage: "Let's pick this back up after the launch.",
    isRead: true,
    unreadCount: 0,
  },
];

type FilterTab = "All" | "Unreaded" | "Archived";

const Messages = () => {
  const [tab, setTab] = useState<FilterTab>("All");
  return (
    <>
      <div className="flex flex-col w-full divide-y divide-border">
        <div className="flex justify-between p-4 items-center">
          <span>Messages</span>
          <div className="flex gap-4 items-center">
            <Search height={20} width={20} className="text-muted-foreground transition-colors duration-300 hover:text-foreground" />
            <Plus height={24} width={24} className="text-muted-foreground transition-colors duration-300 hover:text-foreground" />
          </div>
        </div>
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
                  <span className="relative z-10">
                    {myTab === "All" ? "All" : myTab}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId={`settings-active-pill`}
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
            {CONVERSATIONS_DATA.map((item)=> (
            <div className="flex w-full justify-between p-4" key={item.id}>
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Avatar className='h-8 w-8 flex'>
                    <AvatarImage src={item.avatarUrl}/>
                    <AvatarFallback>{item.initials}</AvatarFallback>
                  </Avatar>
                  {item.isOnline && <div className="absolute h-2 w-2 rounded-full bg-green-500 right-0  bottom-px"/>}
                </div>
                <div className="flex-col text-sm">
                  <div className="flex gap-1 items-center">
                    <span>{item.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{item.lastMessage}</div>
                </div>
              </div>
                <div className="flex flex-col gap-1 text-end items-end">
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                  {(!!item.unreadCount && item.unreadCount>0) && <span className="w-fit bg-foreground text-background text-xs px-1 rounded-2xl">{item.unreadCount}</span>}
                </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Messages
