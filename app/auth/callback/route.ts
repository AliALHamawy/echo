import { createSupabaseServerClient } from "@/lib/supabase-server"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const errorDescription = requestUrl.searchParams.get("error_description")

    if (errorDescription) {
        return NextResponse.redirect(
            new URL(`/auth?error=${encodeURIComponent(errorDescription)}`, requestUrl.origin)
        )
    }

    if (!code) {
        return NextResponse.redirect(
            new URL("/auth?error=Authentication%20callback%20did%20not%20include%20a%20code.", requestUrl.origin)
        )
    }

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
        return NextResponse.redirect(
            new URL(`/auth?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
        )
    }

    return NextResponse.redirect(new URL("/", requestUrl.origin))
}
