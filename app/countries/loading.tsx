import { Skeleton } from "@/components/ui/Skeleton";

export default function CountriesLoading() {
  return (
    <main>
      <div className="h-16 bg-navy" />

      <section className="bg-navy py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
          <Skeleton className="h-5 w-20 bg-white/10" />
          <Skeleton className="h-10 w-56 bg-white/10" />
          <Skeleton className="h-4 w-80 bg-white/10" />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 sm:px-6 lg:px-8">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[12px] border border-gray-100">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
