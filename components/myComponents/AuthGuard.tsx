"use client"

import { backend } from "@/lib/backend"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        const checkAuth = () => {
            if (!backend.authStore.isValid) {
                router.replace("/auth")
                return
            }

            setIsChecking(false)
        }

        void backend.authStore.load().then(checkAuth)
        return backend.authStore.onChange(() => checkAuth())
    }, [router])

    if (isChecking) {
        return null
    }

    return children
}

export default AuthGuard