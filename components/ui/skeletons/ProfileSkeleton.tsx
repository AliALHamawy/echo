import { Skeleton } from "@/components/ui/skeleton"

function ProfilePostSkeleton() {
  return (
    <div className="flex flex-col gap-4 border-t border-border p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="size-8 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-2.5 w-20" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-full max-w-md" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="flex gap-5">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-8" />
      </div>
    </div>
  )
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="h-40 w-full rounded-none sm:h-52" />
      <div className="flex flex-col gap-4 px-4 pb-4">
        <div className="-mt-12 flex items-end justify-between sm:-mt-16">
          <Skeleton className="size-24 rounded-full border-4 border-background sm:size-32" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full max-w-lg" />
          <Skeleton className="h-4 w-4/5 max-w-md" />
        </div>
        <div className="flex gap-5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  )
}

export function ProfilePostsSkeleton() {
  return (
    <div className="flex flex-col">
      <ProfilePostSkeleton />
      <ProfilePostSkeleton />
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <ProfileHeaderSkeleton />
      <ProfilePostsSkeleton />
    </div>
  )
}
