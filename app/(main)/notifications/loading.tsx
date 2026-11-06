import { NotificationsSkeleton } from "@/components/ui/skeletons/NotificationsSkeleton"

export default function Loading() {
  return (
    <div className="flex w-full flex-col justify-center px-4 py-10">
      <div className="mx-auto flex w-full max-w-168.75 flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-5 w-32 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800/60" />
            <div className="h-2.5 w-16 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800/60" />
          </div>
          <div className="h-3 w-24 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800/60" />
        </div>
        <NotificationsSkeleton />
      </div>
    </div>
  )
}
