"use client"
import FormHeading from "@/components/myComponents/FormHeading"
import CustomInput from "@/components/myComponents/CustomInput"
import { Mail, Lock, User, AtSign } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { cn } from "cn"
import Link from "next/link"


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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData((prev) => ({ ...prev, [id]: value }))
    }

    const isFormFilled = formData.user.trim() !== "" && formData.pass.trim() !== ""
    return (
        <>
            <div className="flex flex-col items-start w-full">
                <FormHeading heading="Create your account" description="A few details and you're in." />

                <form action="" className="flex flex-col w-full gap-3 items-start-text-start">

                    <CustomInput
                        id="name"
                        label="Full name"
                        type="text"
                        placeholder="Enter your Name"
                        icon={User}
                        onChange={handleChange}
                        value={formData.name}
                    />
                    <CustomInput
                        id="user"
                        label="Username"
                        type="text"
                        placeholder="ali"
                        icon={AtSign}
                        onChange={handleChange}
                        value={formData.user}
                    />
                    <CustomInput
                        id="email"
                        label="Email"
                        type="text"
                        placeholder="you@gmail.com"
                        icon={Mail}
                        onChange={handleChange}
                        value={formData.email}
                    />
                    <CustomInput
                        id="pass"
                        label="Password"
                        type="password"
                        placeholder="At least 8 characters"
                        icon={Lock}
                        onChange={handleChange}
                        value={formData.pass}
                    />
                    <CustomInput
                        id="confPass"
                        label="Confirm password"
                        type="password"
                        placeholder="Confirm your password"
                        icon={Lock}
                        onChange={handleChange}
                        value={formData.confPass}
                    />
                    <div className="flex justify-between items-center">

                        <div className="flex gap-1 items-center text-sm">
                            <Checkbox id="remember" name="Remember" required />
                            <label htmlFor="remember" className="text-muted-foreground">I agree to the <Link className="border-b border-foreground text-foreground" href="/terms">Terms</Link> and <Link className="border-b border-foreground text-foreground" href="/privacyPolicy">Privacy Policy</Link>.</label>
                        </div>
                    </div>
                    <button className={cn(isFormFilled ?
                        "w-full text-background inline-flex text-center items-center justify-center font-medium p-1 bg-foreground/90"
                        :
                        "w-full text-background inline-flex text-center items-center justify-center font-medium p-1 bg-muted-foreground/90")}>Create Account</button>

                </form>
            </div>
        </>
    )
}

export default CreateAccount