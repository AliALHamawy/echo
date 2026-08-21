import { Select, SelectContent, SelectTrigger, SelectValue, SelectGroup, SelectItem, SelectLabel } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface MySelectOptions {
    label: string
    value: string
}
interface MySelectProps {
    options: readonly MySelectOptions[] | MySelectOptions[]
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void
    placeholder?: string
    contentClassName?: string
}
const MySelect = ({options, value, defaultValue, onChange, placeholder, contentClassName}: MySelectProps) => {
    return (
        <Select value={value} defaultValue={defaultValue} onValueChange={onChange}>
            <SelectTrigger className={`w-full sm:max-w-45 max-w-33 outline-0 border border-border rounded-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus:outline-none `}>
                <SelectValue placeholder={placeholder || "Select option"} />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={4} className={cn('rounded-none', contentClassName)}>
                <SelectGroup>
                    {options?.map((option) => (
                        <SelectItem key={option.value} value={option.value} className={cn('rounded-none', contentClassName)}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default MySelect