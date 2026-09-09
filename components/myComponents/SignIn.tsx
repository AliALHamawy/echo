import { Mail, Lock } from "lucide-react"
import CustomInput from "@/components/myComponents/CustomInput"
import { Checkbox } from "@/components/ui/checkbox"
import GoogleGithub from "./GoogleGithub"

const SignIn = () => {
    return (
        <>
            <div className="flex flex-col items-start w-full">
                <div className="flex flex-col items-start gap-1 mb-3">
                    <h2 className="text-xl text-forground font-medium tracking-wider">Welcome back</h2>
                    <h3 className="text-sm text-muted-foreground">Sign in to pick up where you left off.</h3>
                </div>
                <form action="" className="flex flex-col w-full gap-3 items-start-text-start">

                    <CustomInput
                        id="user"
                        label="Email or username"
                        type="text"
                        placeholder="Enter your email or username"
                        icon={Mail}
                    />
                    <CustomInput
                        id="pass"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        icon={Lock}
                    />
                    <div className="flex justify-between items-center">

                        <div className="flex gap-1 items-center text-sm">
                            <Checkbox id="remember" name="Remember" />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <span className="text-sm border-b-2 border-transparent transition-all duration-100 hover:border-primary">Forgot password?</span>
                    </div>
                    <button className="w-full text-background inline-flex text-center items-center justify-center font-medium p-1 bg-muted-foreground/90">Sign In</button>

                </form>

                <div className="relative py-2 text-center w-full my-1">
                    <span className="absolute inset-x-0 top-1/2 h-px bg-border"></span>
                    <span className="relative bg-background px-3 text-xs text-muted-foreground">Or continue with</span>
                </div>

                <GoogleGithub />

            </div>
        </>
    )
}

export default SignIn