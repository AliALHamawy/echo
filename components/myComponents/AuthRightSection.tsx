"use client"
import { cn } from "@/lib/utils"
import { useState } from "react"
import SignIn from "@/components/myComponents/SignIn"
import CreateAccount from "@/components/myComponents/CreateAccount"
import { motion } from "motion/react"

const AuthRightSection = () => {
    const [user, setUser] = useState<"signIn" | "createAccount">("signIn")

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            {/* تم تصحيح flex-row-gap-0 إلى flex flex-row gap-0 */}
            <div className="relative flex flex-row gap-0 bg-muted/20 p-1 border border-border rounded-none w-full">

                {/* Sign In Button */}
                <button
                    type="button"
                    className={cn(
                        "relative w-1/2 py-1.5 text-sm font-medium transition-colors duration-200 z-10 flex items-center justify-center overflow-hidden",
                        user === "signIn" ? "text-primary" : "text-muted-foreground hover:text-primary"
                    )}
                    onClick={() => setUser("signIn")}
                >
                    <span className="relative z-20">Sign In</span>
                    {user === "signIn" && (
                        <motion.div
                            layoutId="activeTabBackground"
                            className="absolute inset-0 bg-background shadow-sm z-10"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                    )}
                </button>

                {/* Create Account Button */}
                <button
                    type="button"
                    className={cn(
                        "relative w-1/2 py-1.5 text-sm font-medium transition-colors duration-200 z-10 flex items-center justify-center overflow-hidden",
                        user === "createAccount" ? "text-primary" : "text-muted-foreground hover:text-primary"
                    )}
                    onClick={() => setUser("createAccount")}
                >
                    <span className="relative z-20">Create Account</span>
                    {user === "createAccount" && (
                        <motion.div
                            layoutId="activeTabBackground"
                            className="absolute inset-0 bg-background shadow-sm z-10"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                    )}
                </button>
            </div>
            {user === "signIn" ? <SignIn /> : <CreateAccount />}
        </div>
    )
}

export default AuthRightSection