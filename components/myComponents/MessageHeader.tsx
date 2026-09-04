
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Ban, BellOff, Ellipsis, User, ChevronLeft } from "lucide-react";
import Link from 'next/link';

interface MessageHeaderProps {
    name: string;
    username: string;
    lastSeen: string;
    avtarImage: string;
    avatarFallback: string;
}

const MessageHeader = ({ name, username, lastSeen, avtarImage, avatarFallback }: MessageHeaderProps) => {
  return (
    <>
        <div className="head border-b border-border p-3 py-4 flex items-center justify-between w-full">
                <div className="left flex items-center gap-3 justify-start">
                    <Link href="/messages">
                    <ChevronLeft className='h-6 w-6 text-muted-foreground transition-colors duration-300 hover:text-foreground' />
                    </Link>
                    <div className="flex justify-start items-center gap-3">
                    <Avatar className='h-8 w-8'>
                        <AvatarImage src={avtarImage} />
                        <AvatarFallback>{avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className='text-sm text-foreground leading-tight'>{name}</span>
                        <span className='text-xs text-muted-foreground'>{username}</span>
                    </div>
                    {lastSeen &&<span className='text-xs text-muted-foreground ml-2'>{lastSeen}</span>}
                </div>
                </div>
                <div className="right">
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="outline-none hover:bg-muted/50 h-7 w-7 flex items-center justify-center group rounded-sm transition-colors">
                            <Ellipsis className="text-foreground/40 transition-[0.3s] group-hover:text-foreground" width={17} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-none w-40">
                        <DropdownMenuItem className="justify-between rounded-none">
                            View Profile
                            <User className="size-4" />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="justify-between rounded-none">
                            Mute
                            <BellOff className="size-4" />
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" className="justify-between rounded-none">
                            Block
                            <Ban className="size-4" />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
            </div>
    </>
  )
}

export default MessageHeader