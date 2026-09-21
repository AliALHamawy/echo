import MySelect from "./MySelect"
import { ACCOUNT_PRIVACY_OPTIONS, COUNTRY_OPTIONS, FOLLOW_REQUESTS_OPTIONS } from "./settingsData"
import SettibgCard from "./SettibgCard"

interface GeneralSettingsProps {
    accountPrivacy: string
    followRequests: string
    country: string
    onAccountPrivacyChange: (value: string) => void
    onFollowRequestsChange: (value: string) => void
    onCountryChange: (value: string) => void
}

const GeneralSettings = ({
    accountPrivacy,
    followRequests,
    country,
    onAccountPrivacyChange,
    onFollowRequestsChange,
    onCountryChange,
}: GeneralSettingsProps) => {
    return (
        <>
            <div className="divide-y divide-border ">
                <SettibgCard labelHeading="Account privacy" labelDescription="Control who can see your posts and profile.">
                    <MySelect value={accountPrivacy} options={ACCOUNT_PRIVACY_OPTIONS} onChange={onAccountPrivacyChange} />
                </SettibgCard>
                <SettibgCard labelHeading="Follow requests" labelDescription="Decide how people start following you.">
                    <MySelect value={followRequests} options={FOLLOW_REQUESTS_OPTIONS} onChange={onFollowRequestsChange} />
                </SettibgCard>
                <SettibgCard labelHeading="Country / Region" labelDescription="Used for local trends and content.">
                    <MySelect value={country} options={COUNTRY_OPTIONS} onChange={onCountryChange} contentClassName="!max-h-48 overflow-y-auto"  />

                </SettibgCard>
            </div>
        </>
    )
}

export default GeneralSettings