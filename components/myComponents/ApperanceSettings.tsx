
import SettibgCard from '@/components/myComponents/SettibgCard'
import MySelect from './MySelect'
import { THEME_OPTIONS } from './settingsData'
import { Switch } from '@/components/ui/switch'

const ApperanceSettings = () => {
  return (
    <>
            <div className="divide-y divide-border ">
                <SettibgCard labelHeading="Theme" labelDescription="Choose your preferred theme for the app.">
                  <MySelect value={THEME_OPTIONS[0].value} options={THEME_OPTIONS} />
                </SettibgCard>
                <SettibgCard labelHeading="Reduced motion" labelDescription="Minimize animations and transitions.">
                  <Switch />
                </SettibgCard>
                <SettibgCard labelHeading="Compact feed" labelDescription="Tighter spacing between posts.">
                  <Switch />
                </SettibgCard>
            </div>
    </>
  )
}

export default ApperanceSettings