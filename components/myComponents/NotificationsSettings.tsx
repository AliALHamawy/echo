import React from 'react'
import SettibgCard from './SettibgCard'
import { Switch } from '@/components/ui/switch'

const NotificationsSettings = () => {
  return (
    <>
      <div className="divide-y divide-border ">
        <SettibgCard labelHeading="Enable notifications" labelDescription="Master switch for all Echo alerts.">
          <Switch />
        </SettibgCard>
        <SettibgCard labelHeading="Messages" labelDescription="Direct messages from people you follow.">
          <Switch />
        </SettibgCard>
        <SettibgCard labelHeading="Mentions" labelDescription="When someone mentions you in a post.">
          <Switch />
        </SettibgCard>
        <SettibgCard labelHeading="Comments" labelDescription="MaReplies to your posts and threads.">
          <Switch />
        </SettibgCard>
        <SettibgCard labelHeading="Interactions" labelDescription="Likes, reposts, and new followers.">
          <Switch />
        </SettibgCard>
      </div>
    </>
  )
}

export default NotificationsSettings