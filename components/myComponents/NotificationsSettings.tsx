import SettibgCard from './SettibgCard'
import { Switch } from '@/components/ui/switch'

interface NotificationsSettingsProps {
  notifications: {
    enabled: boolean
    messages: boolean
    mentions: boolean
    comments: boolean
    interactions: boolean
  }
  onChange: (key: keyof NotificationsSettingsProps["notifications"], value: boolean) => void
}

const NotificationsSettings = ({ notifications, onChange }: NotificationsSettingsProps) => {
  return (
    <>
      <div className="divide-y divide-border ">
        <SettibgCard labelHeading="Enable notifications" labelDescription="Master switch for all Echo alerts.">
          <Switch checked={notifications.enabled} onCheckedChange={(value) => onChange("enabled", value)} />
        </SettibgCard>
        <SettibgCard labelHeading="Messages" labelDescription="Direct messages from people you follow.">
          <Switch checked={notifications.messages} onCheckedChange={(value) => onChange("messages", value)} />
        </SettibgCard>
        <SettibgCard labelHeading="Mentions" labelDescription="When someone mentions you in a post.">
          <Switch checked={notifications.mentions} onCheckedChange={(value) => onChange("mentions", value)} />
        </SettibgCard>
        <SettibgCard labelHeading="Comments" labelDescription="MaReplies to your posts and threads.">
          <Switch checked={notifications.comments} onCheckedChange={(value) => onChange("comments", value)} />
        </SettibgCard>
        <SettibgCard labelHeading="Interactions" labelDescription="Likes, reposts, and new followers.">
          <Switch checked={notifications.interactions} onCheckedChange={(value) => onChange("interactions", value)} />
        </SettibgCard>
      </div>
    </>
  )
}

export default NotificationsSettings