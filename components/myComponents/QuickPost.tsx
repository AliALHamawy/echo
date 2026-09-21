'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react";
import { ChevronDown, Globe, Lock, MessageCircle, Repeat, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { pb } from "@/lib/pocketbase";
interface QuickPostProps {
    onPostCreated?: () => void
}

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

const visibilityLabels: Record<string, string> = {
    public: "Public",
    followers: "Followers",
    mutuals: "Mutuals",
    only_me: "Only Me",
};

const visibilityIcons: Record<string, LucideIcon> = {
    public: Globe,
    followers: Users,
    mutuals: Repeat,
    only_me: Lock,
};

const QuickPost = ({ onPostCreated }: QuickPostProps) => {
    const [content, setContent] = useState("");
    const [visibility, setVisibility] = useState("public");
    const [commentsEnabled, setCommentsEnabled] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const hasContent = content.trim().length > 0;
    const VisibilityIcon = visibilityIcons[visibility];
    const user = pb.authStore.record;
    const userName = user?.name || user?.username || user?.email || "Your account";
    const userAvatar = user?.avatar && user?.collectionId
        ? pb.files.getURL(user, user.avatar)
        : undefined;

    const handleSubmit = async () => {
        const user = pb.authStore.record
        if (!user || !hasContent) return

        setError("")
        setIsSubmitting(true)

        try {
            await pb.collection("posts").create({
                author: user.id,
                content: content.trim(),
                visibility,
                commentsEnabled,
            })
            setContent("")
            onPostCreated?.()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to create post.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Card className="flex flex-col p-0 bg-mute-foreground rounded-lg">
                <div className="flex gap-5 items-start p-4 pb-0 h-18 sm:h-30 ">
                    <Avatar>
                        <AvatarImage src={userAvatar} />
                        <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <textarea name="" id="" className="w-full resize-none h-full border-none outline-none" placeholder={useTypewriter(placeholders)} value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                </div>
                <div className="border-t border-mute-foreground  p-4 flex justify-between items-center">
                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="outline-none hover:bg-muted dark:hover:bg-popover border flex p-1 items-center justify-between group rounded-xl transition-colors ">
                                    <div className="flex gap-1 items-center text-[12px]">
                                        <VisibilityIcon height={16} />
                                        {visibilityLabels[visibility]}
                                    </div>
                                    <ChevronDown height={14} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="rounded-none w-40">
                                <DropdownMenuItem onSelect={() => setVisibility("public")} className="justify-start gap-1 rounded-none">
                                    <Globe className="size-4" />
                                    Public
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setVisibility("followers")} className="justify-start gap-1 rounded-none">
                                    <Users className="size-4" />
                                    Followers
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setVisibility("mutuals")} className="justify-start gap-1 rounded-none">
                                    <Repeat className="size-4" />
                                    Mutuals
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setVisibility("only_me")} className="justify-start gap-1 rounded-none">
                                    <Lock className="size-4" />
                                    Only Me
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <button type="button" onClick={() => setCommentsEnabled((enabled) => !enabled)} className="outline-none hover:bg-muted dark:hover:bg-popover border flex p-1 pr-3 items-center justify-between group rounded-xl transition-colors ">
                            <div className="flex gap-1 items-center text-[12px]">
                                <MessageCircle height={16} />
                                Comments {commentsEnabled ? "on" : "off"}
                            </div>
                        </button>
                    </div>
                    <button type="button" onClick={handleSubmit} className={cn(
                        "outline-none border flex p-1 px-3 items-center justify-center text-center group rounded-xl transition-all duration-200 text-xs font-medium text-background disabled:cursor-not-allowed",
                        hasContent && !isSubmitting
                            ? "bg-foreground"
                            : "bg-foreground/20 dark:bg-foreground/50"
                    )}
                    disabled={!hasContent || isSubmitting}
                    >
                        {isSubmitting ? "Posting..." : "Post"}
                    </button>
                </div>
                {error && <p className="px-4 pb-4 text-sm text-destructive">{error}</p>}
            </Card>
        </>
    )
}

export default QuickPost