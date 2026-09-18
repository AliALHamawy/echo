"use client"

import { pb } from "@/lib/pocketbase"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        const checkAuth = () => {
            if (!pb.authStore.isValid) {
                router.replace("/auth")
                return
            }

            setIsChecking(false)
        }

        checkAuth()
        return pb.authStore.onChange(() => checkAuth())
    }, [router])

    if (isChecking) {
        return null
    }

    return children
}

export default AuthGuard