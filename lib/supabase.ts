import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let browserClient: SupabaseClient | undefined

function getSupabaseEnv() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !anonKey) {
        throw new Error(
            "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable."
        )
    }

    return { url, anonKey }
}

export function createSupabaseBrowserClient() {
    if (!browserClient) {
        const { url, anonKey } = getSupabaseEnv()
        browserClient = createBrowserClient(url, anonKey)
    }

    return browserClient
}
