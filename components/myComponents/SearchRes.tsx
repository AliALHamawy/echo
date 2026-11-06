"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SearchSkeleton } from "@/components/ui/skeletons/SearchSkeleton"
import { backend } from "@/lib/backend"
import { useDelayedLoading } from "@/lib/loading"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export interface SearchUser {
    id: string
    name: string
    username: string
    avatar: string
}

interface SearchResProps {
    query?: string
    onSelect?: (query: string) => void
}

export default function SearchRes({ query, onSelect }: SearchResProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const searchQuery = query ?? searchParams.get("q") ?? ""
    const [users, setUsers] = useState<SearchUser[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const term = searchQuery.trim().replace(/^@/, "")
    const showSkeleton = useDelayedLoading(loading && Boolean(term))

    useEffect(() => {
        queueMicrotask(() => {
            setLoading(true)
            setError("")
        })
        let cancelled = false
        const timer = window.setTimeout(async () => {
            setLoading(true)
            setError("")
            try {
                if (!term) {
                    if (!cancelled) setUsers([])
                    return
                }

                const client = createSupabaseBrowserClient()
                const { data, error: queryError } = await client
                    .from("profiles")
                    .select("id, full_name, username, avatar_url")
                    .or(`full_name.ilike.%${term}%,username.ilike.%${term}%`)
                    .limit(8)
                if (queryError) throw queryError
                if (cancelled) return

                setUsers((data ?? []).map((profile) => ({
                    id: profile.id,
                    name: profile.full_name || profile.username || "Echo user",
                    username: profile.username || "account",
                    avatar: profile.avatar_url
                        ? backend.files.getURL(profile, profile.avatar_url)
                        : "",
                })))
            } catch (queryError) {
                if (!cancelled) {
                    setUsers([])
                    setError(queryError instanceof Error ? queryError.message : "Could not search users.")
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }, 250)

        return () => {
            cancelled = true
            window.clearTimeout(timer)
        }
    }, [searchQuery, term])

    const handleSelect = (user: SearchUser) => {
        onSelect?.(`@${user.username}`)
        router.push(`/profile/${user.id}`)
    }

    if (showSkeleton) return <SearchSkeleton />
    if (error) return <p className="text-sm text-destructive">{error}</p>
    if (users.length === 0) return <p className="text-sm text-muted-foreground">No matching users.</p>

    return (
        <div className="flex w-full flex-col items-start gap-3">
            {users.map((user) => (
                <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelect(user)}
                    className="flex w-full cursor-pointer items-center gap-2 text-left"
                >
                    <Avatar className="h-13 w-13">
                        {user.avatar ? <AvatarImage src={user.avatar} alt={`${user.name}'s avatar`} /> : null}
                        <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="flex flex-col items-start justify-center gap-1">
                        <span className="text-sm text-primary">{user.name}</span>
                        <span className="text-xs text-muted-foreground">@{user.username}</span>
                    </span>
                </button>
            ))}
        </div>
    )
}
