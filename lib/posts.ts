import type { BackendRecord } from "@/lib/backend"
import { backend } from "@/lib/backend"

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

type PostRecord = BackendRecord & {
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
        author?: BackendRecord & {
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
        const [records, repostRecords] = await Promise.all([
            backend.collection("posts").getFullList({
                sort: "-created",
                expand: "author",
                requestKey: null,
            }),
            backend.collection("reposts").getFullList<{
                post_id: string
                user_id: string
            }>({ requestKey: null }),
        ])
        const currentUserId = backend.authStore.record?.id
        const repostsByPost = new Map<string, { count: number; viewerReposted: boolean }>()
        for (const repost of repostRecords) {
            const current = repostsByPost.get(repost.post_id) ?? { count: 0, viewerReposted: false }
            current.count += 1
            current.viewerReposted ||= repost.user_id === currentUserId
            repostsByPost.set(repost.post_id, current)
        }

        return {
            posts: records.map((record) => {
                const post = toPost(record)
                const repost = repostsByPost.get(post.id)
                return {
                    ...post,
                    repost: repost?.count ?? post.repost,
                    repostedByViewer: repost?.viewerReposted ?? post.repostedByViewer,
                }
            }),
            error: null,
        }
    } catch (error) {
        return {
            posts: [],
            error: error instanceof Error ? error.message : "Could not load posts.",
        }
    }
}

export function toPost(record: BackendRecord): Post {
    const post = record as PostRecord
    const author = post.expand?.author
    const name = author?.name || author?.username || author?.userName || "Echo user"
    const username = author?.username || author?.userName || "account"
    const userAvatar = author?.avatar && author.collectionId
        ? backend.files.getURL(author, author.avatar)
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