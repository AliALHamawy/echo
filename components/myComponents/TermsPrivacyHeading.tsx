interface TermsPrivacyHeadingProps {
    heading: string
    date: string
    description: string
}
const TermsPrivacyHeading = ({heading, date, description}: TermsPrivacyHeadingProps) => {
  return (
    <div className="flex flex-col w-full just-center items-center text-center px-2 gap-3">
                <h1 className="text-4xl font-bold tracking-wide text-primary">{heading}</h1>
                <p className="text-sm text-muted-foreground">{date}</p>
                <h2 className="text-sm text-muted-foreground max-w-[550px] mt-2">{description}</h2>
            </div>
  )
}

export default TermsPrivacyHeading