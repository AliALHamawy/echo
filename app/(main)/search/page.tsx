"use client"
import { SearchBar } from "@/components/myComponents/SearchBar"
import SearchPostsRes from "@/components/myComponents/SearchPostsRes"
import SearchRes from "@/components/myComponents/SearchRes"
import { useState } from "react"

const page = () => {
    const [res, setRes] = useState<"people" | "post">("post")
    return (
        <>
            <div className="flex flex-col w-full justify-start items-center min-h-screen gap-4">
                <div className="flex flex-col w-full items-ctart gap-4 p-4 border-b-2 border-border">
                <SearchBar out={true} />
                <h1 className="text-2xl text-primary font-black tracking-wide">Search for “ali”</h1>
                <div className="flex w-full gap-2 items-center justify-start">
                    <span onClick={() => setRes("post")}>Posts</span>
                    <span onClick={() => setRes("people")}>Peoples</span>
                </div>
                </div>
                <div className="flex flex-col w-full items-senter justify-start p-4 py-2">
                    {res === "people" ? <SearchRes /> : <SearchPostsRes />}
                </div>
            </div>
        </>
    )
}

export default page