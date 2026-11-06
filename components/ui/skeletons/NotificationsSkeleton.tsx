import { Skeleton } from "@/components/ui/skeleton"

export function NotificationsSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4">
      {[0, 1, 2, 3, 4].map((item) => (
        <div key={item} className="flex items-center gap-3 border-b border-border/50 px-2 py-4">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-full max-w-sm" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}
