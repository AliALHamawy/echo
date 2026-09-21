"use client"
import { Mail, Lock } from "lucide-react"
import CustomInput from "@/components/myComponents/CustomInput"
import { Checkbox } from "@/components/ui/checkbox"
import GoogleGithub from "./GoogleGithub"
import FormHeading from "./FormHeading"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { pb } from "@/lib/pocketbase"
import { useRouter } from "next/navigation"
import AuthAlert from "@/components/myComponents/AuthAlert"
import Link from "next/link"

const SignIn = () => {
    const router = useRouter()
    const [formData, setFormData] = useState<{
        user: string
        pass: string
    }>({
        user: "",
        pass: "",
    })
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData((prev) => ({ ...prev, [id]: value }))
    }

    const isFormFilled = formData.user.trim() !== "" && formData.pass.trim() !== ""

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")
        setIsSubmitting(true)

        try {
            await pb.collection("users").authWithPassword(formData.user, formData.pass)
            router.push("/")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to sign in.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <div className="flex flex-col items-start w-full">

                <FormHeading heading="Welcome back" description="Sign in to pick up where you left off." />

                <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3 items-start-text-start">

                    <CustomInput
                        id="user"
                        label="Email or username"
                        type="text"
                        placeholder="Enter your email or username"
                        value={formData.user}
                        icon={Mail}
                        onChange={handleChange}
                    />
                    <CustomInput
                        id="pass"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.pass}
                        icon={Lock}
                        onChange={handleChange}
                    />
                    <div className="flex justify-between items-center">

                        <div className="flex gap-1 items-center text-sm">
                            <Checkbox id="remember" name="Remember" />
                            <label htmlFor="remember" className="text-muted-foreground">Remember me</label>
                        </div>
                        <Link href="/auth/forgot-password" className="text-sm border-b-2 border-transparent transition-all duration-100 hover:border-primary">
                            Forgot password?
                        </Link>
                    </div>
                    <button type="submit" disabled={!isFormFilled || isSubmitting} className={cn(isFormFilled && !isSubmitting ?
                        "w-full text-background inline-flex text-center items-center justify-center font-medium p-1 bg-foreground/90"
                        :
                        "w-full text-background inline-flex text-center items-center justify-center font-medium p-1 bg-muted-foreground/90")}>Sign In</button>

                </form>

                <div className="relative py-2 text-center w-full my-1">
                    <span className="absolute inset-x-0 top-1/2 h-px bg-border"></span>
                    <span className="relative bg-background px-3 text-xs text-muted-foreground">Or continue with</span>
                </div>

                <GoogleGithub />
                {error && <AuthAlert message={error} variant="error" />}

            </div>
        </>
    )
}

export default SignIn