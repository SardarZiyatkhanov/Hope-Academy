import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-navy">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Hope Academy" width={36} height={36} />
            <span className="text-lg font-semibold text-white">Hope Academy</span>
          </Link>
          <p className="max-w-sm text-sm text-white/60">
            Bakıdan bütün dünyaya — xaricdə təhsil üçün universitet seçimi, sənədlərin
            hazırlanması, müraciət və viza prosesində etibarlı tərəfdaşınız.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white">Naviqasiya</h3>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white">Əlaqə</h3>
          <div className="flex items-start gap-2 text-sm text-white/60">
            <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
            <span>Nizami küçəsi 203, Bakı, Azərbaycan</span>
          </div>
          <a
            href="tel:+994501234567"
            className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <Phone size={16} className="shrink-0 text-gold" />
            +994 50 123 45 67
          </a>
          <a
            href="mailto:info@hopeacademy.az"
            className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <Mail size={16} className="shrink-0 text-gold" />
            info@hopeacademy.az
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-white/40 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Hope Academy. Bütün hüquqlar qorunur.
        </div>
      </div>
    </footer>
  );
}
