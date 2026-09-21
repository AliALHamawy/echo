import AuthLeftMid from "@/components/myComponents/AuthLeftMid"
import ForgotPassword from "@/components/myComponents/ForgotPassword"
import Logo from "@/components/myComponents/Logo"

const ForgotPasswordPage = () => {
    return (
        <div className="flex min-h-screen w-full mx-auto">
            <div className="min-h-full w-1/2 border-r border-border bg-muted/16 p-12 relative hidden lg:flex">
                <div className="flex flex-col w-full items-start justify-between h-full max-w-md">
                    <Logo myClassName="text-3xl h-9 w-9" />
                    <AuthLeftMid />
                    <span className="text-xs text-muted-foreground">© 2026 Echo. Built for calm conversation.</span>
                </div>
            </div>
            <div className="min-h-full w-full lg:w-1/2 p-8 sm:p-12 relative max-w-md mx-auto flex items-center">
                <ForgotPassword />
            </div>
        </div>
    )
}

export default ForgotPasswordPage
