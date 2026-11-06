import { Skeleton } from "@/components/ui/skeleton"

export function MessagesSkeleton() {
  return (
    <div className="  w-full border border-border">
        {[0, 1, 2, 3, 4].map((item) => (
          <div key={item} className="flex items-center gap-3 p-4">
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-2.5 w-40 max-w-full" />
            </div>
            <Skeleton className="h-2.5 w-10 shrink-0" />
          </div>
        ))}
    
    </div>
  )
}
