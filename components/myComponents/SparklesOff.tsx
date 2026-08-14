import { Sparkles } from "lucide-react"

export function SparklesOff({ className = "size-4" }: { className?: string }) {
    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            {/* أيقونة Sparkles الأصلية */}
            <Sparkles className="size-full" />
            {/* خط الشطب المائل */}
            <svg
                className="absolute inset-0 size-full stroke-current stroke-[2]"
                viewBox="0 0 24 24"
                fill="none"
            >
                <line x1="3" y1="3" x2="21" y2="21" strokeLinecap="round" />
            </svg>
        </div>
    )
}