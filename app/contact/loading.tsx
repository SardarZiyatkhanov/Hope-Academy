import { Skeleton } from "@/components/ui/Skeleton";

export default function ContactLoading() {
  return (
    <main>
      <div className="h-16 bg-navy" />

      <section className="bg-navy py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
          <Skeleton className="h-5 w-20 bg-white/10" />
          <Skeleton className="h-10 w-64 bg-white/10" />
          <Skeleton className="h-4 w-80 bg-white/10" />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 shrink-0 rounded-[12px]" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4 rounded-[12px] border border-gray-100 p-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-[8px]" />
            ))}
            <Skeleton className="h-24 w-full rounded-[8px]" />
            <Skeleton className="h-10 w-full rounded-[8px]" />
          </div>
        </div>
      </section>
    </main>
  );
}
