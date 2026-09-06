import { ChatConversation } from "@/types/chat";
import MessageHeader from "@/components/myComponents/MessageHeader";
import MessageList from "@/components/myComponents/MessageList";
import MessageInput from "@/components/myComponents/MessageInput";

export const MOCK_CHAT_DATA: ChatConversation = {
    user: {
        id: "user-ada",
        name: "Ada Vinter",
        username: "@ada_vinter",
        avatarUrl: "",
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
                    text: "Nice! Checking it out now.",
                    timestamp: "09:14 AM",
                    status: "read",
                },
                {
                    id: "msg-3",
                    senderId: "user",
                    type: "text",
                    text: "Did you keep the accent color for destructive actions only?",
                    timestamp: "09:15 AM",
                    status: "read",
                },
                {
                    id: "msg-4",
                    senderId: "other",
                    type: "code",
                    text: "Yes, exactly. Here is how the CSS variables look now:",
                    codeSnippet: "--destructive: oklch(0.577 0.245 27.325);\n--accent: var(--muted);",
                    timestamp: "09:16 AM",
                },
                {
                    id: "msg-5",
                    senderId: "other",
                    type: "text",
                    text: "Let me know if you need me to adjust the contrast for dark mode.",
                    timestamp: "09:17 AM",
                },
            ],
        },
        {
            date: "Today",
            items: [
                {
                    id: "msg-6",
                    senderId: "user",
                    type: "text",
                    text: "I reviewed the changes on local setup.",
                    timestamp: "10:02 AM",
                    status: "read",
                },
                {
                    id: "msg-7",
                    senderId: "user",
                    type: "text",
                    text: "The contrast in dark mode looks super clean.",
                    timestamp: "10:03 AM",
                    status: "read",
                },
                {
                    id: "msg-8",
                    senderId: "user",
                    type: "text",
                    text: "That reads so much faster now. Ship it!",
                    timestamp: "10:05 AM",
                    status: "read",
                },
                {
                    id: "msg-9",
                    senderId: "other",
                    type: "link",
                    text: "Awesome! The deployment just finished, here is the preview link:",
                    linkData: {
                        url: "https://staging.echo.app",
                        title: "Design tokens — staging preview",
                        description: "Live preview of the rewritten token layer with light and dark themes.",
                    },
                    timestamp: "10:08 AM",
                },
                {
                    id: "msg-10",
                    senderId: "other",
                    type: "text",
                    text: "Can you test the mobile layout when you have a minute?",
                    timestamp: "10:09 AM",
                },
                {
                    id: "msg-11",
                    senderId: "user",
                    type: "text",
                    text: "On it right now 👍",
                    timestamp: "10:12 AM",
                    status: "delivered",
                },
                {
                    id: "msg-12",
                    senderId: "user",
                    type: "text",
                    text: "Testing on iOS Safari and Android Chrome.",
                    timestamp: "10:13 AM",
                    status: "delivered",
                },
                {
                    id: "msg-13",
                    senderId: "user",
                    type: "text",
                    text: "Everything looks pixel-perfect! Ready for production merge.",
                    timestamp: "10:15 AM",
                    status: "sent",
                },
            ],
        },
    ],
};

const Page = () => {
    return (
        <div className="flex flex-col h-[100dvh] justify-between relative">
            {/* Header */}
            <MessageHeader
                name={MOCK_CHAT_DATA.user.name}
                username={MOCK_CHAT_DATA.user.username}
                lastSeen={MOCK_CHAT_DATA.user.lastSeen || ""}
                avtarImage={MOCK_CHAT_DATA.user.avatarUrl}
                avatarFallback={MOCK_CHAT_DATA.user.initials.slice(0, 2).toUpperCase()}
            />

            <MessageList
                otherUserAvatar={MOCK_CHAT_DATA.user.avatarUrl}
                otherUserInitials={MOCK_CHAT_DATA.user.initials.slice(0, 2).toUpperCase()}
                messages={MOCK_CHAT_DATA.messages}
            />
            <MessageInput />
        </div>
    );
};

export default Page;