import { Skeleton } from "@/components/ui/skeleton"

export function CommentSkeleton() {
  return (
    <div className="flex items-start gap-3 border-b border-border/50 px-2 py-3">
      <Skeleton className="size-7 shrink-0 rounded-full" />
      <Skeleton className="h-7 w-full max-w-sm rounded-full" />
    </div>
  )
}
