'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { backend } from '@/lib/backend'
import Link from 'next/link'

const Account = () => {
    const user = backend.authStore.record
    const name = user?.name || user?.username || 'Account'
    const avatarPath = user?.avatar_url ?? user?.avatar
    const avatar = avatarPath
        ? backend.files.getURL(user, avatarPath)
        : undefined

    return (
        <Link
            href="/profile"
            aria-label="Open your profile"
            className="flex justify-start items-center md:border border-border py-3 px-2 lg:px-3 gap-5 rounded-sm w-full hover:bg-muted transition-colors"
        >
                <Avatar className='h-8 w-8'>
                    {avatar ? <AvatarImage src={avatar} alt={`${name}'s avatar`} /> : null}
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