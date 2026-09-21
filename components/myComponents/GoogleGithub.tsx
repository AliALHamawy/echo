
"use client"

import { pb } from "@/lib/pocketbase"
import { useRouter } from "next/navigation"
import { useState } from "react"
import AuthAlert from "@/components/myComponents/AuthAlert"

const GoogleGithub = () => {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState<"google" | "github" | null>(null)

  const getErrorMessage = (error: unknown, provider: string) => {
    if (error && typeof error === "object" && "response" in error) {
      const response = (error as { response?: { message?: string; data?: { message?: string } } }).response
      return response?.message || response?.data?.message || `Unable to connect with ${provider}.`
    }

    return error instanceof Error ? error.message : `Unable to connect with ${provider}.`
  }

  const generateUsername = (value: string) => {
    const namePart = value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 24)

    return `${namePart || "user"}-${crypto.randomUUID().replaceAll("-", "").slice(0, 6)}`
  }

  const handleOAuth = (provider: "google" | "github") => {
    setError("")
    setIsLoading(provider)

    const oauthWindow = window.open("about:blank", "echo-oauth", "popup,width=500,height=700")

    if (!oauthWindow) {
      setError("Your browser blocked the Google/GitHub sign-in popup. Allow popups for this site and try again.")
      setIsLoading(null)
      return
    }

    pb.collection("users").authWithOAuth2({
      provider,
      urlCallback: (url) => {
        oauthWindow.location.href = url
      },
    })
      .then(async (authData) => {
        const record = authData.record as typeof authData.record & {
          userName?: string
          username?: string
          name?: string
          email?: string
        }
        const currentUsername = record.userName || record.username

        if (!currentUsername) {
          const username = generateUsername(record.name || record.email || provider)
          const updatedRecord = await pb.collection("users").update(record.id, { userName: username })
          pb.authStore.save(pb.authStore.token, updatedRecord)
        }

        router.push("/")
      })
      .catch((err) => {
        setError(getErrorMessage(err, provider))
        oauthWindow.close()
      })
      .finally(() => setIsLoading(null))
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2 w-full">
        <button
          type="button"
          disabled={isLoading !== null}
          onClick={() => handleOAuth("google")}
          className="flex gap-1 items-center justify-center text-center w-1/2 pg-trasparent transition-all duration-75 hover:bg-muted/80 border border-muted p-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg className="h-4" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" id="google">
            <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
            <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path><path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
            <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
          </svg>
          {isLoading === "google" ? "Connecting..." : "Google"}
        </button>
        <button
          type="button"
          disabled={isLoading !== null}
          onClick={() => handleOAuth("github")}
          className="flex gap-1 items-center justify-center text-center w-1/2 pg-trasparent transition-all duration-75 hover:bg-muted/80 border border-muted p-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg className="h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" data-tsd-source="/src/components/social/auth-view.tsx:339:25"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
          {isLoading === "github" ? "Connecting..." : "GitHub"}
        </button>
      </div>
      {error && <AuthAlert message={error} variant="error" />}
    </>
  )
}

export default GoogleGithub