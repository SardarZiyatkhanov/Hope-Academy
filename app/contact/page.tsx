import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/features/ContactForm";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { CONTACT } from "@/lib/constants";

const MAP_EMBED_URL =
  "https://www.openstreetmap.org/export/embed.html?bbox=49.8247%2C40.3665%2C49.8447%2C40.3785&layer=mapnik&marker=40.3725%2C49.8347";

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: "Ünvan",
    lines: [CONTACT.address, CONTACT.city],
    gradient: "from-blue to-navy",
  },
  {
    icon: Phone,
    title: "Telefon",
    lines: [CONTACT.phone],
    gradient: "from-gold to-accent",
  },
  {
    icon: Mail,
    title: "E-poçt",
    lines: [CONTACT.email],
    gradient: "from-accent to-blue",
  },
  {
    icon: Clock,
    title: "İş saatları",
    lines: ["B.e – Cümə: 09:00 – 18:00", "Şənbə: 10:00 – 14:00"],
    gradient: "from-navy to-blue",
  },
];

export default function ContactPage() {
  return (
    <main>
      <Navbar />

      <PageHero
        badge="Əlaqə"
        title="Bizimlə əlaqə saxlayın"
        description="Sualınız var? Formu doldurun və ya birbaşa zəng edin — komandamız 24 saat ərzində sizinlə əlaqə saxlayacaq."
      />

      {/* Contact info row */}
      <section className="bg-[#0a1c44] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CONTACT_INFO.map(({ icon: Icon, title, lines, gradient }, index) => (
              <Reveal key={title} delay={index * 0.08}>
                <div className="group flex items-start gap-4 rounded-card bg-white/5 p-5 transition-all hover:bg-white/10">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-gradient-to-br ${gradient} text-white shadow-sm`}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">
                      {title}
                    </h3>
                    {lines.map((line) => (
                      <p key={line} className="mt-0.5 text-sm text-white/90">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Map + Form */}
      <section className="bg-light py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8">
          <Reveal className="overflow-hidden rounded-card border border-gray-100 shadow-sm">
            <iframe
              title="Hope Academy ünvanı xəritədə"
              src={MAP_EMBED_URL}
              className="h-full min-h-[360px] w-full border-0 lg:min-h-[500px]"
              loading="lazy"
            />
          </Reveal>

          <Reveal delay={0.1} className="relative overflow-hidden rounded-card bg-white p-6 shadow-sm sm:p-10">
            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-blue/10 blur-3xl" />
            <div className="relative">
              <h2 className="text-2xl font-semibold text-navy sm:text-3xl">Mesaj göndər</h2>
              <p className="mt-2 text-sm text-gray-500">
                Formu doldurun — məsləhətçimiz tezliklə sizinlə əlaqə saxlayacaq.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
