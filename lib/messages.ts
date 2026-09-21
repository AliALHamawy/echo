import type { RecordModel } from "pocketbase";
import { pb } from "@/lib/pocketbase";
import type { Message, MessageStatus } from "@/types/chat";

export type MessageRecord = RecordModel & {
    sender: string;
    recipient: string;
    text?: string;
    read?: boolean;
};

export type ConversationSummary = {
    peerId: string;
    lastMessage: MessageRecord;
    unreadCount: number;
};

export function getInitials(value: string) {
    const parts = value.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "U";
    return parts
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

export function getUserAvatarUrl(record: RecordModel | null | undefined) {
    if (!record?.avatar || !record?.collectionId) return "";
    return pb.files.getURL(record, record.avatar);
}

export function formatConversationTime(dateString?: string) {
    if (!dateString) return "Now";

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Now";

    return new Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

export function formatMessageTimestamp(dateString?: string) {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
}

export function getDateGroupLabel(dateString: string) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Today";

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    if (isSameDay(date, today)) return "Today";
    if (isSameDay(date, yesterday)) return "Yesterday";

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    }).format(date);
}

export function inboxFilter(currentUserId: string) {
    return `(sender = "${currentUserId}" || recipient = "${currentUserId}")`;
}

export function threadFilter(currentUserId: string, peerUserId: string) {
    return `((sender = "${currentUserId}" && recipient = "${peerUserId}") || (sender = "${peerUserId}" && recipient = "${currentUserId}"))`;
}

export function mapMessageRecord(record: MessageRecord, currentUserId: string): Message {
    const isMine = record.sender === currentUserId;
    let status: MessageStatus | undefined;

    if (isMine) {
        status = record.read ? "read" : "sent";
    }

    return {
        id: record.id,
        senderId: isMine ? "user" : "other",
        type: "text",
        text: record.text || "",
        timestamp: formatMessageTimestamp(record.created),
        status,
    };
}

export function groupMessagesByDate(records: MessageRecord[], currentUserId: string) {
    const groups: { date: string; items: Message[] }[] = [];
    const indexByDate = new Map<string, number>();

    for (const record of records) {
        const date = getDateGroupLabel(record.created);
        const message = mapMessageRecord(record, currentUserId);
        const existingIndex = indexByDate.get(date);

        if (existingIndex === undefined) {
            indexByDate.set(date, groups.length);
            groups.push({ date, items: [message] });
            continue;
        }

        groups[existingIndex].items.push(message);
    }

    return groups;
}

export function buildConversationSummaries(
    records: MessageRecord[],
    currentUserId: string
): Map<string, ConversationSummary> {
    const byPeer = new Map<string, { last: MessageRecord | null; unread: number }>();

    for (const record of records) {
        const peerId = record.sender === currentUserId ? record.recipient : record.sender;
        if (!peerId) continue;

        let entry = byPeer.get(peerId);
        if (!entry) {
            entry = { last: null, unread: 0 };
            byPeer.set(peerId, entry);
        }

        if (!entry.last || new Date(record.created) > new Date(entry.last.created)) {
            entry.last = record;
        }

        if (record.sender !== currentUserId && record.read !== true) {
            entry.unread += 1;
        }
    }

    const result = new Map<string, ConversationSummary>();

    for (const [peerId, { last, unread }] of byPeer) {
        if (last) {
            result.set(peerId, {
                peerId,
                lastMessage: last,
                unreadCount: unread,
            });
        }
    }

    return result;
}

export async function fetchInboxMessages(currentUserId: string) {
    return pb.collection("messages").getFullList({
        filter: inboxFilter(currentUserId),
        sort: "-created",
        requestKey: null,
    }) as Promise<MessageRecord[]>;
}

export async function fetchThreadMessages(currentUserId: string, peerUserId: string) {
    return pb.collection("messages").getFullList({
        filter: threadFilter(currentUserId, peerUserId),
        sort: "created",
        requestKey: null,
    }) as Promise<MessageRecord[]>;
}

export async function markThreadAsRead(currentUserId: string, peerUserId: string) {
    const records = await fetchThreadMessages(currentUserId, peerUserId);
    const unreadIncoming = records.filter(
        (record) => record.recipient === currentUserId && record.read !== true
    );

    await Promise.all(
        unreadIncoming.map((record) =>
            pb.collection("messages").update(record.id, { read: true }, { requestKey: null }).catch(() => null)
        )
    );
}

export async function sendThreadMessage(currentUserId: string, peerUserId: string, text: string) {
    return pb.collection("messages").create(
        {
            sender: currentUserId,
            recipient: peerUserId,
            text: text.trim(),
        },
        { requestKey: null }
    ) as Promise<MessageRecord>;
}

export function messageInvolvesUser(record: MessageRecord, userId: string) {
    return record.sender === userId || record.recipient === userId;
}

export function messageInvolvesThread(record: MessageRecord, currentUserId: string, peerUserId: string) {
    return (
        (record.sender === currentUserId && record.recipient === peerUserId) ||
        (record.sender === peerUserId && record.recipient === currentUserId)
    );
}
