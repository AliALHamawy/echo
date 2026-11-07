/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSupabaseBrowserClient } from "@/lib/supabase"

export type BackendRecord = {
    id: string
    created: string
    [key: string]: any
}

type AuthRecord = BackendRecord & {
    email?: string
    name?: string
    username?: string
    userName?: string
    avatar_url?: string
    avatar?: string
    cover?: string
    bio?: string
    settings?: unknown
}

function mapRecord(record: Record<string, unknown>, collection: string): BackendRecord {
    const mapped = { ...record }
    if (collection === "users") {
        mapped.name = mapped.full_name
        mapped.userName = mapped.username
        mapped.avatar = mapped.avatar_url
        mapped.cover = mapped.cover_url
        mapped.collectionId = "profiles"
    }
    if (collection === "posts") {
        mapped.author = mapped.author_id
        mapped.commentsEnabled = mapped.comments_enabled
    }
    if (collection === "comments") {
        mapped.author = mapped.author_id
        mapped.post = mapped.post_id
    }
    if (collection === "follows") {
        mapped.follower = mapped.follower_id
        mapped.following = mapped.following_id
    }
    if (collection === "post") {
        mapped.postInteractions = mapped.post_id
        mapped.author = mapped.user_id
    }
    return {
        ...mapped,
        id: String(mapped.id),
        created: String(mapped.created_at ?? mapped.created ?? new Date().toISOString()),
    }
}

function databaseCollection(name: string) {
    if (name === "users") return "profiles"
    if (name === "post") return "post_interactions"
    return name
}

function databaseValues(name: string, values: Record<string, unknown>) {
    const mapped = { ...values }
    const aliases: Record<string, Record<string, string>> = {
        users: { name: "full_name", userName: "username", avatar: "avatar_url", cover: "cover_url" },
        posts: { author: "author_id", commentsEnabled: "comments_enabled" },
        comments: { author: "author_id", post: "post_id" },
        follows: { follower: "follower_id", following: "following_id" },
        post: { postInteractions: "post_id", author: "user_id" },
    }
    for (const [from, to] of Object.entries(aliases[name] ?? {})) {
        if (from in mapped) {
            mapped[to] = mapped[from]
            delete mapped[from]
        }
    }
    return mapped
}

type NotificationAction =
    | {
        type: "follow"
        userId: string
        actorId: string
    }
    | {
        type: "like" | "comment" | "post"
        userId: string
        actorId: string
        postId: string
    }
    | {
        type: "mention"
        userId: string
        actorId: string
        postId: string
    }

async function insertNotificationSafely(action: NotificationAction): Promise<boolean> {
    try {
        const { error } = await createSupabaseBrowserClient()
            .from("notifications")
            .insert({
                user_id: action.userId,
                actor_id: action.actorId,
                type: action.type,
                ...(action.type !== "follow" ? { post_id: action.postId } : {}),
            })

        if (error) {
            console.error("Unable to create notification:", {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
            })
            return false
        }

        return true
    } catch (error) {
        console.error("Unable to create notification:", {
            message: error instanceof Error ? error.message : String(error),
            error,
        })
        return false
    }
}

async function createPostNotificationsForFollowers(postId: string, authorId: string) {
    try {
        console.info("[post notifications] Looking up followers", { postId, authorId })
        const client = createSupabaseBrowserClient()
        const { data: followers, error } = await client
            .from("follows")
            .select("follower_id")
            .eq("following_id", authorId)

        if (error) {
            console.error("Unable to load followers for post notifications:", error)
            return
        }

        const followerIds = (followers ?? [])
            .map((follower) => follower.follower_id)
            .filter((followerId): followerId is string => Boolean(followerId && followerId !== authorId))

        console.info("[post notifications] Followers found", {
            postId,
            authorId,
            followerCount: followerIds.length,
        })

        const results = await Promise.all(
            followerIds.map(async (followerId) => {
                const inserted = await insertNotificationSafely({
                    type: "post",
                    userId: followerId,
                    actorId: authorId,
                    postId,
                })

                console.info(
                    inserted
                        ? "[post notifications] Notification inserted"
                        : "[post notifications] Notification insert failed",
                    { postId, authorId, followerId }
                )
                return inserted
            })
        )

        console.info("[post notifications] Finished", {
            postId,
            authorId,
            followerCount: followerIds.length,
            insertedCount: results.filter(Boolean).length,
        })
    } catch (error) {
        console.error("Unable to create post follower notifications:", {
            message: error instanceof Error ? error.message : String(error),
            error,
            postId,
            authorId,
        })
    }
}

