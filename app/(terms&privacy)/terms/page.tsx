import TermsPrivacyContent from "@/components/myComponents/TermsPrivacyContent"
import TermsPrivacyHeading from "@/components/myComponents/TermsPrivacyHeading"

const Terms = () => {
  return (
    <>
    <div className="flex flex-col w-full gap-14 py-4">
            <TermsPrivacyHeading heading="Terms of Service" date="Last updated September 10, 2026" description="These terms explain what you can expect from Echo and what we expect from you when you use the platform." />
            <div className="flex flex-col gap-12 mt-4 items-start">
            <TermsPrivacyContent heading="Account Terms" description="You must be at least 13 years old to create an Echo account, and you are responsible for the accuracy of the information you provide." description2="You are responsible for keeping your credentials secure and for all activity that happens under your account. Tell us right away if you notice unauthorised access." />
            <TermsPrivacyContent heading="Acceptable Use" description="Use Echo respectfully. Do not post unlawful, harassing, deceptive or hateful content, and do not attempt to disrupt, scrape or reverse engineer the service." description2="Automated access, spam, and impersonation of other people or organisations are not permitted." />
            <TermsPrivacyContent heading="Intellectual Property" description="You keep ownership of the content you publish. By posting, you grant Echo a limited licence to host, display and distribute that content so the service can work." description2="The Echo name, logo, interface and software remain the property of Echo and may not be copied without permission." />
            <TermsPrivacyContent heading="Termination" description="You can delete your account at any time from Settings. We may suspend or end access to accounts that breach these terms or put other people at risk." description2="Sections covering intellectual property, disclaimers and liability continue to apply after an account is closed." />
            </div>
        </div>
    </>
  )
}

export default Terms