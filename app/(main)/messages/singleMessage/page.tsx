"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { pb } from "@/lib/pocketbase";
import MessageHeader from "@/components/myComponents/MessageHeader";
import MessageList from "@/components/myComponents/MessageList";
import MessageInput from "@/components/myComponents/MessageInput";
import { ChatConversation } from "@/types/chat";
import {
    fetchThreadMessages,
    getInitials,
    getUserAvatarUrl,
    groupMessagesByDate,
    mapMessageRecord,
    markThreadAsRead,
    messageInvolvesThread,
    sendThreadMessage,
    type MessageRecord,
} from "@/lib/messages";

const Page = () => {
    const searchParams = useSearchParams();
    const peerUserId = searchParams.get("userId");
    const [currentUserId, setCurrentUserId] = useState(() => pb.authStore.record?.id ?? "");
    const [otherUser, setOtherUser] = useState<any>(null);
    const [messages, setMessages] = useState<ChatConversation["messages"]>([]);
    const [isSending, setIsSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sendError, setSendError] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const currentUser = pb.authStore.record;

    useEffect(() => {
        const syncAuth = () => {
            setCurrentUserId(pb.authStore.record?.id ?? "");
        };

        syncAuth();
        return pb.authStore.onChange(syncAuth);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadConversation = useCallback(async () => {
        const authUserId = pb.authStore.record?.id;

        if (!authUserId) {
            setOtherUser(null);
            setMessages([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setSendError("");

        try {
            let targetUser = null as any;

            if (peerUserId) {
                targetUser = await pb.collection("users").getOne(peerUserId, { requestKey: null }).catch(() => null);
            }

            if (!targetUser) {
                const users = await pb
                    .collection("users")
                    .getFullList({
                        filter: `id != "${authUserId}"`,
                        sort: "-updated",
                        requestKey: null,
                    })
                    .catch(() => []);
                targetUser = users[0] ?? null;
            }

            setOtherUser(targetUser);

            if (!targetUser) {
                setMessages([]);
                return;
            }

            const records = await fetchThreadMessages(authUserId, targetUser.id).catch(() => []);
            setMessages(groupMessagesByDate(records, authUserId));
            await markThreadAsRead(authUserId, targetUser.id);
        } catch {
            setMessages([]);
            setOtherUser(null);
        } finally {
            setLoading(false);
        }
    }, [peerUserId]);

    useEffect(() => {
        void loadConversation();
    }, [loadConversation, currentUserId]);

    useEffect(() => {
        if (!loading) {
            scrollToBottom();
        }
    }, [loading, messages]);

    useEffect(() => {
        const authUserId = pb.authStore.record?.id;
        const otherUserId = otherUser?.id;

        if (!authUserId || !otherUserId) return;

        let active = true;
        let unsubscribe: (() => void) | null = null;

        void pb.collection("messages").subscribe("*", (event) => {
            const record = event.record as MessageRecord;
            if (!messageInvolvesThread(record, authUserId, otherUserId)) return;

            void (async () => {
                const records = await fetchThreadMessages(authUserId, otherUserId).catch(() => []);
                setMessages(groupMessagesByDate(records, authUserId));

                if (record.recipient === authUserId) {
                    await markThreadAsRead(authUserId, otherUserId);
                }
            })();
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
    }, [currentUserId, otherUser?.id]);

    const handleSendMessage = async (value: string) => {
        const authUserId = pb.authStore.record?.id;
        if (!authUserId || !otherUser || !value.trim()) return;

        setIsSending(true);
        setSendError("");

        try {
            const record = await sendThreadMessage(authUserId, otherUser.id, value);
            const newMessage = mapMessageRecord(record, authUserId);

            setMessages((previous) => {
                if (!previous.length) {
                    return [{ date: "Today", items: [newMessage] }];
                }

                const next = [...previous];
                const latestGroup = next[next.length - 1];
                if (latestGroup.date === "Today") {
                    latestGroup.items = [...latestGroup.items, newMessage];
                    return next;
                }

                return [...next, { date: "Today", items: [newMessage] }];
            });
        } catch (error) {
            console.error("Failed to send message", error);
            setSendError("Message could not be sent. Try again.");
        } finally {
            setIsSending(false);
        }
    };

    const otherUserName = otherUser?.name || otherUser?.username || "Echo user";
    const otherUserUsername = otherUser?.username ? `@${otherUser.username}` : "";
    const otherUserAvatar = getUserAvatarUrl(otherUser);
    const otherUserInitials = getInitials(otherUserName);
    const currentUserAvatar = getUserAvatarUrl(currentUser);
    const currentUserInitials = getInitials(currentUser?.name || currentUser?.username || "Me");
    const hasMessages = messages.some((group) => group.items.length > 0);

    return (
        <div className="flex flex-col h-full w-full overflow-hidden justify-between relative">
            <div className="shrink-0">
                <MessageHeader
                    name={otherUserName}
                    username={otherUserUsername}
                    lastSeen={otherUser?.isOnline ? "Online now" : "Active recently"}
                    avtarImage={otherUserAvatar}
                    avatarFallback={otherUserInitials}
                    profileUserId={otherUser?.id}
                />
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar min-h-0 w-full">
                {loading ? (
                    <div className="p-6 text-sm text-muted-foreground">Loading conversation...</div>
                ) : !otherUser ? (
                    <div className="p-6 text-sm text-muted-foreground">No user found to message.</div>
                ) : (
                    <>
                        {!hasMessages && (
                            <div className="p-6 text-center text-sm text-muted-foreground">
                                No messages yet. Say hello to {otherUserName}.
                            </div>
                        )}
                        <MessageList
                            otherUserAvatar={otherUserAvatar}
                            otherUserInitials={otherUserInitials}
                            currentUserId={currentUserId || "user"}
                            currentUserAvatar={currentUserAvatar}
                            currentUserInitials={currentUserInitials}
                            messages={messages}
                        />
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <div className="shrink-0">
                {sendError ? (
                    <p className="px-4 pb-1 text-xs text-destructive text-center">{sendError}</p>
                ) : null}
                <MessageInput onSend={handleSendMessage} disabled={isSending || !otherUser || !currentUserId} />
            </div>
        </div>
    );
};

export default Page;
