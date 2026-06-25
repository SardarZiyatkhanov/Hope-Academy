import { Skeleton } from "@/components/ui/Skeleton";

export default function AboutLoading() {
  return (
    <main>
      {/* Navbar placeholder */}
      <div className="h-16 bg-navy" />

      {/* Hero */}
      <section className="bg-navy py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
          <Skeleton className="h-5 w-24 bg-white/10" />
          <Skeleton className="h-10 w-80 bg-white/10" />
          <Skeleton className="h-4 w-96 bg-white/10" />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#0a1c44]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 bg-[#0a1c44] px-4 py-8">
              <Skeleton className="h-10 w-20 bg-white/10" />
              <Skeleton className="h-3 w-16 bg-white/10" />
            </div>
          ))}
        </div>
      </section>

      {/* Content cards */}
      <section className="bg-light py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[12px] bg-white shadow-sm">
              <Skeleton className="h-44 w-full rounded-none" />
              <div className="space-y-3 p-8">
                <Skeleton className="h-12 w-12 rounded-[12px]" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
