
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";


export interface TrendingTopic {
    id: string;
    rank: string;
    title: string;
    postsCount: string;
}

export const trendingTopics: TrendingTopic[] = [
    {
        id: "1",
        rank: "01",
        title: "Design engineering",
        postsCount: "12.4K posts",
    },
    {
        id: "2",
        rank: "02",
        title: "Monochrome UI",
        postsCount: "8,912 posts",
    },
    {
        id: "3",
        rank: "03",
        title: "Edge runtimes",
        postsCount: "5,204 posts",
    },
    {
        id: "4",
        rank: "04",
        title: "Typography",
        postsCount: "3,881 posts",
    },
];

const TrendingCard = () => {
    return (
        <>
            <Card className="rounded-xl bg-background border overflow-hidden w-full max-w-sm p-0 gap-0">
                <div className="flex items-center px-3.5 py-2 border-b uppercase text-[11px] font-semibold text-muted-foreground select-none">
                    <TrendingUp size={14} className="mr-2" />
                    Trending topics
                </div>
                <ul className="flex flex-col divide-y divide-border/50 m-0 p-0 pt-1">
                    {trendingTopics.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center justify-between px-3.5 py-3 w-full hover:bg-muted/30 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-muted-foreground">{item.rank}</span>
                                <div className="flex flex-col justify-center">
                                    <span className="text-xs font-semibold text-foreground leading-tight">
                                        {item.title}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground leading-tight">
                                        {item.postsCount}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </Card>
        </>
    )
}

export default TrendingCard