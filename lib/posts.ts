import type { RecordModel } from "pocketbase"
import { getPocketBaseErrorMessage, pb } from "@/lib/pocketbase"

export interface Post {
    id: string
    authorId: string
    name: string
    userName: string
    userAvatar: string
    postDescription: string
    createdAt: string
    numberOfLikes: number
    numberOfComments: number
    numberOfShares: number
    repost: number
    commentsEnabled: boolean
    likedByViewer: boolean
    repostedByViewer: boolean
}

type PostRecord = RecordModel & {
    author: string
    content: string
    commentsEnabled?: boolean
    likes?: number
    comments?: number
    reposts?: number
    numberOfLikes?: number
    numberOfComments?: number
    repost?: number
    likedByViewer?: boolean
    repostedByViewer?: boolean
    expand?: {
        author?: RecordModel & {
            name?: string
            username?: string
            userName?: string
            avatar?: string
        }
    }
}

export function formatPostTime(created: string) {
    const elapsedSeconds = Math.max(0, (Date.now() - new Date(created).getTime()) / 1000)
    const units = [
        { label: "d", seconds: 86400 },
        { label: "h", seconds: 3600 },
        { label: "m", seconds: 60 },
    ]

    for (const unit of units) {
        if (elapsedSeconds >= unit.seconds) {
            return `${Math.floor(elapsedSeconds / unit.seconds)}${unit.label}`
        }
    }

    return "Just now"
}

export async function fetchFeedPosts(): Promise<{ posts: Post[]; error: string | null }> {
    try {
        const records = await pb.collection("posts").getFullList({
            sort: "-created",
            expand: "author",
            requestKey: null,
        })

        return {
            posts: records.map(toPost),
            error: null,
        }
    } catch (error) {
        return {
            posts: [],
            error: getPocketBaseErrorMessage(error, "Could not load posts."),
        }
    }
}

export function toPost(record: RecordModel): Post {
    const post = record as PostRecord
    const author = post.expand?.author
    const name = author?.name || author?.username || author?.userName || "Echo user"
    const username = author?.username || author?.userName || "account"
    const userAvatar = author?.avatar && author.collectionId
        ? pb.files.getURL(author, author.avatar)
        : ""

    return {
        id: post.id,
        authorId: post.author,
        name,
        userName: `@${username}`,
        userAvatar,
        postDescription: post.content,
        createdAt: formatPostTime(post.created),
        numberOfLikes: post.numberOfLikes ?? post.likes ?? 0,
        numberOfComments: post.numberOfComments ?? post.comments ?? 0,
        numberOfShares: 0,
        repost: post.repost ?? post.reposts ?? 0,
        commentsEnabled: post.commentsEnabled !== false,
        likedByViewer: post.likedByViewer === true,
        repostedByViewer: post.repostedByViewer === true,
    }
}