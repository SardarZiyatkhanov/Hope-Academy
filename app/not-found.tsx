import Link from "next/link";
import { Home, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/features/ParticleBackground";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main>
      <Navbar />
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-navy text-center">
        <ParticleBackground />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center gap-6 px-4">
          <p className="bg-gradient-to-r from-gold via-yellow-300 to-gold bg-clip-text font-heading text-[120px] font-bold leading-none text-transparent sm:text-[160px]">
            404
          </p>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Səhifə tapılmadı
          </h1>
          <p className="max-w-md text-sm text-white/60">
            Axtardığınız səhifə mövcud deyil və ya köçürülmüşdür. Ana səhifəyə
            qayıdaraq axtardığınızı tapa bilərsiniz.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/">
              <Button variant="primary">
                <Home size={16} /> Ana səhifə
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Bizimlə əlaqə <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
