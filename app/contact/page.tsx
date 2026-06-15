import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/features/ContactForm";

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: "Ünvan",
    lines: ["Nizami küçəsi 203", "Bakı, Azərbaycan"],
  },
  {
    icon: Phone,
    title: "Telefon",
    lines: ["+994 50 123 45 67"],
  },
  {
    icon: Mail,
    title: "E-poçt",
    lines: ["info@hopeacademy.az"],
  },
  {
    icon: Clock,
    title: "İş saatları",
    lines: ["B.e – Cümə: 09:00 – 18:00", "Şənbə: 10:00 – 14:00"],
  },
];

export default function ContactPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-pill bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90">
              Əlaqə
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Bizimlə əlaqə saxlayın
            </h1>
            <p className="mt-4 text-base text-white/70 sm:text-lg">
              Sualınız var? Formu doldurun və ya birbaşa zəng edin — komandamız 24 saat
              ərzində sizinlə əlaqə saxlayacaq.
            </p>
          </div>
        </div>
      </section>

      {/* Contact info + form */}
      <section className="bg-light py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
          <div className="flex flex-col gap-6">
            {CONTACT_INFO.map(({ icon: Icon, title, lines }) => (
              <div key={title} className="flex gap-4 rounded-card bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-card bg-light text-blue">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-navy">{title}</h3>
                  {lines.map((line) => (
                    <p key={line} className="mt-1 text-sm text-gray-500">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex min-h-[160px] flex-1 items-center justify-center rounded-card bg-navy p-6 text-center">
              <div className="flex flex-col items-center gap-2 text-white/70">
                <MapPin size={28} className="text-gold" />
                <p className="text-sm">Bakı, Azərbaycan</p>
              </div>
            </div>
          </div>

          <div className="rounded-card bg-white p-6 shadow-sm sm:p-10">
            <h2 className="text-2xl font-semibold text-navy sm:text-3xl">Mesaj göndər</h2>
            <p className="mt-2 text-sm text-gray-500">
              Formu doldurun — məsləhətçimiz tezliklə sizinlə əlaqə saxlayacaq.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
