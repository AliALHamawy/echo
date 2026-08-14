import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Ellipsis, Flag, Heart, MessageCircle, Repeat2, Sparkles } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { SparklesOff } from "./SparklesOff";

export interface Post {
    id: string;
    name: string;
    userName: string;
    userAvatar: string;
    postDescription: string;
    postImage?: string;
    createdAt: string;
    numberOfLikes: number;
    numberOfComments: number;
    numberOfShares: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
    repost: number;
}

interface MyCardProps {
    post: Post;
}

const MyCard = ({ post }: MyCardProps) => {
    const { userAvatar, name, userName, createdAt, postDescription, numberOfLikes, numberOfComments, repost } = post;

    return (
        <Card className="rounded-none p-5 bg-transparent border border-border transition-[0.3s] hover:border-foreground/15 outline-none">
            <div className="flex justify-between items-center">
                <div className="flex justify-start items-center gap-3">
                    <Avatar className='h-8 w-8'>
                        <AvatarImage src={userAvatar} />
                        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className='text-sm text-foreground leading-tight'>{name}</span>
                        <span className='text-xs text-muted-foreground'>{userName}</span>
                    </div>
                    <span className='text-xs text-muted-foreground ml-2'>• {createdAt}</span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="outline-none hover:bg-muted/50 h-7 w-7 flex items-center justify-center group rounded-sm transition-colors">
                            <Ellipsis className="text-foreground/40 transition-[0.3s] group-hover:text-foreground" width={17} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-none">
                        <DropdownMenuItem className="justify-between focus:bg-[#96ff963b] rounded-none cursor-pointer">
                            Interested
                            <Sparkles className="size-4" />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="justify-between rounded-none cursor-pointer">
                            Not interested
                            <SparklesOff className="size-4" />
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" className="justify-between rounded-none cursor-pointer">
                            Report
                            <Flag className="size-4" />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <CardContent className="px-0 py-3 text-sm text-foreground/90">
                {postDescription}
            </CardContent>

            <div className="flex items-center gap-6 text-foreground/40">
                <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
                    <Heart className="size-4" />
                    <span className="text-xs">{numberOfLikes}</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
                    <MessageCircle className="size-4" />
                    <span className="text-xs">{numberOfComments}</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
                    <Repeat2 className="size-4" />
                    <span className="text-xs">{repost}</span>
                </div>
            </div>
        </Card>
    )
}

export default MyCard;