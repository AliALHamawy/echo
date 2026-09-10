
"use client"
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TermsPrivacyHeader = () => {
    const pathName = usePathname()
    return (
        <div className="header border-b border-border p-2 py-4 flex justify-between items-center w-full">
            <Link href="/" className='flex gap-1 justify-center items-center text-xs text-muted-foreground hover:text-primary group'><ArrowLeft className='h-4 w-4 transition-all duration-500 group-hover:-translate-x-[2px]' /> Back to App</Link>
            <div className="flex gap-3 justify-center items-center">
                <Link href="/terms" className={cn('text-xs text-muted-foreground hover:text-primary group p-2 rounded-2xl', pathName === "/terms" ? 'bg-muted' : '')}>Terms</Link>
                <Link href="/privacy" className={cn('text-xs text-muted-foreground hover:text-primary group p-2 rounded-2xl', pathName === "/privacy" ? 'bg-muted' : '')}>Privacy</Link>
            </div>
        </div>
    )
}

export default TermsPrivacyHeader