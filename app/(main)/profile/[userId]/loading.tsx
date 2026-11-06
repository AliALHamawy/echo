import {
  ProfileHeaderSkeleton,
  ProfilePostsSkeleton,
} from "@/components/ui/skeletons/ProfileSkeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <ProfileHeaderSkeleton />
      <ProfilePostsSkeleton />
    </div>
  )
}
