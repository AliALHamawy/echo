'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { pb } from '@/lib/pocketbase'
import Link from 'next/link'

const Account = () => {
    const user = pb.authStore.record
    const name = user?.name || user?.username || 'Account'
    const avatar = user?.avatar && user?.collectionId
        ? pb.files.getURL(user, user.avatar)
        : undefined

    return (
        <Link
            href="/profile"
            aria-label="Open your profile"
            className="flex justify-start items-center md:border border-muted-foreground py-3 px-2 lg:px-3 gap-5 rounded-sm w-full hover:bg-muted transition-colors"
        >
                <Avatar className='h-8 w-8'>
                    <AvatarImage src={avatar} />
                    <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col">
                    <span className='text-sm text-foreground'>{name}</span>
                    <span className='text-xs text-muted-foreground'>@{user?.username || user?.userName || 'account'}</span>
                </div>
        </Link>
    )
}

export default Account      