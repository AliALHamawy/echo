"use client"
import React, { useState } from "react"
import { LucideIcon, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string
    label?: string
    icon?: LucideIcon
    containerClassName?: string
}

const CustomInput = ({
    id,
    label,
    icon: Icon,
    type = "text",
    placeholder,
    className,
    containerClassName,
    ...props
}: CustomInputProps) => {
    const [showPassword, setShowPassword] = useState(false)

    const isPassword = type === "password"

    const inputType = isPassword ? (showPassword ? "text" : "password") : type

    return (
        <div className={cn("flex flex-col items-start gap-1.5 text-sm w-full", containerClassName)}>
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm font-medium text-foreground select-none"
                >
                    {label}
                </label>
            )}

            <div className="group flex items-center gap-2 w-full border border-border rounded-none px-3 py-1.5 bg-background transition-colors duration-200 focus-within:border-primary">
                {Icon && (
                    <Icon className="h-4 w-4 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary shrink-0" />
                )}

                <input
                    type={inputType}
                    id={id}
                    placeholder={placeholder}
                    className={cn(
                        "w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    {...props}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-muted-foreground hover:text-foreground focus:outline-none transition-colors duration-200 shrink-0"
                        tabIndex={-1} 
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}

export default CustomInput 