"use client"
import FormHeading from "@/components/myComponents/FormHeading"
import CustomInput from "@/components/myComponents/CustomInput"
import { Mail, Lock, User, AtSign } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { cn } from "cn"
import Link from "next/link"
import { pb } from "@/lib/pocketbase"


const CreateAccount = () => {
    const [formData, setFormData] = useState<{
        name: string
        user: string
        email: string
        pass: string
        confPass: string
    }>({
        name: "",
        user: "",
        email: "",
        pass: "",
        confPass: "",
    })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData((prev) => ({ ...prev, [id]: value }))
    }

    const isFormFilled = formData.user.trim() !== "" && formData.pass.trim() !== ""

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (formData.pass !== formData.confPass) {
            setError("Passwords do not match.")
            return
        }

        setIsSubmitting(true)

        try {
            await pb.collection("users").create({
                name: formData.name,
                userName: formData.user,
                email: formData.email,
                password: formData.pass,
                passwordConfirm: formData.confPass,
                emailVisibility: true,
            })
            setSuccess("Account created. You can now sign in.")
            setFormData({ name: "", user: "", email: "", pass: "", confPass: "" })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to create your account.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <div className="flex flex-col items-start w-full">
                <FormHeading heading="Create your account" description="A few details and you're in." />

                <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3 items-start-text-start">

                    <CustomInput
                        id="name"
                        label="Full name"
                        type="text"
                        placeholder="Enter your Name"
                        icon={User}
                        onChange={handleChange}
                        value={formData.name}
                        required
                    />
                    <CustomInput
                        id="user"
                        label="Username"
                        type="text"
                        placeholder="ali"
                        icon={AtSign}
                        onChange={handleChange}
                        value={formData.user}
                        required
                    />
                    <CustomInput
                        id="email"
                        label="Email"
                        type="text"
                        placeholder="you@gmail.com"
                        icon={Mail}
                        onChange={handleChange}
                        value={formData.email}
                        required
                    />
                    <CustomInput
                        id="pass"
                        label="Password"
                        type="password"
                        placeholder="At least 8 characters"
                        icon={Lock}
                        onChange={handleChange}
                        value={formData.pass}
                        required
                    />
                    <CustomInput
                        id="confPass"
                        label="Confirm password"
                        type="password"
                        placeholder="Confirm your password"
                        icon={Lock}
                        onChange={handleChange}
                        value={formData.confPass}
                        required
                    />
                    <div className="flex justify-between items-center">

                        <div className="flex gap-1 items-center text-sm">
                            <Checkbox id="remember" name="Remember" required />
                            <label htmlFor="remember" className="text-muted-foreground">I agree to the <Link className="border-b border-foreground text-foreground" href="/terms">Terms</Link> and <Link className="border-b border-foreground text-foreground" href="/privacyPolicy">Privacy Policy</Link>.</label>
                        </div>
                    </div>
                    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
                    {success && <p className="text-sm text-green-600" role="status">{success}</p>}
                    <button type="submit" disabled={!isFormFilled || isSubmitting} className={cn(isFormFilled && !isSubmitting ?
                        "w-full text-background inline-flex text-center items-center justify-center font-medium p-1 bg-foreground/90"
                        :
                        "w-full text-background inline-flex text-center items-center justify-center font-medium p-1 bg-muted-foreground/90")}>Create Account</button>

                </form>
            </div>
        </>
    )
}

export default CreateAccount