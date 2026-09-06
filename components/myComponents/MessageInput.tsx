"use client";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react"
import { useState } from "react";

const MessageInput = () => {
    const [message, setMessage] = useState<string>("");

    const hasContent = message.trim().length > 0;

    return (
        <>
            <div className="sticky z-9999 w-full bottom-0 left-0 right-0  text-muted-foreground font-normal py-4 bg-background  flex items-center justify-center ">
                <form className="flex gap-2 items-end w-[90%] sm-w-xl mx-auto justify-center ">
                    <textarea
                        name=""
                        id=""
                        placeholder="Type a message..."
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-150 rounded-none resize-none p-1 h-12 flex text-sm [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden focus:outline-none border border-muted"></textarea>
                    <button className={cn("w-fit p-3 bg-muted/70 h-12 text-muted-foreground rounded-none", hasContent && "bg-muted text-white")}><Send /></button>
                </form>
            </div>
        </>
    )
}

export default MessageInput