async function createNotificationsForRecord(
    name: string,
    values: Record<string, unknown>,
    record: Record<string, unknown>
) {
    try {
        const actorId = String(
            record.author_id ?? record.user_id ?? values.author ?? values.user_id ?? ""
        )
        if (!actorId) return

        if (name === "follows") {
            const followingId = String(record.following_id ?? values.following ?? "")
            if (followingId) {
                await insertNotificationSafely({
                    type: "follow",
                    userId: followingId,
                    actorId,
                })
            }
            return
        }

        if (name === "post") {
            if (values.kind !== "like") return
            const postId = String(record.post_id ?? values.postInteractions ?? "")
            if (!postId) return

            const { data: post } = await createSupabaseBrowserClient()
                .from("posts")
                .select("author_id")
                .eq("id", postId)
                .maybeSingle()
            if (post?.author_id && post.author_id !== actorId) {
                await insertNotificationSafely({
                    type: "like",
                    userId: post.author_id,
                    actorId,
                    postId,
                })
            }
            return
        }

        if (name !== "posts" && name !== "comments") return

        const postId = String(
            name === "posts"
                ? record.id ?? ""
                : record.post_id ?? values.post ?? ""
        )
        const content = String(record.content ?? values.content ?? "")
        const authorId = actorId
        if (name === "posts" && postId) {
            await createPostNotificationsForFollowers(postId, authorId)
        }

        if (name === "comments" && postId) {
            const { data: post } = await createSupabaseBrowserClient()
                .from("posts")
                .select("author_id")
                .eq("id", postId)
                .maybeSingle()
            if (post?.author_id) {
                await insertNotificationSafely({
                    type: "comment",
                    userId: post.author_id,
                    actorId: authorId,
                    postId,
                })
            }
        }

        const usernames = [...content.matchAll(/(?:^|[\s([{/-])@([A-Za-z0-9_]+)/g)].map((match) => match[1])
        if (usernames.length === 0 || !postId) return

        const { data: mentionedProfiles, error } = await createSupabaseBrowserClient()
            .from("profiles")
            .select("id, username")
            .in("username", [...new Set(usernames)])
        if (error) {
            console.error("Unable to resolve notification mentions:", error)
            return
        }

        for (const profile of mentionedProfiles ?? []) {
            if (profile.id !== authorId) {
                await insertNotificationSafely({
                    type: "mention",
                    userId: profile.id,
                    actorId: authorId,
                    postId,
                })
            }
        }
    } catch (error) {
        console.error("Unable to prepare notifications:", error)
    }
}

function matchesFilter(record: Record<string, unknown>, filter: string): boolean {
    const expression = filter.trim().replace(/^(\()([\s\S]*)(\))$/, "$2")
    const split = (operator: string) => {
        let depth = 0
        for (let index = 0; index <= expression.length - operator.length; index += 1) {
            if (expression[index] === "(") depth += 1
            if (expression[index] === ")") depth -= 1
            if (depth === 0 && expression.slice(index, index + operator.length) === operator) {
                return [expression.slice(0, index), expression.slice(index + operator.length)] as const
            }
        }
        return null
    }
    const orParts = split("||")
    if (orParts) return matchesFilter(record, orParts[0]) || matchesFilter(record, orParts[1])
    const andParts = split("&&")
    if (andParts) return matchesFilter(record, andParts[0]) && matchesFilter(record, andParts[1])
    const comparison = expression.match(/^(\w+)\s*(=|!=)\s*"([^"]*)"$/)
    if (!comparison) return true
    const [, field, operator, value] = comparison
    const actual = String(record[field] ?? "")
    return operator === "=" ? actual === value : actual !== value
}

export const backend = {
    authStore: {
        _record: null as AuthRecord | null,
        get record(): AuthRecord | null {
            return this._record
        },
        get token(): string {
            return ""
        },
        get isValid(): boolean {
            return Boolean(this._record)
        },
        async load() {
            const client = createSupabaseBrowserClient()
            const { data } = await client.auth.getSession()
            if (!data.session?.user) {
                this._record = null
                return null
            }

            const user = data.session.user
            const { data: profile } = await client.from("profiles").select("*").eq("id", user.id).maybeSingle()
            this._record = {
                ...(profile ?? {}),
                id: user.id,
                email: user.email,
                name: profile?.full_name ?? user.user_metadata?.full_name,
                username: profile?.username ?? user.user_metadata?.username,
                avatar_url: profile?.avatar_url,
                avatar: profile?.avatar_url,
                cover: profile?.cover_url,
                created: String(profile?.created_at ?? user.created_at),
            }
            return this._record
        },
        onChange(callback: () => void) {
            const { data } = createSupabaseBrowserClient().auth.onAuthStateChange(() => {
                void this.load().finally(callback)
            })
            return () => data.subscription.unsubscribe()
        },
        clear() {
            this._record = null
            void createSupabaseBrowserClient().auth.signOut()
        },
        save(..._args: unknown[]) {
            const record = _args[1]
            if (record && typeof record === "object") this._record = record as AuthRecord
        },
    },
    files: {
        getURL(record: any, file: string) {
            if (/^https?:\/\//i.test(file)) return file
            const { data } = createSupabaseBrowserClient().storage.from("media").getPublicUrl(`${record.id ?? "unknown"}/${file}`)
            return data.publicUrl
        },
    },
    collection(name: string) {
        const client = createSupabaseBrowserClient()
        const table = databaseCollection(name)

        return {
            async getFullList<T = BackendRecord>(options?: Record<string, any>) {
                const select = name === "posts"
                    ? "*, profiles(avatar_url, full_name, username)"
                    : name === "comments"
                        ? "*, profiles(avatar_url, full_name, username)"
                        : "*"
                const { data, error } = await (client as any).from(table).select(select)
                if (error) throw error
                let records: BackendRecord[] = (data as Record<string, unknown>[] ?? []).map((record: Record<string, unknown>) => {
                    const mapped = mapRecord(record, name)
                    const profile = record.profiles as Record<string, unknown> | null | undefined
                    if (profile) {
                        mapped.expand = {
                            author: mapRecord(profile, "users"),
                        }
                    }
                    return mapped
                })
                if (options?.filter) records = records.filter((record) => matchesFilter(record, options.filter))
                const sort = options?.sort
                if (sort) {
                    const field = sort.replace(/^-/, "")
                    records.sort((left: BackendRecord, right: BackendRecord) => {
                        const comparison = String(left[field] ?? "").localeCompare(String(right[field] ?? ""))
                        return sort.startsWith("-") ? -comparison : comparison
                    })
                }
                return records as T[]
            },
            async getList(_page = 1, _perPage = 30, options?: Record<string, any>) {
                const records = await this.getFullList(options)
                return {
                    items: records,
                    totalItems: records.length,
                }
            },
            async getOne<T = BackendRecord>(id: string, ..._args: unknown[]) {
                const { data, error } = await client.from(table).select("*").eq("id", id).single()
                if (error) throw error
                return mapRecord(data, name) as T
            },
            async getFirstListItem<T = BackendRecord>(..._args: unknown[]) {
                const filter = typeof _args[0] === "string" ? _args[0] : undefined
                const records = await this.getFullList({ filter })
                if (!records[0]) throw new Error("Record not found")
                return records[0] as T
            },
            async create<T = BackendRecord>(values: Record<string, any> | FormData, ..._args: unknown[]) {
                if (values instanceof FormData) throw new Error("File uploads are only supported when updating a user profile.")
                const { data, error } = await client.from(table).insert(databaseValues(name, values)).select().single()
                if (error) throw error
                void createNotificationsForRecord(name, values, data)
                return mapRecord(data, name) as T
            },
            async update<T = BackendRecord>(id: string, values: Record<string, any> | FormData, ..._args: unknown[]) {
                let updateValues: Record<string, unknown>
                if (values instanceof FormData && name === "users") {
                    updateValues = {
                        full_name: values.get("name"),
                        bio: values.get("bio"),
                    }
                    for (const field of ["avatar", "cover"] as const) {
                        const file = values.get(field)
                        if (!(file instanceof File) || file.size === 0) continue

                        const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin"
                        const path = `${id}/${field}-${crypto.randomUUID()}.${extension}`
                        const { error: uploadError } = await client.storage
                            .from("media")
                            .upload(path, file, {
                                contentType: file.type || "application/octet-stream",
                                upsert: false,
                            })
                        if (uploadError) throw uploadError

                        const { data: publicUrl } = client.storage.from("media").getPublicUrl(path)
                        updateValues[field === "avatar" ? "avatar_url" : "cover_url"] = publicUrl.publicUrl
                    }
                } else if (values instanceof FormData) {
                    throw new Error("File uploads are only supported when updating a user profile.")
                } else {
                    updateValues = databaseValues(name, values)
                }

                const { data, error } = await client.from(table).update(updateValues).eq("id", id).select().single()
                if (error) throw error
                return mapRecord(data, name) as T
            },
            async delete(id: string, ..._args: unknown[]) {
                const { error } = await client.from(table).delete().eq("id", id)
                if (error) throw error
            },
            subscribe(_event: string, _callback: (event: any) => void) {
                return Promise.resolve(() => {})
            },
        }
    },
}
