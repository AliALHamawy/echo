"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CircleCheck, CircleX } from "lucide-react"

type AuthAlertProps = {
    message: string
    variant: "error" | "success"
}

const AuthAlert = ({ message, variant }: AuthAlertProps) => {
    const isError = variant === "error"

    return (
        <Alert
            variant={isError ? "destructive" : "default"}
            className={`fixed bottom-4 right-4 z-50 w-[min(24rem,calc(100vw-2rem))] rounded-none shadow-lg ${isError ? "border-destructive/50" : "border-green-600/50 text-green-700 dark:text-green-400"}`}
            aria-live="polite"
        >
            {isError ? <CircleX /> : <CircleCheck />}
            <AlertTitle>{isError ? "Something went wrong" : "Success"}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    )
}

export default AuthAlert