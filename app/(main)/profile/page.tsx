"use client";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, MoreHorizontal, BadgeCheck } from 'lucide-react'
import { Post } from "@/components/myComponents/MyCard";
import MyCard from '@/components/myComponents/MyCard';

export const POSTS_DATA: Post[] = [
  {
    id: "post-1",
    name: "Jules Dorn",
    userName: "@jules",
    userAvatar: "https://github.com/shadcn.png",
    postDescription: "Rebuilt the settings page around a single sliding pill. Turns out most 'complex' UI is just three states pretending to be twelve.",
    createdAt: "2h",
    numberOfLikes: 214,
    numberOfComments: 18,
    repost: 11,
    numberOfShares: 4,
  },
  {
    id: "post-2",
    name: "Jules Dorn",
    userName: "@jules",
    userAvatar: "https://github.com/shadcn.png",
    postDescription: "Contrast first, color later. You can ship an entire product in greyscale and nobody will ask for gradients.",
    createdAt: "1d",
    numberOfLikes: 508,
    numberOfComments: 0, // يظهر Off في الصورة مكان التعليقات
    repost: 63,
    numberOfShares: 12,
  },
  {
    id: "post-3",
    name: "Jules Dorn",
    userName: "@jules",
    userAvatar: "https://github.com/shadcn.png",
    postDescription: "Reminder: a 200ms spring feels premium, a 600ms one feels broken.",
    createdAt: "3d",
    numberOfLikes: 96,
    numberOfComments: 7,
    repost: 3,
    numberOfShares: 1,
  },
];

const Profile = () => {
  const bgUrl = "https://github.com/shadcn.png"

  return (
    <div className="w-full bg-background text-foreground min-h-screen">

      <div
        className="h-40 sm:h-52 w-full bg-cover bg-center bg-no-repeat bg-muted border-b border-border"
        style={{ backgroundImage: bgUrl ? `url(${bgUrl})` : undefined }}
      />

      <div className="px-4 pb-4">

        <div className="flex justify-between items-end relative -mt-12 sm:-mt-16 mb-4">

          <div className="relative">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-background bg-muted">
              <AvatarImage src="https://github.com/shadcn.png" className="object-cover" />
              <AvatarFallback className="text-2xl font-bold">JD</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-1 right-2 w-3.5 h-3.5 bg-emerald-500 border-2 border-background rounded-full" />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="rounded-full px-4 h-9 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white border-0 rounded-none"
            >
              Edit Profile
            </Button>

            <Button
              className="rounded-full px-5 h-9 text-xs font-semibold bg-white text-black hover:bg-zinc-200 border-0 rounded-none"
            >
              Follow
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-9 h-9 text-muted-foreground hover:text-foreground rounded-none"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Jules Dorn</h1>
              <BadgeCheck className="w-4 h-4 text-yellow-500" />
            </div>
            <span className="text-sm text-muted-foreground">@jules</span>
          </div>

          <p className="text-sm text-foreground max-w-xl leading-relaxed">
            Design engineer. Building quiet interfaces at Echo. Monochrome maximalist, motion minimalist.
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Lisbon, Portugal</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Joined March 2023</span>
            </div>
          </div>

          <div className="flex items-center gap-5 text-sm pt-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground">248</span>
              <span className="text-xs text-muted-foreground">Posts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground">12.8K</span>
              <span className="text-xs text-muted-foreground">Followers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground">312</span>
              <span className="text-xs text-muted-foreground">Following</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="divide-y divide-border border-t border-border">
          {POSTS_DATA.map((post) => (
            <MyCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile


