import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Ellipsis, Flag, Sparkles } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { SparklesOff } from "./SparklesOff";


const MyCard = () => {
    return (
        <>
            <Card className="rounded-none p-5 bg-transparent border border-border transition-[0.3s] hover:border-foreground/15 outline-none">
                <div className="flex justify-between">
                    <div className="flex justify-start items-center  gap-5 rounded-sm ">
                        <Avatar className='h-8 w-8'>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="hidden md:flex flex-col">
                            <span className='text-sm text-foreground'>Ali AL-Hamawy</span>
                            <span className='text-xs text-muted-foreground'>@ali_alhamawy</span>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="outline-none hover:bg-muted/50 h-6 w-6 flex items-center justify-center group">
                                <Ellipsis className="text-foreground/20 transition-[0.3s] group-hover:text-foreground" width={17}/>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-none">
                            <DropdownMenuItem className="justify-between focus:bg-[#96ff963b] rounded-none">
                                intersted
                                <Sparkles />
                            </DropdownMenuItem>
                            <DropdownMenuItem className="justify-between rounded-none">
                                not intersted
                                <SparklesOff />
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" className="justify-between rounded-none">
                                repot
                                <Flag />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <CardContent>
                    Just finished refactoring the navigation bar layout with custom Framer Motion hover effects and circular view transitions! 🚀✨
                </CardContent>
            </Card>
        </>
    )
}

export default MyCard