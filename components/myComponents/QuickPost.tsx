'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronDown, Globe, Lock, MessageCircle, Repeat, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { backend } from "@/lib/backend";
interface QuickPostProps {
    onPostCreated?: () => void
}

interface MentionProfile {
    id: string
    username: string
    full_name: string | null
    avatar_url: string | null
}

interface MentionPosition {
    top: number
    left: number
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
    const [mentionProfiles, setMentionProfiles] = useState<MentionProfile[]>([]);
    const [mentionQuery, setMentionQuery] = useState("");
    const [mentionStart, setMentionStart] = useState<number | null>(null);
    const [activeMentionIndex, setActiveMentionIndex] = useState(0);
    const [cursorPosition, setCursorPosition] = useState(0);
    const [mentionPosition, setMentionPosition] = useState<MentionPosition>({ top: 0, left: 0 });
    const [visibility, setVisibility] = useState("public");
    const [commentsEnabled, setCommentsEnabled] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const mentionMirrorRef = useRef<HTMLDivElement>(null);
    const hasContent = content.trim().length > 0;
    const VisibilityIcon = visibilityIcons[visibility];
    const user = backend.authStore.record;
    const userName = user?.name || user?.username || user?.email || "Your account";
    const avatar = user?.avatar_url ?? user?.avatar
    const userAvatar = avatar
        ? backend.files.getURL(user, avatar)
        : undefined;

    useLayoutEffect(() => {
        const mirror = mentionMirrorRef.current;
        const marker = mirror?.querySelector("[data-caret-marker]");
        const textarea = textareaRef.current;
        if (!mirror || !(marker instanceof HTMLElement) || !textarea || mentionStart === null) return;

        const mirrorRect = mirror.getBoundingClientRect();
        const markerRect = marker.getBoundingClientRect();
        const maxLeft = Math.max(0, mirrorRect.width - 280);
        setMentionPosition({
            top: markerRect.bottom - mirrorRect.top - textarea.scrollTop + 4,
            left: Math.min(Math.max(0, markerRect.left - mirrorRect.left - textarea.scrollLeft), maxLeft),
        });
    }, [content, cursorPosition, mentionStart]);

