import { ChatConversation } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageListProps {
    messages: ChatConversation["messages"];
    otherUserAvatar: string;
    otherUserInitials: string;
}

const MessageList = ({
    messages,
    otherUserAvatar,
    otherUserInitials,
}: MessageListProps) => {
    return (
        <div className="flex flex-col space-y-6 px-2 py-6 w-full relative overflow-y-auto no-scrollbar">
            {messages.map((group) => (
                <div key={group.date} className="flex flex-col space-y-4">
                    {/* فاصل التاريخ */}
                    <div className="flex justify-center my-2">
                        <span className="text-xs text-muted-foreground bg-muted/40 px-3 py-1 rounded-full">
                            {group.date}
                        </span>
                    </div>

                    {group.items.map((item, index) => {
                        const isMe = item.senderId === "user";
                        const nextItem = group.items[index + 1];
                        const isLastFromSender = !nextItem || nextItem.senderId !== item.senderId;

                        return isMe ? (
                            /* رسائلي */
                            <div key={item.id} className="flex flex-col gap-1 text-end self-end">
                                <div className="flex gap-2 items-end self-end">
                                    <p className="text-md font-normal text-background bg-foreground px-4 py-2 w-fit max-w-xs md:max-w-md text-start">
                                        {item.text}
                                    </p>
                                    {isLastFromSender ? (
                                        <Avatar className="h-8 w-8 shrink-0">
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>
                                                {"Ali AL-Hamawy".slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <div className="w-8 shrink-0" />
                                    )}
                                </div>
                                {isLastFromSender && (
                                    <span className="text-muted-foreground/50 text-[13px] pr-10">
                                        {item.status || item.timestamp}
                                    </span>
                                )}
                            </div>
                        ) : (
                            /* رسائل الطرف الآخر */
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