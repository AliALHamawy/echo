
interface TermsPrivacyContentProps {
    heading: string
    description: string
    description2: string
}
const TermsPrivacyContent = ({ heading, description, description2 }: TermsPrivacyContentProps) => {
    return (
        <>
            <div className="flex flex-col gap-3 items-start text-start">
                <h3 className="text-xl font-medium">{heading}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
                <p className="text-sm text-muted-foreground">{description2}</p>
            </div>
        </>
    )
}

export default TermsPrivacyContent