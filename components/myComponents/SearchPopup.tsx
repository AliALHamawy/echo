"use client"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setSearchOpen } from "@/store/slices/uiSlice"
import { X } from "lucide-react"
import { SearchBar } from "@/components/myComponents/SearchBar"
import SearchTopics from "@/components/myComponents/SearchTopics"
import SearchRes from "@/components/myComponents/SearchRes"

const SearchPopup = () => {
    const [search, setSearch] = useState<string>("")
    const dispatch = useAppDispatch()
    const isOpen = useAppSelector((state) => state.ui.isSearchOpen)
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
                        />
                        {search.trim().length === 0 ? <SearchTopics /> : <SearchRes />}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchPopup