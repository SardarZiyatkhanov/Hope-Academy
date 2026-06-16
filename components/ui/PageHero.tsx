import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ParticleBackground } from "@/components/features/ParticleBackground";

interface PageHeroProps {
  badge: string;
  title: string;
  description: string;
}

export function PageHero({ badge, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy">
      <ParticleBackground />
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <nav className="flex items-center gap-1.5 text-xs text-white/50">
          <Link href="/" className="transition-colors hover:text-white">
            Ana səhifə
          </Link>
          <ChevronRight size={12} />
          <span className="text-white/80">{badge}</span>
        </nav>
        <div className="mt-6 max-w-2xl">
          <span className="inline-flex items-center rounded-pill bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90">
            {badge}
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/70 sm:text-lg">{description}</p>
        </div>
      </div>
    </section>
  );
}
