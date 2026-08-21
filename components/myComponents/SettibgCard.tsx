
import { ReactNode } from 'react'


interface cardData  {
    labelHeading:string,
    labelDescription?:string,
    children?: ReactNode
}

const SettibgCard = ({labelHeading,labelDescription,children}:cardData) => {
    return (
        <>
            <div className="p-4 flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">{labelHeading}</span>
                    <span className="text-xs text-muted-foreground">{labelDescription}</span>
                </div>
                {children}
            </div>
        </>
    )
}

export default SettibgCard