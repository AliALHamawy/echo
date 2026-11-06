import { SearchSkeleton } from "@/components/ui/skeletons/SearchSkeleton"

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-3 p-4">
      <SearchSkeleton />
    </div>
  )
}
