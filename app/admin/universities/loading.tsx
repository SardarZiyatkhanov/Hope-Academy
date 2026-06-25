import { Skeleton } from "@/components/ui/Skeleton";

export default function UniversitiesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-40 rounded-[8px]" />
      </div>

      <div className="rounded-[12px] bg-white shadow-sm">
        <div className="space-y-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-gray-50 px-4 py-3">
              <Skeleton className="h-9 w-9 rounded-[8px]" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="hidden h-4 w-24 sm:block" />
              <Skeleton className="hidden h-4 w-20 md:block" />
              <Skeleton className="ml-auto h-8 w-16 rounded-[8px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
