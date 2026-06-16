import Link from "next/link";
import {
  Compass,
  FileCheck,
  Send,
  Plane,
  Home as HomeIcon,
  FileSignature,
  FolderCheck,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Globe2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";

const ICON_GRADIENTS = [
  "from-blue to-navy",
  "from-gold to-accent",
  "from-accent to-blue",
  "from-navy to-blue",
  "from-gold to-navy",
  "from-blue to-accent",
];

const SERVICES = [
  {
    icon: Compass,
    title: "Universitet və proqram seçimi",
    desc: "Maraqlarınıza, büdcənizə və akademik göstəricilərinizə uyğun universitet və proqramları birgə müəyyənləşdiririk.",
    featured: true,
  },
  {
    icon: FileCheck,
    title: "Sənədlərin hazırlanması",
    desc: "Diplom, transkript, motivasiya məktubu və tövsiyə məktublarının tələblərə uyğun hazırlanmasında dəstək.",
    featured: true,
  },
  {
    icon: Send,
    title: "Müraciətin göndərilməsi",
    desc: "Bütün sənədləri universitetin tələb etdiyi formatda və müddətdə təqdim edirik, prosesi sizin adınızdan izləyirik.",
    featured: false,
  },
  {
    icon: GraduationCap,
    title: "Qəbul məktubu və qeydiyyat",
    desc: "Qəbul məktubunu aldıqdan sonra qeydiyyat, ödəniş və universitetlə əlaqəli bütün addımlarda dəstək.",
    featured: false,
  },
  {
    icon: Plane,
    title: "Viza və uçuş dəstəyi",
    desc: "Viza üçün sənəd toplanması, müsahibəyə hazırlıq və uçuş planlamasında köməklik göstəririk.",
    featured: false,
  },
  {
    icon: HomeIcon,
    title: "Yaşayış və məskunlaşma",
    desc: "Ünvana çatdıqdan sonra yaşayış yeri tapılması və ilk günlərdə yerləşmə üçün məsləhətlər.",
    featured: false,
  },
];

const STEPS = [
  { icon: FileSignature, title: "Müraciət", desc: "Formu doldurun, məsləhətçi sizinlə əlaqə saxlasın" },
  { icon: FolderCheck, title: "Sənədlər", desc: "Lazımi sənədləri toplayın və yükləyin" },
  { icon: Send, title: "Universitetə göndəriş", desc: "Sənədləriniz seçdiyiniz universitetə göndərilir" },
  { icon: GraduationCap, title: "Qəbul", desc: "Universitetdən qəbul məktubunu alırsınız" },
  { icon: Plane, title: "Viza & Uçuş", desc: "Viza prosesi və yola düşmə dəstəyi" },
];

const COUNTRIES = [
  "Almaniya",
  "Niderland",
  "Çexiya",
  "Belçika",
  "Fransa",
  "Polşa",
  "Avstriya",
];

const INCLUDED = [
  "Pulsuz ilkin konsultasiya",
  "Onlayn izləmə paneli",
  "24 saat ərzində geri dönüş",
  "Sənəd şablonları və yoxlama",
];

export default function ServicesPage() {
  return (
    <main>
      <Navbar />

      <PageHero
        badge="Xidmətlərimiz"
        title="Universitet seçimindən vizaya qədər tam dəstək"
        description="Hope Academy xaricdə təhsil prosesinin hər mərhələsini əhatə edən xidmətlər təklif edir. İstər ilk dəfə müraciət edirsiniz, istərsə də artıq qəbul almısınız — sizə uyğun addımı birlikdə atırıq."
      />

      {/* Services bento grid */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-center text-2xl font-semibold text-navy sm:text-3xl">
              Nə təklif edirik?
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, desc, featured }, index) => (
              <Reveal key={title} delay={(index % 3) * 0.08}>
                <div
                  className={`h-full rounded-card border border-gray-100 p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${
                    featured ? "bg-gradient-to-br from-navy/5 to-blue/5 ring-1 ring-blue/20" : "bg-white"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-card bg-gradient-to-br ${ICON_GRADIENTS[index]} text-white shadow-sm`}
                  >
                    <Icon size={22} />
                  </div>
                  {featured && (
                    <span className="mt-3 inline-flex items-center rounded-pill bg-blue/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue">
                      Əsas xidmət
                    </span>
                  )}
                  <h3 className="mt-4 text-base font-semibold text-navy">{title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-light py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-center text-2xl font-semibold text-navy sm:text-3xl">
              Proses necə işləyir?
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-5">
            {STEPS.map(({ icon: Icon, title, desc }, index) => (
              <Reveal key={title} delay={index * 0.1}>
                <div className="relative flex flex-col items-center text-center">
                  {index < STEPS.length - 1 && (
                    <div className="absolute top-7 left-1/2 hidden h-px w-full bg-gradient-to-r from-blue/40 to-gray-200 sm:block" />
                  )}
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue to-navy text-white shadow-md">
                    <Icon size={22} />
                  </div>
                  <span className="mt-3 text-[10px] font-bold uppercase tracking-widest text-gold">
                    0{index + 1}
                  </span>
                  <h3 className="mt-1 text-sm font-semibold text-navy">{title}</h3>
                  <p className="mt-1 text-xs text-gray-500">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Countries & Included */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="rounded-card border border-gray-100 p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-card bg-gradient-to-br from-blue to-navy text-white">
                  <Globe2 size={18} />
                </div>
                <h2 className="text-xl font-semibold text-navy sm:text-2xl">
                  İşlədiyimiz ölkələr
                </h2>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                Avropanın aparıcı universitetləri ilə tərəfdaşlıq edirik və daim yeni
                ölkələr əlavə edirik.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {COUNTRIES.map((country) => (
                  <span
                    key={country}
                    className="rounded-pill bg-light px-4 py-1.5 text-sm font-medium text-navy transition-colors hover:bg-blue hover:text-white"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-card border border-gray-100 bg-gradient-to-br from-navy/3 to-blue/5 p-8 ring-1 ring-blue/10">
              <h2 className="text-xl font-semibold text-navy sm:text-2xl">
                Hər müraciətə daxildir
              </h2>
              <ul className="mt-6 flex flex-col gap-4">
                {INCLUDED.map((item, index) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${ICON_GRADIENTS[index]} text-white`}
                    >
                      <CheckCircle2 size={14} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            Sizə uyğun xidməti birlikdə müəyyənləşdirək
          </h2>
          <p className="max-w-xl text-sm text-white/70 sm:text-base">
            Pulsuz konsultasiya üçün müraciət formunu doldurun — məsləhətçimiz 24 saat
            ərzində sizinlə əlaqə saxlayacaq.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/#apply">
              <Button variant="primary">
                Müraciət et <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Bizimlə əlaqə
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
