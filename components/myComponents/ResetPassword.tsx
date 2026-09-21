"use client"

import AuthAlert from "@/components/myComponents/AuthAlert"
import CustomInput from "@/components/myComponents/CustomInput"
import FormHeading from "@/components/myComponents/FormHeading"
import { pb } from "@/lib/pocketbase"
import { cn } from "@/lib/utils"
import { ArrowLeft, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

const ResetPassword = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token") ?? ""
    const [formData, setFormData] = useState({ password: "", passwordConfirm: "" })
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target
        setFormData((previous) => ({ ...previous, [id]: value }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError("")

        if (!token) {
            setError("This reset link is missing or invalid.")
            return
        }

        if (formData.password !== formData.passwordConfirm) {
            setError("Passwords do not match.")
            return
        }

        setIsSubmitting(true)

        try {
            await pb.collection("users").confirmPasswordReset(
                token,
                formData.password,
                formData.passwordConfirm
            )
            router.replace("/auth")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to reset your password.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const isFormFilled = formData.password.trim() !== "" && formData.passwordConfirm.trim() !== ""

    return (
        <div className="flex flex-col items-start w-full">
            <FormHeading
                heading="Choose a new password"
                description="Use a strong password you do not use anywhere else."
            />

            <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">
                <CustomInput
                    id="password"
                    label="New password"
                    type="password"
                    placeholder="At least 8 characters"
                    icon={Lock}
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                    required
                />
                <CustomInput
                    id="passwordConfirm"
                    label="Confirm password"
                    type="password"
                    placeholder="Enter it again"
                    icon={Lock}
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    minLength={8}
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
                    {isSubmitting ? "Updating..." : "Update password"}
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
        </div>
    )
}

export default ResetPassword
