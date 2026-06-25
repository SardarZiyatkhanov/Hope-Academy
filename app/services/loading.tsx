import { Skeleton } from "@/components/ui/Skeleton";

export default function ServicesLoading() {
  return (
    <main>
      <div className="h-16 bg-navy" />

      <section className="bg-navy py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
          <Skeleton className="h-5 w-28 bg-white/10" />
          <Skeleton className="h-10 w-96 bg-white/10" />
          <Skeleton className="h-4 w-80 bg-white/10" />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="mx-auto h-8 w-48" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[12px] border border-gray-100 p-6">
                <Skeleton className="h-12 w-12 rounded-[12px]" />
                <Skeleton className="mt-4 h-5 w-40" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
