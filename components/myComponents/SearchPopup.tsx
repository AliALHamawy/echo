"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setSearchOpen } from "@/store/slices/uiSlice"
import { X } from "lucide-react"
import { SearchBar } from "@/components/myComponents/SearchBar"
import SearchTopics from "@/components/myComponents/SearchTopics"
import SearchRes from "@/components/myComponents/SearchRes"

const SearchPopup = () => {
    const [search, setSearch] = useState<string>("")
    const [recentSearches, setRecentSearches] = useState<string[]>(() => {
        if (typeof window === "undefined") return []
        const stored = window.localStorage.getItem("echo-recent-searches")
        if (!stored) return []
        try {
            const parsed = JSON.parse(stored)
            return Array.isArray(parsed)
                ? parsed.filter((item): item is string => typeof item === "string")
                : []
        } catch {
            window.localStorage.removeItem("echo-recent-searches")
            return []
        }
    })
    const dispatch = useAppDispatch()
    const router = useRouter()
    const isOpen = useAppSelector((state) => state.ui.isSearchOpen)

    const saveRecentSearch = (value: string) => {
        const normalized = value.trim()
        if (!normalized) return
        setRecentSearches((current) => {
            const next = [normalized, ...current.filter((item) => item !== normalized)].slice(0, 8)
            window.localStorage.setItem("echo-recent-searches", JSON.stringify(next))
            return next
        })
    }

    const submitSearch = (value = search) => {
        const query = value.trim()
        if (!query) return
        saveRecentSearch(query)
        const cleanQuery = query.replace(/^[@#]/, "")
        if (query.startsWith("@")) {
            router.push(`/search?q=${encodeURIComponent(cleanQuery)}&tab=users`)
        } else if (query.startsWith("#")) {
            router.push(`/search?q=${encodeURIComponent(query)}&tab=posts`)
        } else {
            router.push(`/search?q=${encodeURIComponent(query)}`)
        }
        dispatch(setSearchOpen(false))
    }

    if (!isOpen) return null
    return (
        <>
            <div className="absolute top-0 right-0 p-2 pt-20 bg-foreground/20 dark:bg-muted/60 text-muted-foreground border-border h-full w-full flex z-9999999 justify-center inset-0 backdrop-blur-sm">
                <div className="flex flex-col max-w-2xl w-full rounded-none bg-muted border border-border h-fit">
                    <div className="w-full flex justify-between border-b border-border items-center p-4">
                        <div className="text-sm font-light text-foreground">Search</div>
                        <X onClick={() => dispatch(setSearchOpen(false))} className="text-muted-foreground h-5 w-5" />
                    </div>
                    <div className="flex flex-col p-4 w-full gap-3">
                        <SearchBar
                            out={false}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    submitSearch()
                                }
                            }}
                        />
                        {search.trim().length === 0
                            ? <SearchTopics recentSearches={recentSearches} onSelect={(value) => {
                                setSearch(value)
                                submitSearch(value)
                            }} />
                            : <SearchRes query={search} onSelect={(value) => {
                                saveRecentSearch(value)
                                dispatch(setSearchOpen(false))
                            }} />}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchPopup