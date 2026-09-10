import MySelect from "./MySelect"
import { ACCOUNT_PRIVACY_OPTIONS, COUNTRY_OPTIONS, FOLLOW_REQUESTS_OPTIONS } from "./settingsData"
import SettibgCard from "./SettibgCard"


const GeneralSettings = () => {
    return (
        <>
            <div className="divide-y divide-border ">
                <SettibgCard labelHeading="Account privacy" labelDescription="Control who can see your posts and profile.">
                    <MySelect value={ACCOUNT_PRIVACY_OPTIONS[0].value} options={ACCOUNT_PRIVACY_OPTIONS} />
                </SettibgCard>
                <SettibgCard labelHeading="Follow requests" labelDescription="Decide how people start following you.">
                    <MySelect value={FOLLOW_REQUESTS_OPTIONS[0].value} options={FOLLOW_REQUESTS_OPTIONS} />
                </SettibgCard>
                <SettibgCard labelHeading="Country / Region" labelDescription="Used for local trends and content.">
                    <MySelect value={COUNTRY_OPTIONS[0].value} options={COUNTRY_OPTIONS} contentClassName="!max-h-48 overflow-y-auto"  />

                </SettibgCard>
            </div>
        </>
    )
}

export default GeneralSettings