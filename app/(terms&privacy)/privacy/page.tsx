import TermsPrivacyContent from "@/components/myComponents/TermsPrivacyContent"
import TermsPrivacyHeading from "@/components/myComponents/TermsPrivacyHeading"

const page = () => {
    return (
        <>
        <div className="flex flex-col w-full gap-14 py-4">
            <TermsPrivacyHeading heading="Privacy Policy" date="Last updated September 10, 2026" description="This policy describes what information Echo collects, why we collect it, and the control you have over it." />
            <div className="flex flex-col gap-12 mt-4 items-start">
            <TermsPrivacyContent heading="Data Collection" description="We collect the details you give us when you create an account, such as your name, username and email address, along with the posts and messages you choose to share." description2="We also record limited technical information — device type, browser and approximate region — to keep the service reliable and secure." />
            <TermsPrivacyContent heading="How We Use Data" description="Your data is used to run Echo: delivering your feed, sending notifications you have enabled, and improving the features people use most." description2="We do not sell your personal information to advertisers or data brokers." />
            <TermsPrivacyContent heading="Security" description="Data is encrypted in transit, and access to production systems is restricted to the people who need it to operate the service." description2="No system is perfect, so we keep monitoring in place and will notify affected people promptly if a breach occurs." />
            <TermsPrivacyContent heading="User Rights" description="You can access, correct, export or delete your information at any time from your account settings." description2="Depending on where you live, you may also have the right to object to certain processing or to lodge a complaint with a data protection authority." />
            </div>
        </div>
        </>
    )
}

export default page