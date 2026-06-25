import { Skeleton } from "@/components/ui/Skeleton";

export default function LoginLoading() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-navy lg:block" />
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-10 w-full rounded-[8px]" />
          <Skeleton className="h-10 w-full rounded-[8px]" />
          <Skeleton className="h-10 w-full rounded-[8px]" />
        </div>
      </div>
    </div>
  );
}