    useEffect(() => {
        const query = mentionQuery.trim();
        if (mentionStart === null || query.length === 0) {
            return;
        }

        let cancelled = false;
        const timer = window.setTimeout(async () => {
            try {
                const client = createSupabaseBrowserClient();
                const escapedQuery = query.replace(/[%_,()]/g, (character) => `\\${character}`);
                const [{ data: profiles, error: profilesError }, { data: following, error: followingError }] = await Promise.all([
                    client
                        .from("profiles")
                        .select("id, username, full_name, avatar_url")
                        .or(`full_name.ilike.%${escapedQuery}%,username.ilike.%${escapedQuery}%`)
                        .limit(8),
                    user?.id
                        ? client.from("follows").select("following_id").eq("follower_id", user.id)
                        : Promise.resolve({ data: [], error: null }),
                ]);
                if (profilesError) throw profilesError;
                if (followingError) throw followingError;
                if (cancelled) return;

                const followingIds = new Set((following ?? []).map((record) => record.following_id));
                const sortedProfiles = [...((profiles ?? []) as MentionProfile[])].sort((left, right) => {
                    const leftPriority = followingIds.has(left.id) ? 0 : 1;
                    const rightPriority = followingIds.has(right.id) ? 0 : 1;
                    return leftPriority - rightPriority || (left.full_name ?? left.username).localeCompare(right.full_name ?? right.username);
                });
                setMentionProfiles(sortedProfiles);
                setActiveMentionIndex(0);
            } catch {
                if (!cancelled) setMentionProfiles([]);
            }
        }, 150);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [mentionQuery, mentionStart, user?.id]);

    const closeMentions = () => {
        setMentionProfiles([]);
        setMentionQuery("");
        setMentionStart(null);
        setActiveMentionIndex(0);
    };

    const selectMention = (profile: MentionProfile) => {
        const textarea = textareaRef.current;
        if (!textarea || mentionStart === null) return;

        const cursor = textarea.selectionStart;
        const mention = `@${profile.username} `;
        const nextContent = `${content.slice(0, mentionStart)}${mention}${content.slice(cursor)}`;
        const nextCursor = mentionStart + mention.length;
        setContent(nextContent);
        closeMentions();
        requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(nextCursor, nextCursor);
        });
    };

    const handleContentChange = (nextContent: string, cursor: number) => {
        setContent(nextContent);
        setCursorPosition(cursor);
        const beforeCursor = nextContent.slice(0, cursor);
        const match = beforeCursor.match(/(?:^|[\s([{/-])@([a-zA-Z0-9_]*)$/);
        if (!match) {
            closeMentions();
            return;
        }

        setMentionStart(cursor - match[0].length + (match[0].startsWith("@") ? 0 : 1));
        setMentionQuery(match[1]);
    };

    const handleContentKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (mentionProfiles.length === 0) return;
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveMentionIndex((index) => (index + 1) % mentionProfiles.length);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveMentionIndex((index) => (index - 1 + mentionProfiles.length) % mentionProfiles.length);
        } else if (event.key === "Enter" || event.key === "Tab") {
            event.preventDefault();
            selectMention(mentionProfiles[activeMentionIndex]);
        } else if (event.key === "Escape") {
            closeMentions();
        }
    };

    const handleContentSelection = () => {
        const textarea = textareaRef.current;
        if (textarea) setCursorPosition(textarea.selectionStart);
    };

    const handleContentScroll = () => {
        handleContentSelection();
    };

    const handleSubmit = async () => {
        const user = backend.authStore.record
        if (!user || !hasContent) return

        setError("")
        setIsSubmitting(true)

        try {
            await backend.collection("posts").create({
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
                        {userAvatar ? <AvatarImage src={userAvatar} alt={`${userName}'s avatar`} /> : null}
                        <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="relative w-full h-full">
                        <div
                            ref={mentionMirrorRef}
                            aria-hidden="true"
                            className="invisible pointer-events-none absolute inset-0 h-full w-full whitespace-pre-wrap break-words border-none text-base leading-normal md:text-sm"
                        >
                            {content.slice(0, cursorPosition)}
                            <span data-caret-marker className="inline-block h-[1em] w-px align-text-bottom" />
                        </div>
                        <textarea
                            ref={textareaRef}
                            name="content"
                            id="post-content"
                            className="w-full resize-none h-full border-none outline-none"
                            placeholder={useTypewriter(placeholders)}
                            value={content}
                            onChange={(event) => handleContentChange(event.target.value, event.target.selectionStart)}
                            onKeyDown={handleContentKeyDown}
                            onClick={handleContentSelection}
                            onKeyUp={handleContentSelection}
                            onScroll={handleContentScroll}
                        />
                        {mentionProfiles.length > 0 && (
                            <div
                                className="absolute z-50 w-full max-w-sm overflow-hidden rounded-none border border-border bg-popover p-1 text-popover-foreground shadow-lg"
                                style={{ top: mentionPosition.top, left: mentionPosition.left }}
                            >
                                {mentionProfiles.map((profile, index) => {
                                    const profileName = profile.full_name || profile.username;
                                    const profileAvatar = profile.avatar_url
                                        ? backend.files.getURL(profile, profile.avatar_url)
                                        : undefined;
                                    return (
                                        <button
                                            key={profile.id}
                                            type="button"
                                            onMouseDown={(event) => event.preventDefault()}
                                            onClick={() => selectMention(profile)}
                                            className={cn(
                                                "flex w-full items-center gap-3 rounded-none px-3 py-2 text-left transition-colors",
                                                index === activeMentionIndex ? "bg-muted" : "hover:bg-muted/70"
                                            )}
                                        >
                                            <Avatar className="size-8 shrink-0 rounded-none">
                                                {profileAvatar ? <AvatarImage src={profileAvatar} alt="" /> : null}
                                                <AvatarFallback className="rounded-none">{profileName.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <span className="min-w-0">
                                                <span className="block truncate text-sm font-medium">{profileName}</span>
                                                <span className="block truncate text-xs text-muted-foreground">@{profile.username}</span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
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