import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Building2 } from "lucide-react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { COUNTRIES, getCountry } from "@/lib/countries";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const country = getCountry(params.slug);
  if (!country) return {};
  return {
    title: `${country.nameAz}da Təhsil`,
    description: country.description,
  };
}

export default function CountryPage({ params }: Props) {
  const country = getCountry(params.slug);
  if (!country) notFound();

  return (
    <main>
      <Navbar />

      <PageHero
        badge={`${country.flag} ${country.nameAz}da Təhsil`}
        title={country.tagline}
        description={country.description}
      />

      {/* Highlights */}
      <section className="bg-[#0a1c44]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4 sm:px-6 lg:px-8">
          {country.highlights.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-2 px-4 py-4 text-center">
              <Icon size={20} className="text-gold" />
              <p className="text-lg font-bold text-white">{value}</p>
              <p className="text-xs text-white/50">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Study */}
      <section className="bg-light py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Üstünlüklər
            </span>
            <h2 className="mt-2 text-2xl font-semibold text-navy sm:text-3xl">
              Niyə {country.nameAz}?
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {country.whyStudy.map(({ title, desc }, index) => (
              <Reveal key={title} delay={index * 0.08}>
                <div className="flex gap-4 rounded-card bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue to-navy text-white text-sm font-bold">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy">{title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Top Universities */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex items-center gap-3">
              <Building2 size={22} className="text-blue" />
              <h2 className="text-2xl font-semibold text-navy sm:text-3xl">
                Əsas universitetlər
              </h2>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {country.topUniversities.map((uni, index) => (
              <Reveal key={uni.name} delay={index * 0.08}>
                <div className="flex items-start gap-4 rounded-card border border-gray-100 p-6 transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-gradient-to-br from-blue to-navy text-xs font-bold text-white">
                    {country.flag}
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy">{uni.name}</h3>
                    <p className="text-xs text-blue">{uni.city}</p>
                    <p className="mt-1 text-sm text-gray-500">{uni.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-light py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-semibold text-navy sm:text-3xl">
              Müraciət tələbləri
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {country.requirements.map(({ label, desc }, index) => (
              <Reveal key={label} delay={index * 0.06}>
                <div className="flex gap-3 rounded-card bg-white p-5 shadow-sm">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-blue" />
                  <div>
                    <p className="text-sm font-semibold text-navy">{label}</p>
                    <p className="mt-0.5 text-sm text-gray-500">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            {country.nameAz}da oxumaq istəyirsiniz?
          </h2>
          <p className="max-w-xl text-sm text-white/70 sm:text-base">
            Hope Academy komandası {country.nameAz} üzrə ixtisaslaşmış məsləhətçiləri ilə sizə uyğun proqramı tapacaq.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/#apply">
              <Button variant="primary">
                Pulsuz məsləhət al <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Xidmətlərə bax
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
