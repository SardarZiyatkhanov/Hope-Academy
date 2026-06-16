import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { COUNTRIES } from "@/lib/countries";

export const metadata: Metadata = {
  title: "Ölkələr",
  description: "Hope Academy ilə Avropanın 7 ölkəsindəki universitətlərə müraciət edin.",
};

export default function CountriesPage() {
  return (
    <main>
      <Navbar />

      <PageHero
        badge="Ölkələr"
        title="Hansı ölkəni seçirsiniz?"
        description="Almaniyadan Avstriyaya, Niderlanddan Çexiyaya — Hope Academy ilə 7 Avropa ölkəsindəki universitetlərə müraciət edə bilərsiniz."
      />

      <section className="bg-light py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COUNTRIES.map((country, index) => (
              <Reveal key={country.slug} delay={index * 0.06}>
                <Link
                  href={`/countries/${country.slug}`}
                  className="group flex h-full flex-col gap-4 rounded-card bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-blue/30"
                >
                  <div className="text-4xl">{country.flag}</div>
                  <div>
                    <h2 className="text-xl font-semibold text-navy">{country.nameAz}</h2>
                    <p className="mt-1 text-sm text-blue">{country.name}</p>
                  </div>
                  <p className="text-sm text-gray-500">{country.tagline}</p>
                  <div className="mt-auto flex items-center gap-1.5 text-sm font-medium text-blue transition-all group-hover:gap-3">
                    Ətraflı öyrən <ArrowRight size={15} />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
