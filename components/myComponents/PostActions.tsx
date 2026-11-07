"use client"

import { Heart, MessageCircle, Repeat2 } from "lucide-react"
import { useEffect, useState } from "react"
import { backend } from "@/lib/backend"
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
        const user = backend.authStore.record
        if (!user) return

        const loadInteractions = async () => {
            try {
                const [interactionRecords, repostRecords] = await Promise.all([
                    backend.collection("post").getFullList<{
                        postInteractions: string
                        author: string
                        kind: "like" | "repost"
                    }>({ requestKey: null }),
                    backend.collection("reposts").getFullList<{
                        post_id: string
                        user_id: string
                    }>({ requestKey: null }),
                ])
                const records = interactionRecords
                const currentReposts = repostRecords.filter((record) => record.post_id === postId)
                const interactionReposts = records.filter((record) => record.postInteractions === postId && record.kind === "repost")
                const repostAuthors = new Set(currentReposts.map((record) => record.user_id))
                interactionReposts.forEach((record) => repostAuthors.add(record.author))
                const postInteractions = records.filter((record) => record.postInteractions === postId)
                setLikes(postInteractions.filter((record) => record.kind === "like").length)
                setReposts(repostAuthors.size)
                setLiked(postInteractions.some((record) => record.author === user.id && record.kind === "like"))
                setReposted(currentReposts.some((record) => record.user_id === user.id) || interactionReposts.some((record) => record.author === user.id))
            } catch {
                // Keep the post's initial values if interaction hydration is unavailable.
            }
        }

        void loadInteractions()
    }, [postId])

    const toggleInteraction = async (kind: "like" | "repost") => {
        const user = backend.authStore.record
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
            if (kind === "repost") {
                const filter = `post_id = "${postId}" && user_id = "${user.id}"`
                const existing = await backend.collection("reposts").getFirstListItem(filter).catch(() => null)
                const legacyFilter = `postInteractions = "${postId}" && author = "${user.id}" && kind = "repost"`
                const legacyExisting = await backend.collection("post").getFirstListItem(legacyFilter).catch(() => null)
                if (nextActive && !existing && !legacyExisting) {
                    await backend.collection("reposts").create({ post_id: postId, user_id: user.id })
                } else if (!nextActive) {
                    if (existing) await backend.collection("reposts").delete(existing.id)
                    if (legacyExisting) await backend.collection("post").delete(legacyExisting.id)
                }
            } else {
                const filter = `postInteractions = "${postId}" && author = "${user.id}" && kind = "${kind}"`
                const existing = await backend.collection("post").getFirstListItem(filter).catch(() => null)
                if (nextActive && !existing) {
                    await backend.collection("post").create({ postInteractions: postId, author: user.id, kind })
                } else if (!nextActive && existing) {
                    await backend.collection("post").delete(existing.id)
                }
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