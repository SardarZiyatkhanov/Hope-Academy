import { Skeleton } from "@/components/ui/Skeleton";

export default function BlogLoading() {
  return (
    <main>
      <div className="h-16 bg-navy" />

      <section className="bg-navy py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
          <Skeleton className="h-5 w-16 bg-white/10" />
          <Skeleton className="h-10 w-48 bg-white/10" />
          <Skeleton className="h-4 w-72 bg-white/10" />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 sm:px-6 lg:px-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[12px] border border-gray-100">
              <Skeleton className="h-44 w-full rounded-none" />
              <div className="space-y-3 p-5">
                <div className="flex gap-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
