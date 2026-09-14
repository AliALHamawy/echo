"use client"

import { useRef } from "react"
import { Provider } from "react-redux"
import { makeStore, AppStore } from "./index"

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    const storRef = useRef<AppStore | null>(null)

    if (!storRef.current) {
        storRef.current = makeStore()
    }

    return <Provider store={storRef.current}>{children}</Provider>
}