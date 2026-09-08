import { twMerge } from 'tailwind-merge'
import { TextAnimate } from '../ui/text-animate'
import EchoIcon from './echo-icon'
import { cn } from '@/lib/utils';
interface LogoProps {
    myClassName?: string;
}
const Logo = ({ myClassName }: LogoProps) => {
    return (
        <>
            <div className="logoContainer flex items-center gap-2 text-foreground font-medium px-3">
                <EchoIcon className={cn("bg-accent-foreground text-accent h-7 w-7 min-w-7 p-1 rounded-sm ",myClassName)} />
                <TextAnimate animation="slideLeft" by="character" className={twMerge('hidden md:flex', myClassName)}>
                    Echo
                </TextAnimate>
            </div>
        </>
    )
}

export default Logo