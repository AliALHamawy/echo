"use client"

import AuthAlert from "@/components/myComponents/AuthAlert"
import CustomInput from "@/components/myComponents/CustomInput"
import FormHeading from "@/components/myComponents/FormHeading"
import { pb } from "@/lib/pocketbase"
import { cn } from "@/lib/utils"
import { ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError("")
        setSuccess("")
        setIsSubmitting(true)

        try {
            await pb.collection("users").requestPasswordReset(email.trim())
            setSuccess("If an account uses this email, a reset link is on its way.")
            setEmail("")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to send the reset link.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const isFormFilled = email.trim() !== ""

    return (
        <div className="flex flex-col items-start w-full">
            <FormHeading
                heading="Reset your password"
                description="Enter your email and we will send you a secure reset link."
            />

            <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">
                <CustomInput
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="you@gmail.com"
                    icon={Mail}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
                <button
                    type="submit"
                    disabled={!isFormFilled || isSubmitting}
                    className={cn(
                        "w-full text-background inline-flex text-center items-center justify-center font-medium p-2 transition-opacity",
                        isFormFilled && !isSubmitting
                            ? "bg-foreground/90 hover:opacity-80"
                            : "bg-muted-foreground/90"
                    )}
                >
                    {isSubmitting ? "Sending..." : "Send reset link"}
                </button>
            </form>

            <Link
                href="/auth"
                className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
            </Link>

            {error && <AuthAlert message={error} variant="error" />}
            {success && <AuthAlert message={success} variant="success" />}
        </div>
    )
}

export default ForgotPassword
