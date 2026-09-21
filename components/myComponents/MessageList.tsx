import { ChatConversation } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageListProps {
    messages: ChatConversation["messages"];
    otherUserAvatar: string;
    otherUserInitials: string;
    currentUserId?: string;
    currentUserAvatar?: string;
    currentUserInitials?: string;
}

const MessageList = ({
    messages,
    otherUserAvatar,
    otherUserInitials,
    currentUserId = "user",
    currentUserAvatar,
    currentUserInitials = "ME",
}: MessageListProps) => {
    return (
        <div className="flex flex-col space-y-6 px-2 py-6 w-full relative overflow-y-auto no-scrollbar">
            {messages.map((group) => (
                <div key={group.date} className="flex flex-col space-y-4">
                    <div className="flex justify-center my-2">
                        <span className="text-xs text-muted-foreground bg-muted/40 px-3 py-1 rounded-full">
                            {group.date}
                        </span>
                    </div>

                    {group.items.map((item, index) => {
                        const isMe = item.senderId === "user" || item.senderId === currentUserId;
                        const nextItem = group.items[index + 1];
                        const isLastFromSender = !nextItem || nextItem.senderId !== item.senderId;

                        return isMe ? (
                            <div key={item.id} className="flex flex-col gap-1 text-end self-end">
                                <div className="flex gap-2 items-end self-end">
                                    <p className="text-md font-normal text-background bg-foreground px-4 py-2 w-fit max-w-xs md:max-w-md text-start">
                                        {item.text}
                                    </p>
                                    {isLastFromSender ? (
                                        <Avatar className="h-8 w-8 shrink-0">
                                            <AvatarImage src={currentUserAvatar} />
                                            <AvatarFallback>{currentUserInitials}</AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <div className="w-8 shrink-0" />
                                    )}
                                </div>
                                {isLastFromSender && (
                                    <span className="text-muted-foreground/50 text-[13px] pr-10 capitalize">
                                        {item.status === "read" ? "Read" : item.status === "sent" ? "Sent" : item.timestamp}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div key={item.id} className="flex flex-col gap-1 text-start self-start">
                                <div className="flex gap-2 items-end">
                                    {isLastFromSender ? (
                                        <Avatar className="h-8 w-8 shrink-0">
                                            <AvatarImage src={otherUserAvatar} />
                                            <AvatarFallback>{otherUserInitials}</AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <div className="w-8 shrink-0" />
                                    )}
                                    <p className="text-md font-normal text-muted-foreground bg-muted/60 px-4 py-2 w-fit max-w-xs md:max-w-md">
                                        {item.text}
                                    </p>
                                </div>
                                {isLastFromSender && (
                                    <span className="text-muted-foreground/50 text-[13px] pl-10">
                                        {item.timestamp}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default MessageList;