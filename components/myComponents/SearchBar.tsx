import { SearchIcon } from "lucide-react"

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"

export function SearchBar() {
    return (
        <InputGroup className="max-w-sm rounded-xl has-[[data-slot=input-group-control]:focus-visible]:ring-1 ">
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
                <SearchIcon className="text-muted-foreground" />
            </InputGroupAddon>
        </InputGroup>
    )
}   