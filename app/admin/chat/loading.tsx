import { Skeleton } from "@/components/ui/Skeleton";

export default function ChatLoading() {
  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Conversation list */}
      <div className="hidden w-72 shrink-0 space-y-2 rounded-[12px] bg-white p-4 shadow-sm sm:block">
        <Skeleton className="h-10 w-full rounded-[8px]" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-[8px] p-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col rounded-[12px] bg-white shadow-sm">
        <div className="border-b border-gray-100 p-4">
          <Skeleton className="h-5 w-36" />
        </div>
        <div className="flex-1" />
        <div className="border-t border-gray-100 p-4">
          <Skeleton className="h-10 w-full rounded-[8px]" />
        </div>
      </div>
    </div>
  );
}
