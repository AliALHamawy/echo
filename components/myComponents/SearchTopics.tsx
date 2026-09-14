
import { Search, TrendingUp } from "lucide-react"
import { AvatarFallback, Avatar } from "@/components/ui/avatar"

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

const SearchTopics = () => {
    return (
        <>
            <div className="flex flex-col w-full items-start gap-2">
                <div className="flex items-center  text-xs">
                    <Search size={14} className="mr-2" />
                    Last search
                </div>
                <div className="flex gap-1 items-center w-full">
                    <div className="border text-xs p-1 h-fit border-border tounded-none bg-muted-forground">
                        ss
                    </div>
                </div>
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