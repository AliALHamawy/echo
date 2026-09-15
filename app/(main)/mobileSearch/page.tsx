"use client"

import { useState } from "react"
import { SearchBar } from "@/components/myComponents/SearchBar"
import SearchRes from "@/components/myComponents/SearchRes"
import SearchTopics from "@/components/myComponents/SearchTopics"

const page = () => {
    const [search, setSearch] = useState<string>("")
    return (
        <>
            <div className="flex flex-col w-full min-h-screen items-start justify-start p-2 gap-3">
                <SearchBar
                            out={false}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search.trim().length === 0 ? <SearchTopics /> : <SearchRes />}
                
            </div>
        </>
    )
}

export default page