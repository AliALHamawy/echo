import AuthRightMid from "@/components/myComponents/authRightMid"
import Logo from "@/components/myComponents/Logo"
import { MessageCircle } from "lucide-react"

const page = () => {
    return (
        <>
            <div>
                <div className="flex min-h-screen w-full mx-auto">
                    <div className="min-h-full w-1/2 border-r border-border bg-muted/16 p-12 relative">
                        <div
                            className="pointer-events-none absolute -left-24 -top-24 size-[28rem] rounded-full opacity-60 blur-3xl"
                            style={{
                                background: "radial-gradient(circle, color-mix(in oklab, var(--foreground) 12%, transparent), transparent 70%)"
                            }}
                            data-tsd-source="/src/components/social/auth-view.tsx:129:9"
                        />                        <div className="flex flex-col w-full items-start justify-between h-full max-w-md">
                            <Logo myClassName="text-3xl h-9 w-9" />
                            <AuthRightMid />
                            <span className="text-xs text-muted-foreground">© 2026 Echo. Built for calm conversation.</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page