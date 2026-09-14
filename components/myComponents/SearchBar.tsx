import { SearchIcon } from "lucide-react"
import { toggleSearch } from "@/store/slices/uiSlice";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { useAppDispatch } from "@/store/hooks";
interface propTypes {
    out: boolean
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
export function SearchBar({out, value, onChange}: propTypes) {
    const dispatch = useAppDispatch();
    return (
        out===true?
        <InputGroup className=" rounded-xl has-[[data-slot=input-group-control]:focus-visible]:ring-1 w-full" onClick={() => dispatch(toggleSearch())}>
            <InputGroupInput placeholder="Search..." value={value} onChange={onChange} />
            <InputGroupAddon>
                <SearchIcon className="text-muted-foreground" />
            </InputGroupAddon>
        </InputGroup>:
        <InputGroup className=" rounded-xl has-[[data-slot=input-group-control]:focus-visible]:ring-1 w-full" >
            <InputGroupInput placeholder="Search..." value={value} onChange={onChange} />
            <InputGroupAddon>
                <SearchIcon className="text-muted-foreground" />
            </InputGroupAddon>
        </InputGroup>
    )
}   