"use client"

import { Heart, MessageCircle, Repeat2 } from "lucide-react"
import { useEffect, useState } from "react"
import { pb } from "@/lib/pocketbase"
import { cn } from "@/lib/utils"

interface PostActionsProps {
    postId: string
    likes: number
    comments: number
    reposts: number
    likedByViewer: boolean
    repostedByViewer: boolean
    commentsEnabled: boolean
    onCommentsClick: () => void
}

const PostActions = ({
    postId,
    likes: initialLikes,
    comments,
    reposts: initialReposts,
    likedByViewer: initialLiked,
    repostedByViewer: initialReposted,
    commentsEnabled,
    onCommentsClick,
}: PostActionsProps) => {
    const [likes, setLikes] = useState(initialLikes)
    const [reposts, setReposts] = useState(initialReposts)
    const [liked, setLiked] = useState(initialLiked)
    const [reposted, setReposted] = useState(initialReposted)
    const [isBusy, setIsBusy] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        const user = pb.authStore.record
        if (!user) return

        const loadInteractions = async () => {
            try {
                const records = await pb.collection("post").getFullList<{
                    postInteractions: string
                    author: string
                    kind: "like" | "repost"
                }>({ requestKey: null })
                const postInteractions = records.filter((record) => record.postInteractions === postId)
                setLikes(postInteractions.filter((record) => record.kind === "like").length)
                setReposts(postInteractions.filter((record) => record.kind === "repost").length)
                setLiked(postInteractions.some((record) => record.author === user.id && record.kind === "like"))
                setReposted(postInteractions.some((record) => record.author === user.id && record.kind === "repost"))
            } catch {
                // Keep the post's initial values if interaction hydration is unavailable.
            }
        }

        void loadInteractions()
    }, [postId])

    const toggleInteraction = async (kind: "like" | "repost") => {
        const user = pb.authStore.record
        if (!user || isBusy) return

        const isActive = kind === "like" ? liked : reposted
        const setActive = kind === "like" ? setLiked : setReposted
        const setCount = kind === "like" ? setLikes : setReposts
        const count = kind === "like" ? likes : reposts
        const nextActive = !isActive

        setActive(nextActive)
        setCount(Math.max(0, count + (nextActive ? 1 : -1)))
        setIsBusy(true)
        setError("")

        try {
            const filter = `postInteractions = "${postId}" && author = "${user.id}" && kind = "${kind}"`
            const existing = await pb.collection("post").getFirstListItem(filter).catch(() => null)
            if (nextActive && !existing) {
                await pb.collection("post").create({ postInteractions: postId, author: user.id, kind })
            } else if (!nextActive && existing) {
                await pb.collection("post").delete(existing.id)
            }
        } catch (interactionError) {
            setActive(isActive)
            setCount(count)
            setError(interactionError instanceof Error ? interactionError.message : "Unable to save this interaction.")
        } finally {
            setIsBusy(false)
        }
    }

    return (
        <div className="flex items-center gap-5 text-muted-foreground">
            <button type="button" onClick={() => void toggleInteraction("like")} className={cn("flex items-center gap-1.5 transition-colors hover:text-foreground", liked && "text-rose-500 hover:text-rose-500")} aria-label={liked ? "Unlike post" : "Like post"}>
                <Heart className={cn("size-4", liked && "fill-current")} />
                <span className="text-xs">{likes}</span>
            </button>
            {commentsEnabled && (
                <button type="button" onClick={onCommentsClick} className="flex items-center gap-1.5 transition-colors hover:text-foreground" aria-label="View comments">
                    <MessageCircle className="size-4" />
                    <span className="text-xs">{comments}</span>
                </button>
            )}
            <button type="button" onClick={() => void toggleInteraction("repost")} className={cn("flex items-center gap-1.5 transition-colors hover:text-foreground", reposted && "text-emerald-500 hover:text-emerald-500")} aria-label={reposted ? "Undo repost" : "Repost"}>
                <Repeat2 className="size-4" />
                <span className="text-xs">{reposts}</span>
            </button>
            {error && <span className="text-xs text-destructive">{error}</span>}
        </div>
    )
}

export default PostActions