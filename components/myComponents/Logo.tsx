import EchoIcon from './echo-icon'

const Logo = () => {
    return (
        <>
            <div className="logoContainer flex items-center gap-2 text-foreground font-medium px-3">
                <EchoIcon className="bg-accent-foreground text-accent h-7 w-7 min-w-7 p-1 rounded-sm " />
                <p className='hidden md:flex'>
                Echo
                </p>
            </div>
        </>
    )
}

export default Logo