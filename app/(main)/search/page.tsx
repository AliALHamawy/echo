"use client"
import { SearchBar } from "@/components/myComponents/SearchBar"
import SearchPostsRes from "@/components/myComponents/SearchPostsRes"
import SearchRes from "@/components/myComponents/SearchRes"
import { useState } from "react"
import { motion } from "framer-motion"
import { twMerge } from "tailwind-merge"

type FilterTab = "post" | "people"

const Page = () => {
    const [res, setRes] = useState<FilterTab>("post")

    const tabs: { id: FilterTab; label: string }[] = [
        { id: "post", label: "Posts" },
        { id: "people", label: "People" },
    ]

    return (
        <div className="flex flex-col w-full justify-start items-center min-h-screen gap-4">
            <div className="flex flex-col w-full items-start gap-4 p-4 border-b border-border">
                <SearchBar out={true} />
                <h1 className="text-2xl text-primary font-black tracking-wide">Search for “ali”</h1>

                <div className="flex w-fit bg-background gap-1">
                    {tabs.map((tab) => {
                        const isActive = res === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setRes(tab.id)}
                                className={twMerge(
                                    "relative text-sm p-1 px-2 rounded-xl transition-colors duration-200 capitalize select-none font-medium z-10 ",
                                    isActive ? "text-background" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <span className="relative z-10 text-xs">{tab.label}</span>

                                {isActive && (
                                    <motion.div
                                        layoutId="search-active-pill"
                                        className="absolute inset-0 bg-foreground rounded-xl z-0"
                                        transition={{
                                            type: "spring",
                                            stiffness: 380,
                                            damping: 30,
                                        }}
                                    />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="flex flex-col w-full items-center justify-start p-4 py-2">
                {res === "people" ? <SearchRes /> : <SearchPostsRes />}
            </div>
        </div>
    )
}

export default Page