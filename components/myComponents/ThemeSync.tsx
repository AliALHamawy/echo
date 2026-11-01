"use client"

import { backend } from "@/lib/backend"
import { applyTheme, type ThemePreference } from "@/lib/theme"
import { useEffect } from "react"

const ThemeSync = () => {
    useEffect(() => {
        const syncTheme = () => {
            const preference = (backend.authStore.record?.settings as { theme?: ThemePreference } | undefined)?.theme || "dark"
            applyTheme(preference)
        }

        syncTheme()
        const unsubscribe = backend.authStore.onChange(syncTheme)
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        mediaQuery.addEventListener("change", syncTheme)

        return () => {
            unsubscribe()
            mediaQuery.removeEventListener("change", syncTheme)
        }
    }, [])

    return null
}

export default ThemeSync