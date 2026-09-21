"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Ellipsis, Flag, Pencil, Sparkles, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { SparklesOff } from "./SparklesOff";
import type { Post } from "@/lib/posts";
import { pb } from "@/lib/pocketbase";
import { useEffect, useRef, useState } from "react";
import PostActions from "./PostActions";
import PostComments from "./PostComments";
import Link from "next/link";

interface MyCardProps {
    post: Post;
    onPostChanged?: () => void;
}

const MyCard = ({ post, onPostChanged }: MyCardProps) => {
    const { userAvatar, name, userName, createdAt, postDescription, numberOfLikes, numberOfComments, repost } = post;
    const [showComments, setShowComments] = useState(false);
    const [commentCount, setCommentCount] = useState(numberOfComments);
    const commentsRef = useRef<HTMLDivElement>(null);
    const isOwner = pb.authStore.record?.id === post.authorId;

    useEffect(() => {
        if (!showComments) return;

        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target;
            if (!(target instanceof Node)) return;
            if (commentsRef.current?.contains(target)) return;
            if (target instanceof Element && target.closest('[aria-label="View comments"]')) return;
            setShowComments(false);
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [showComments]);

    const handleEdit = async () => {
        const content = window.prompt("Edit your post", post.postDescription)?.trim();
        if (!content || content === post.postDescription) return;

        await pb.collection("posts").update(post.id, { content });
        onPostChanged?.();
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this post?")) return;

        await pb.collection("posts").delete(post.id);
        onPostChanged?.();
    };

    return (
        <Card className="rounded-none p-5 bg-transparent border border-border transition-[0.3s] hover:border-foreground/15 outline-none">
            <div className="flex justify-between items-center">
                <div className="flex justify-start items-center gap-3">
                    <Link href={`/profile/${post.authorId}`} aria-label={`View ${name}'s profile`}>
                        <Avatar className='h-8 w-8 transition-opacity hover:opacity-80'>
                            <AvatarImage src={userAvatar} />
                            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </Link>
                    <div className="flex flex-col">
                        <span className='text-sm text-foreground leading-tight'>{name}</span>
                        <span className='text-xs text-muted-foreground'>{userName}</span>
                    </div>
                    <span className='text-xs text-muted-foreground ml-2'>{createdAt}</span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="outline-none hover:bg-muted/50 h-7 w-7 flex items-center justify-center group rounded-sm transition-colors">
                            <Ellipsis className="text-foreground/40 transition-[0.3s] group-hover:text-foreground" width={17} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-none w-40">
                        {isOwner ? (
                            <>
                                <DropdownMenuItem onSelect={() => void handleEdit()} className="justify-between rounded-none">
                                    Edit
                                    <Pencil className="size-4" />
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => void handleDelete()} variant="destructive" className="justify-between rounded-none">
                                    Delete
                                    <Trash2 className="size-4" />
                                </DropdownMenuItem>
                            </>
                        ) : (
                            <>
                                <DropdownMenuItem className="justify-between focus:bg-[#96ff963b] rounded-none">
                                    Interested
                                    <Sparkles className="size-4" />
                                </DropdownMenuItem>
                                <DropdownMenuItem className="justify-between rounded-none">
                                    Not interested
                                    <SparklesOff className="size-4" />
                                </DropdownMenuItem>
                                <DropdownMenuItem variant="destructive" className="justify-between rounded-none">
                                    Report
                                    <Flag className="size-4" />
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <CardContent className="px-0 py-3 text-sm text-foreground/90">
                {postDescription}
            </CardContent>

            <PostActions postId={post.id} likes={numberOfLikes} comments={commentCount} reposts={repost} likedByViewer={post.likedByViewer} repostedByViewer={post.repostedByViewer} commentsEnabled={post.commentsEnabled} onCommentsClick={() => setShowComments((visible) => !visible)} />
            {post.commentsEnabled && showComments && <div ref={commentsRef}><PostComments postId={post.id} onCommentCountChange={setCommentCount} /></div>}
        </Card>
    )
}

export default MyCard;