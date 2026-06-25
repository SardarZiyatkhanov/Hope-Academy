import { Skeleton } from "@/components/ui/Skeleton";

export default function MapLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-28" />
      <Skeleton className="h-[calc(100vh-12rem)] w-full rounded-[12px]" />
    </div>
  );
}
