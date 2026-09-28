import { Skeleton } from "@/components/ui/skeleton";

export function ProductsTableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 border-b px-4 py-4">
          <Skeleton className="size-4" />

          <div className="flex-1">
            <Skeleton className="h-4 w-40" />
          </div>

          <Skeleton className="hidden h-4 w-24 md:block" />
          <Skeleton className="hidden h-4 w-16 sm:block" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="size-8" />
        </div>
      ))}
    </div>
  );
}
