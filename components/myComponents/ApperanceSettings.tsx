
import SettibgCard from '@/components/myComponents/SettibgCard'
import MySelect from './MySelect'
import { THEME_OPTIONS } from './settingsData'
import { Switch } from '@/components/ui/switch'

interface AppearanceSettingsProps {
  theme: string
  reducedMotion: boolean
  compactFeed: boolean
  onThemeChange: (value: string) => void
  onReducedMotionChange: (value: boolean) => void
  onCompactFeedChange: (value: boolean) => void
}

const ApperanceSettings = ({
  theme,
  reducedMotion,
  compactFeed,
  onThemeChange,
  onReducedMotionChange,
  onCompactFeedChange,
}: AppearanceSettingsProps) => {
  return (
    <>
            <div className="divide-y divide-border ">
                <SettibgCard labelHeading="Theme" labelDescription="Choose your preferred theme for the app.">
                  <MySelect value={theme} options={THEME_OPTIONS} onChange={onThemeChange} />
                </SettibgCard>
                <SettibgCard labelHeading="Reduced motion" labelDescription="Minimize animations and transitions.">
                  <Switch checked={reducedMotion} onCheckedChange={onReducedMotionChange} />
                </SettibgCard>
                <SettibgCard labelHeading="Compact feed" labelDescription="Tighter spacing between posts.">
                  <Switch checked={compactFeed} onCheckedChange={onCompactFeedChange} />
                </SettibgCard>
            </div>
    </>
  )
}

export default ApperanceSettings