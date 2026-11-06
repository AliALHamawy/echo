 "use client"

import { useEffect, useState } from "react"

export function useDelayedLoading(isLoading: boolean, thresholdMs = 150) {
    const [showSkeleton, setShowSkeleton] = useState(false)

    useEffect(() => {
        if (!isLoading) {
            queueMicrotask(() => setShowSkeleton(false))
            return
        }

        const timer = window.setTimeout(() => setShowSkeleton(true), thresholdMs)
        return () => window.clearTimeout(timer)
    }, [isLoading, thresholdMs])

    return showSkeleton
}
