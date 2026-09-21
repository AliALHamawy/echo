"use client";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Calendar, MoreHorizontal, Plus } from 'lucide-react'
import { pb } from '@/lib/pocketbase'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import QuickPost from '@/components/myComponents/QuickPost'
import MyCard from '@/components/myComponents/MyCard'
import { toPost, type Post } from '@/lib/posts'
import type { RecordModel } from 'pocketbase'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

interface ProfilePageProps {
  profileUserId?: string
}

const ProfilePage = ({ profileUserId }: ProfilePageProps) => {
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const currentUser = pb.authStore.record
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [isFollowBusy, setIsFollowBusy] = useState(false)
  const [profileUser, setProfileUser] = useState<RecordModel | null>(null)
  const user = profileUserId ? profileUser : currentUser
  const userId = user?.id
  const isOwnProfile = !profileUserId || profileUserId === currentUser?.id

  useEffect(() => {
    if (!userId) return

    const loadFollowData = async () => {
      try {
        const [followers, following] = await Promise.all([
          pb.collection('follows').getList(1, 1, { filter: `following = "${userId}"`, requestKey: null }),
          pb.collection('follows').getList(1, 1, { filter: `follower = "${userId}"`, requestKey: null }),
        ])

        setFollowerCount(followers.totalItems)
        setFollowingCount(following.totalItems)

        if (!isOwnProfile && currentUser?.id) {
          const relationship = await pb.collection('follows').getFirstListItem(
            `follower = "${currentUser.id}" && following = "${userId}"`,
            { requestKey: null }
          ).catch(() => null)
          setIsFollowing(Boolean(relationship))
        } else {
          setIsFollowing(false)
        }
      } catch {
        setFollowerCount(0)
        setFollowingCount(0)
      }
    }

    void loadFollowData()
  }, [currentUser?.id, isOwnProfile, userId])

  useEffect(() => {
    if (!profileUserId || profileUserId === currentUser?.id) return

    const loadProfileUser = async () => {
      try {
        const record = await pb.collection('users').getOne(profileUserId, { requestKey: null })
        setProfileUser(record)
      } catch {
        setProfileUser(null)
      }
    }

    void loadProfileUser()
  }, [currentUser?.id, profileUserId])

  const name = user?.name || user?.username || user?.email || "Your account"
  const username = user?.username || user?.userName || "account"
  const avatar = user?.avatar && user?.collectionId
    ? pb.files.getURL(user, user.avatar)
    : undefined
  const cover = user?.cover && user?.collectionId
    ? pb.files.getURL(user, user.cover)
    : undefined
  const bio = user?.bio || "Welcome to your Echo profile. Share what is on your mind and stay connected with your conversations."
  const joinedDate = user?.created
    ? new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(user.created))
    : "Recently"
  const initials = name.slice(0, 2).toUpperCase()

  const handleFollowToggle = async () => {
    if (!currentUser?.id || !profileUserId || isFollowBusy) return

    setIsFollowBusy(true)
    try {
      const filter = `follower = "${currentUser.id}" && following = "${profileUserId}"`
      const relationship = await pb.collection('follows').getFirstListItem(filter, { requestKey: null }).catch(() => null)

      if (relationship) {
        await pb.collection('follows').delete(relationship.id)
        setIsFollowing(false)
        setFollowerCount((count) => Math.max(0, count - 1))
      } else {
        await pb.collection('follows').create({ follower: currentUser.id, following: profileUserId })
        setIsFollowing(true)
        setFollowerCount((count) => count + 1)
      }
    } finally {
      setIsFollowBusy(false)
    }
  }

  const loadPosts = useCallback(async () => {
    if (!userId) return
    const records = await pb.collection('posts').getFullList({
      filter: `author = "${userId}"`,
      sort: '-created',
      expand: 'author',
      requestKey: null,
    })
    setPosts(records.map(toPost))
  }, [userId])

  useEffect(() => {
    const fetchPosts = async () => {
      await loadPosts()
    }

    void fetchPosts()
  }, [loadPosts])

  return (
    <div className="w-full bg-background text-foreground min-h-screen">
      <div
        className="h-40 sm:h-52 w-full bg-muted border-b border-border"
        style={{ backgroundImage: cover ? `url(${cover})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}
      />

      <div className="px-4 pb-4">
        <div className="flex justify-between items-end relative -mt-12 sm:-mt-16 mb-4">
          <div className="relative">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-background bg-muted">
              <AvatarImage src={avatar} className="object-cover" />
              <AvatarFallback className="text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex items-center gap-2">
            {isOwnProfile && (
              <>
                <Button
                  variant="secondary"
                  asChild
                  className="px-5 h-9 text-xs font-semibold border-0 rounded-none"
                >
                  <Link href="/profile/edit">
                    Edit profile
                  </Link>
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => setIsComposerOpen(true)}
                  className="px-5 h-9 text-xs font-semibold border-0 rounded-none bg-foreground text-background hover:bg-foreground/90 hover:text-background/90 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Add post
                </Button>
              </>
            )}
            {!isOwnProfile && (
              <Button
                type="button"
                onClick={() => void handleFollowToggle()}
                disabled={isFollowBusy}
                variant={isFollowing ? "secondary" : "default"}
                className="h-9 px-5 text-xs font-semibold rounded-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 text-muted-foreground hover:text-foreground rounded-none"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">{name}</h1>
            <span className="text-sm text-muted-foreground">@{username}</span>
          </div>

          <p className="text-sm text-foreground max-w-xl leading-relaxed">
            {bio}
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Joined {joinedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-5 text-sm pt-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground">{posts.length}</span>
              <span className="text-xs text-muted-foreground">Posts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground">{followerCount}</span>
              <span className="text-xs text-muted-foreground">Followers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground">{followingCount}</span>
              <span className="text-xs text-muted-foreground">Following</span>
            </div>
          </div>
        </div>
      </div>

      {isOwnProfile && (
        <Sheet open={isComposerOpen} onOpenChange={setIsComposerOpen}>
          <SheetContent side="bottom" className="mx-auto w-full max-w-2xl border-x border-border p-4 sm:p-6">
            <SheetHeader className="px-0 pt-0">
              <SheetTitle>Create a post</SheetTitle>
              <SheetDescription>Share what is on your mind with your Echo community.</SheetDescription>
            </SheetHeader>
            <QuickPost onPostCreated={() => {
              setIsComposerOpen(false)
              void loadPosts()
            }} />
          </SheetContent>
        </Sheet>
      )}

      <div className="flex flex-col border-t border-border">
        {posts.map((post) => <MyCard key={post.id} post={post} onPostChanged={() => void loadPosts()} />)}
      </div>
    </div>
  )
}

export default ProfilePage
