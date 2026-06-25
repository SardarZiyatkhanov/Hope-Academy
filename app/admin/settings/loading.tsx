import { Skeleton } from "@/components/ui/Skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />

      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-[12px] bg-white p-6 shadow-sm">
            <Skeleton className="h-5 w-36" />
            <div className="mt-4 space-y-4">
              <Skeleton className="h-10 w-full rounded-[8px]" />
              <Skeleton className="h-10 w-full rounded-[8px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
