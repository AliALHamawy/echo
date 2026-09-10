
import TermsPrivacyHeader from '@/components/myComponents/TermsPrivacyHeader'
import TermsprivacyFooter from '@/components/myComponents/TermsprivacyFooter'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className="flex flex-col max-w-5xl w-full mx-auto min-h-screen justify-between px-2">
                <TermsPrivacyHeader />
                <div>{children}</div>
                <TermsprivacyFooter />
            </div>
        </>
    )
}

export default layout