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
                    ? "*, profiles(*)"
                    : name === "comments"
                        ? "*, profiles(*)"
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
