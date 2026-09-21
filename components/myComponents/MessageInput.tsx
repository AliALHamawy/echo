"use client";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

interface MessageInputProps {
    onSend?: (value: string) => Promise<void> | void;
    disabled?: boolean;
    placeholder?: string;
}

const MessageInput = ({ onSend, disabled = false, placeholder = "Type a message..." }: MessageInputProps) => {
    const [message, setMessage] = useState<string>("");

    const hasContent = message.trim().length > 0;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!onSend || !hasContent || disabled) return;

        const value = message.trim();
        setMessage("");
        await onSend(value);
    };

    return (
        <div className="w-full text-muted-foreground font-normal py-4 bg-background flex items-center justify-center">
            <form onSubmit={handleSubmit} className="flex gap-2 items-end w-[90%] sm:max-w-xl mx-auto justify-center">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-150 rounded-none resize-none p-1 h-12 flex text-sm [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden focus:outline-none border border-muted disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={!hasContent || disabled}
                    className={cn(
                        "w-fit p-3 h-12 rounded-none",
                        hasContent && !disabled ? "bg-foreground text-background" : "bg-muted/70 text-muted-foreground"
                    )}
                >
                    <Send className="h-4 w-4" />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;