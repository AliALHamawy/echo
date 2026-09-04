// types/chat.ts

export type MessageType = "text" | "code" | "link";
export type MessageStatus = "sent" | "delivered" | "read";

export interface Message {
    id: string;
    senderId: string; // "user" للرسائل المرسلة مننا، أو "other" للطرف الثاني
    type: MessageType;
    text: string;
    timestamp: string; // الوقت (مثال: "09:12 AM")
    status?: MessageStatus; // حالة القراءة للرسائل المرسلة فقط
    codeSnippet?: string; // في حال كانت الرسالة تحتوي على كود
    linkData?: {
        url: string;
        title: string;
        description: string;
    };
}

export interface ChatUser {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    initials: string;
    isOnline: boolean;
    lastSeen?: string;
}

export interface ChatConversation {
    user: ChatUser;
    messages: {
        date: string; // للتجميع حسب التاريخ (مثال: "Yesterday" / "Today")
        items: Message[];
    }[];
}