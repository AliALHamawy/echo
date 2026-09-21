"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { pb } from "@/lib/pocketbase"
import { Send, Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

interface CommentRecord {
    id: string
    post: string
    author: string
    content: string
    created: string
    expand?: { author?: { name?: string; username?: string; avatar?: string; collectionId?: string } }
}

interface PostCommentsProps {
    postId: string
    onCommentCountChange: (count: number) => void
}

function getPocketBaseErrorMessage(error: unknown, fallback: string) {
    if (typeof error === "object" && error !== null && "response" in error) {
        const response = (error as { response?: { message?: string; data?: Record<string, { message?: string }> } }).response
        const fieldError = Object.entries(response?.data ?? {}).find(([, value]) => value?.message)
        if (fieldError) {
            return `${fieldError[0]}: ${fieldError[1].message}`
        }
        return response?.message || fallback
    }

    return error instanceof Error ? error.message : fallback
}

const PostComments = ({ postId, onCommentCountChange }: PostCommentsProps) => {
    const [comments, setComments] = useState<CommentRecord[]>([])
    const [content, setContent] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    const loadComments = useCallback(async () => {
        try {
            const records = await pb.collection("comments").getFullList<CommentRecord>({
                expand: "author",
                requestKey: null,
            })
            const postComments = records.filter((comment) => comment.post === postId)
            setComments(postComments)
            onCommentCountChange(postComments.length)
        } catch (commentError) {
            setError(getPocketBaseErrorMessage(commentError, "Comments are unavailable right now."))
        } finally {
            setIsLoading(false)
        }
    }, [postId, onCommentCountChange])

    useEffect(() => {
        queueMicrotask(() => void loadComments())
    }, [loadComments])

    const submitComment = async () => {
        const user = pb.authStore.record
        if (!user || !content.trim() || isSubmitting) return

        setIsSubmitting(true)
        setError("")
        try {
            await pb.collection("comments").create({ post: postId, author: user.id, content: content.trim() })
            setContent("")
            await loadComments()
        } catch (commentError) {
            setError(getPocketBaseErrorMessage(commentError, "Unable to add your comment."))
        } finally {
            setIsSubmitting(false)
        }
    }

    const deleteComment = async (commentId: string) => {
        try {
            await pb.collection("comments").delete(commentId)
            await loadComments()
        } catch (commentError) {
            setError(getPocketBaseErrorMessage(commentError, "Unable to delete this comment."))
        }
    }

    return (
        <div className="mt-4 border-t border-border pt-4">
            {isLoading ? <p className="text-xs text-muted-foreground">Loading comments...</p> : comments.map((comment) => {
                const author = comment.expand?.author
                const name = author?.name || author?.username || "Echo user"
                const avatar = author?.avatar && author.collectionId ? pb.files.getURL(author, author.avatar) : undefined
                return (
                    <div key={comment.id} className="group flex gap-3 border-b border-border/50 px-2 py-3 transition-colors last:border-b-0 hover:bg-muted/20">
                        <Avatar className="size-8 shrink-0"><AvatarImage src={avatar} /><AvatarFallback className="text-[10px]">{name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold leading-4 text-foreground">{name}</p>
                            <p className="mt-0.5 break-words text-sm leading-5 text-foreground/75">{comment.content}</p>
                        </div>
                        {pb.authStore.record?.id === comment.author && <button type="button" onClick={() => void deleteComment(comment.id)} aria-label="Delete comment" className="self-start p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100"><Trash2 className="size-3.5" /></button>}
                    </div>
                )
            })}
            <div className="mt-3 flex items-end gap-2"><Textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Write a comment..." className="h-9 min-h-9 resize-none overflow-hidden rounded-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0" /><Button type="button" size="icon" disabled={!content.trim() || isSubmitting} onClick={() => void submitComment()} aria-label="Post comment" className="h-9 w-9 shrink-0 rounded-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"><Send className="size-4" /></Button></div>
            {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        </div>
    )
}

export default PostComments