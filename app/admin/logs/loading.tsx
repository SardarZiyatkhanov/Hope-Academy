import { Skeleton } from "@/components/ui/Skeleton";

export default function LogsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-28" />

      <div className="rounded-[12px] bg-white shadow-sm">
        <div className="space-y-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-gray-50 px-4 py-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="hidden h-4 w-48 sm:block" />
              <Skeleton className="ml-auto h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
