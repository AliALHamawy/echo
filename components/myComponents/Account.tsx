'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const Account = () => {
    return (
        <>
            <div className="flex justify-start items-center md:border border-mutated-foreground py-3 px-2 lg:px-3 gap-5 rounded-sm w-full">
                <Avatar className='h-8 w-8'>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col">
                    <span className='text-sm text-foreground'>Ali AL-Hamawy</span>
                    <span className='text-xs text-muted-foreground'>@ali_alhamawy</span>
                </div>
            </div>
        </>
    )
}

export default Account