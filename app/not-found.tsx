import Link from "next/link";
import Image from "next/image";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy px-4 py-16 text-center">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

      <Link href="/" className="relative z-10 mb-10 flex items-center gap-3">
        <Image src="/logo.jpg" alt="Hope Academy" width={48} height={48} className="rounded-full" />
        <span className="flex flex-col items-start leading-tight">
          <span className="font-heading text-xl font-bold text-white">Hope Academy</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
            Edu and Career Counselling
          </span>
        </span>
      </Link>

      <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-gold">
        <Compass size={32} />
      </div>

      <h1 className="font-heading relative z-10 mt-6 text-7xl font-bold text-white sm:text-8xl">
        404
      </h1>
      <p className="font-heading relative z-10 mt-3 text-2xl font-semibold text-white">
        Səhifə tapılmadı
      </p>
      <p className="relative z-10 mt-3 max-w-md text-sm text-white/60">
        Axtardığınız səhifə mövcud deyil, silinib və ya ünvan dəyişdirilib. Ana səhifəyə qayıdaraq
        davam edə bilərsiniz.
      </p>

      <Link
        href="/"
        className="relative z-10 mt-8 inline-flex items-center justify-center gap-2 rounded-pill bg-white px-6 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-white/90"
      >
        <ArrowLeft size={16} />
        Ana səhifəyə qayıt
      </Link>
    </main>
  );
}
