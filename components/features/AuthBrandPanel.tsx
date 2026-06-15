import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const FEATURES = [
  "1000+ tələbəyə uğurla dəstək",
  "35+ tərəfdaş universitet",
  "100% şəffaf onlayn izləmə paneli",
];

interface AuthBrandPanelProps {
  headline: string;
  description: string;
}

export function AuthBrandPanel({ headline, description }: AuthBrandPanelProps) {
  return (
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-navy p-12 lg:flex">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-30"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/globe-bg.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-navy/60" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

      <Link href="/" className="relative z-10 flex items-center gap-3">
        <Image src="/logo.jpg" alt="Hope Academy" width={48} height={48} className="rounded-full" />
        <span className="flex flex-col leading-tight">
          <span className="font-heading text-xl font-bold text-white">Hope Academy</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
            Edu and Career Counselling
          </span>
        </span>
      </Link>

      <div className="relative z-10">
        <h2 className="font-heading max-w-md text-4xl font-bold leading-tight text-white">
          {headline}
        </h2>
        <p className="mt-4 max-w-sm text-sm text-white/60">{description}</p>
        <ul className="mt-8 flex flex-col gap-3">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-white/80">
              <CheckCircle2 size={18} className="shrink-0 text-gold" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative z-10 text-xs text-white/40">
        © {new Date().getFullYear()} Hope Academy. Bütün hüquqlar qorunur.
      </p>
    </div>
  );
}
