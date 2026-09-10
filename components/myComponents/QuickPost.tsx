'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { ChevronDown, Globe, Lock, MessageCircle, Repeat, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function useTypewriter(
    phrases: string[],
    typingSpeed = 70,
    deletingSpeed = 35,
    pauseTime = 1500
) {
    const [placeholder, setPlaceholder] = useState("");
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!phrases || phrases.length === 0) return;

        const currentPhrase = phrases[phraseIndex];

        const timer = setTimeout(() => {
            if (!isDeleting) {
                setPlaceholder(currentPhrase.substring(0, charIndex + 1));
                setCharIndex((prev) => prev + 1);

                if (charIndex + 1 === currentPhrase.length) {
                    setTimeout(() => setIsDeleting(true), pauseTime);
                }
            } else {
                setPlaceholder(currentPhrase.substring(0, charIndex - 1));
                setCharIndex((prev) => prev - 1);

                if (charIndex - 1 === 0) {
                    setIsDeleting(false);
                    setPhraseIndex((prev) => (prev + 1) % phrases.length);
                }
            }
        }, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timer);
    }, [charIndex, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseTime]);

    return placeholder;
}

const placeholders = [
    "What's on your mind?",
    "Share a quick update...",
    "What are you working on today?",
];

const QuickPost = () => {
    const [content, setContent] = useState("");
    const hasContent = content.length > 0;
    return (
        <>
            <Card className="flex flex-col p-0 bg-mute-foreground rounded-lg">
                <div className="flex gap-5 items-start p-4 pb-0 h-18 sm:h-30 ">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>AA</AvatarFallback>
                    </Avatar>
                    <textarea name="" id="" className="w-full resize-none h-full border-none outline-none" placeholder={useTypewriter(placeholders)} value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                </div>
                <div className="border-t border-mute-foreground  p-4 flex justify-between items-center">
                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="outline-none hover:bg-muted dark:hover:bg-popover border flex p-1 items-center justify-between group rounded-xl transition-colors ">
                                    <div className="flex gap-1 items-center text-[12px]">
                                        <Globe height={16} />
                                        Public
                                    </div>
                                    <ChevronDown height={14} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="rounded-none w-40">
                                <DropdownMenuItem className="justify-start gap-1 rounded-none">
                                    <Globe className="size-4" />
                                    Public
                                </DropdownMenuItem>
                                <DropdownMenuItem className="justify-start gap-1 rounded-none">
                                    <Users className="size-4" />
                                    Followers
                                </DropdownMenuItem>
                                <DropdownMenuItem className="justify-start gap-1 rounded-none">
                                    <Repeat className="size-4" />
                                    Mutuals
                                </DropdownMenuItem>
                                <DropdownMenuItem className="justify-start gap-1 rounded-none">
                                    <Lock className="size-4" />
                                    Only Me
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <button className="outline-none hover:bg-muted dark:hover:bg-popover border flex p-1 pr-3 items-center justify-between group rounded-xl transition-colors ">
                            <div className="flex gap-1 items-center text-[12px]">
                                <MessageCircle height={16} />
                                Comments on
                            </div>
                        </button>
                    </div>
                    <button className={cn(
                        "outline-none border flex p-1 px-3 items-center justify-center text-center group rounded-xl transition-all duration-200 text-xs font-medium cursor-not-allowed text-background",
                        hasContent
                            ? "bg-foreground"
                            : "bg-foreground/20 dark:bg-foreground/50"
                    )}
                    disabled={!hasContent}
                    >
                        Post
                    </button>
                </div>
            </Card>
        </>
    )
}

export default QuickPost