import { ChatConversation } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Ban, BellOff, Ellipsis, User, ChevronLeft } from "lucide-react";
import Link from 'next/link';
import MessageHeader from "@/components/myComponents/MessageHeader";
import { MessageGroup } from "@/components/ui/message";

// data/mockChat.ts

export const MOCK_CHAT_DATA: ChatConversation = {
    user: {
        id: "user-ada",
        name: "Ada Vinter",
        username: "@ada_vinter",
        avatarUrl: "", // يمكنك وضع مسار الصورة أو تركها فارغة لتظهر الـ Initials
        initials: "AV",
        isOnline: true,
    },
    messages: [
        {
            date: "Yesterday",
            items: [
                {
                    id: "msg-1",
                    senderId: "other",
                    type: "text",
                    text: "Morning! I pushed the monochrome token set last night.",
                    timestamp: "09:12 AM",
                },
                {
                    id: "msg-2",
                    senderId: "user",
                    type: "text",
                    text: "Nice. Did you keep the accent for destructive only?",
                    timestamp: "09:15 AM",
                    status: "read",
                },
                {
                    id: "msg-3",
                    senderId: "other",
                    type: "code",
                    text: "Yes, here is how the variables look now:",
                    codeSnippet: "--destructive: oklch(0.577 0.245 27.325);\n--accent: var(--muted);",
                    timestamp: "09:16 AM",
                },
            ],
        },
        {
            date: "Today",
            items: [
                {
                    id: "msg-4",
                    senderId: "user",
                    type: "text",
                    text: "That reads so much faster. Ship it.",
                    timestamp: "10:05 AM",
                    status: "read",
                },
                {
                    id: "msg-5",
                    senderId: "other",
                    type: "link",
                    text: "Awesome, preview is updated:",
                    linkData: {
                        url: "https://staging.echo.app",
                        title: "Design tokens — staging preview",
                        description: "Live preview of the rewritten token layer with light and dark themes.",
                    },
                    timestamp: "10:08 AM",
                },
                {
                    id: "msg-6",
                    senderId: "other",
                    type: "text",
                    text: "The token rewrite is on staging — take a look?",
                    timestamp: "10:09 AM",
                },
            ],
        },
    ],
};

const page = () => {
    return (
        <>
            <div className="flex flex-col h-full justify-between">
                <MessageHeader
                    name={MOCK_CHAT_DATA.user.name}
                    username={MOCK_CHAT_DATA.user.username}
                    lastSeen={MOCK_CHAT_DATA.user.lastSeen || ""}
                    avtarImage={MOCK_CHAT_DATA.user.avatarUrl}
                    avatarFallback={MOCK_CHAT_DATA.user.initials.slice(0, 2).toUpperCase()}
                />
                <div className="flex flex-col space-y-6 px-2 py-4 justify-end w-full">
                    <div className="flex gap-2 items-center">
                        <Avatar className='h-8 w-8'>
                            <AvatarImage src={MOCK_CHAT_DATA.user.avatarUrl} />
                            <AvatarFallback>{MOCK_CHAT_DATA.user.initials.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <p className="text-md font-medium text-muted-foreground bg-muted/60 px-3 py-2 rounded-full w-fit ">aaaaaaaaaaaa</p>
                    </div>
                    <div className="flex gap-2 items-center self-end">
                        <p className="text-md font-medium text-muted bg-foreground px-3 py-2 rounded-full w-fit ">aaaaaaaaaaaa</p>
                        <Avatar className='h-8 w-8'>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>{"Ali AL-Hamawy".slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page