
// types/notification.ts

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";

export type NotificationType = "follow" | "comment" | "mention" | "like";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  user: {
    name: string;
    initials: string;
    avatar?: string;
  };
  actionText: string;
  commentOrSnippet?: string;
  time: string;
  isUnread: boolean;
  followingState?: boolean;
}

export const mockNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    type: "follow",
    user: {
      name: "Kai Lund",
      initials: "KL",
    },
    actionText: "started following you",
    time: "2m ago",
    isUnread: true,
    followingState: false,
  },
  {
    id: "notif-2",
    type: "comment",
    user: {
      name: "Ines Marchetti",
      initials: "IM",
    },
    actionText: "commented on your post",
    commentOrSnippet: "The token rewrite reads so much faster now.",
    time: "14m ago",
    isUnread: true,
  },
  {
    id: "notif-3",
    type: "mention",
    user: {
      name: "Ada Vinter",
      initials: "AV",
    },
    actionText: "mentioned you in a post",
    commentOrSnippet: "@jules called this months ago — monochrome wins.",
    time: "1h ago",
    isUnread: true,
  },
  {
    id: "notif-4",
    type: "like",
    user: {
      name: "Ren Okafor",
      initials: "RO",
    },
    actionText: "liked your post",
    commentOrSnippet: "Boring wins are still wins.",
    time: "3h ago",
    isUnread: false,
  },
  {
    id: "notif-5",
    type: "follow",
    user: {
      name: "Tomas Reyes",
      initials: "TR",
    },
    actionText: "started following you",
    time: "6h ago",
    isUnread: false,
    followingState: true,
  },
  {
    id: "notif-6",
    type: "mention",
    user: {
      name: "Noor Halim",
      initials: "NH",
    },
    actionText: "mentioned you in a comment",
    commentOrSnippet: "ask @jules about the hydration profile",
    time: "1d ago",
    isUnread: false,
  },
  {
    id: "notif-7",
    type: "like",
    user: {
      name: "Mira Sol",
      initials: "MS",
    },
    actionText: "liked your comment",
    commentOrSnippet: "Type scale is a product decision.",
    time: "2d ago",
    isUnread: false,
  },
];

const Notifications = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center py-10 px-4">
        <div className="max-w-168.75 w-full flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-xl font-bold">Notifications</span>
              <span className="text-sm text-muted-foreground">3 unreaded</span>
            </div>
            <button className="text-sm text-muted-foreground transition-all duration-300 hover:bg-muted p-1 rounded-xs">3 unreaded</button>
          </div>
          <div className="flex rounded-2xl p-1 border border-muted w-fit">
            <div className="text-sm px-2 py-1 bg-foreground rounded-xl text-primary-foreground">All</div>
            <div className="text-sm px-2 py-1">Unread</div>
            <div className="text-sm px-2 py-1">Mentions</div>
          </div>
          <div className="flex flex-col w-full border border-muted divide-y divide-border">
            {mockNotifications.map((item) => (

              <div className="flex flex-row justify-between w-full p-4 items-center" key={item.id}>
                <div className="flex flex-row gap-2 items-center">
                  <Avatar className='h-8 w-8'>
                    {item.user.avatar ? <AvatarImage src={item.user.avatar} /> : null}
                    <AvatarFallback>{item.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-col text-sm">
                    <div className="flex gap-1 items-center">
                      <span>{item.user.name}</span>
                      <span className="text-muted-foreground text-xs">{item.actionText}</span>
                    </div>
                    {item.commentOrSnippet ?
                      <div className="text-xs text-muted-foreground">{item.commentOrSnippet}</div> : null
                    }
                    <div className="text-xs text-muted-foreground text-[11px] font-light">{item.time}</div>
                  </div>
                </div>
                <div className="border roundwd-sm flex justify-center tems-center p-1 text-sm text-muted-foreground">
                  <Heart height={15} width={15} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Notifications