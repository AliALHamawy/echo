
import { Search, TrendingUp } from "lucide-react"
import { AvatarFallback, Avatar } from "@/components/ui/avatar"

interface SearchTopicsProps {
    recentSearches?: string[]
    onSelect?: (query: string) => void
}

interface TrendingTypes {
    id: number;
    str: string
}

const Trending:TrendingTypes[] =[
    {id:1 , str: "MonochromeUI"},
    {id:2 , str: "DesignEngineering"},
    {id:3 , str: "EdgeRuntimes"},
    {id:4 , str: "Typography"},
]

const SearchTopics = ({ recentSearches = [], onSelect }: SearchTopicsProps) => {
    return (
        <>
            <div className="flex flex-col w-full items-start gap-2">
                <div className="flex items-center  text-xs">
                    <Search size={14} className="mr-2" />
                    Last search
                </div>
                {recentSearches.length > 0 ? (
                    <div className="flex flex-wrap gap-1 items-center w-full">
                        {recentSearches.map((search) => (
                            <button
                                key={search}
                                type="button"
                                onClick={() => onSelect?.(search)}
                                className="border text-xs p-1 h-fit border-border rounded-none bg-muted-foreground/10 hover:bg-muted-foreground/20"
                            >
                                {search}
                            </button>
                        ))}
                    </div>
                ) : <p className="text-xs text-muted-foreground">No recent searches.</p>}
            </div>
            <div className="flex flex-col gap-4 w-full items-start">
                <div className="flex items-center text-xs">
                    <TrendingUp size={14} className="mr-2" />
                    Trending topics
                </div>
                <div className="flex flex-col gap-2 w-full items-start">
                    {Trending.map((item) => (
                        <div className="flex gap-2 items-center" key={item.id}>
                            <Avatar >
                                <AvatarFallback className="text-xl bg-muted-foreground/20">#</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-1 items-start">
                                <span className="text-primary text-md">#{item.str}</span>
                                <span className="text-muted-forground text-xs">Trending</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default SearchTopics