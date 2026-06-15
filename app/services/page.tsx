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
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

const SERVICES = [
  {
    icon: Compass,
    title: "Universitet və proqram seçimi",
    desc: "Maraqlarınıza, büdcənizə və akademik göstəricilərinizə uyğun universitet və proqramları birgə müəyyənləşdiririk.",
  },
  {
    icon: FileCheck,
    title: "Sənədlərin hazırlanması",
    desc: "Diplom, transkript, motivasiya məktubu və tövsiyə məktublarının tələblərə uyğun hazırlanmasında dəstək.",
  },
  {
    icon: Send,
    title: "Müraciətin göndərilməsi",
    desc: "Bütün sənədləri universitetin tələb etdiyi formatda və müddətdə təqdim edirik, prosesi sizin adınızdan izləyirik.",
  },
  {
    icon: GraduationCap,
    title: "Qəbul məktubu və qeydiyyat",
    desc: "Qəbul məktubunu aldıqdan sonra qeydiyyat, ödəniş və universitetlə əlaqəli bütün addımlarda dəstək.",
  },
  {
    icon: Plane,
    title: "Viza və uçuş dəstəyi",
    desc: "Viza üçün sənəd toplanması, müsahibəyə hazırlıq və uçuş planlamasında köməklik göstəririk.",
  },
  {
    icon: HomeIcon,
    title: "Yaşayış və məskunlaşma",
    desc: "Ünvana çatdıqdan sonra yaşayış yeri tapılması və ilk günlərdə yerləşmə üçün məsləhətlər.",
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

      {/* Hero */}
      <section className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-pill bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90">
              Xidmətlərimiz
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Universitet seçimindən vizaya qədər tam dəstək
            </h1>
            <p className="mt-4 text-base text-white/70 sm:text-lg">
              Hope Academy xaricdə təhsil prosesinin hər mərhələsini əhatə edən
              xidmətlər təklif edir. İstər ilk dəfə müraciət edirsiniz, istərsə də
              artıq qəbul almısınız — sizə uyğun addımı birlikdə atırıq.
            </p>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-card border border-gray-100 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-card bg-light text-blue">
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-light py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-semibold text-navy sm:text-3xl">
            Proses necə işləyir?
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-5">
            {STEPS.map(({ icon: Icon, title, desc }, index) => (
              <div key={title} className="relative flex flex-col items-center text-center">
                {index < STEPS.length - 1 && (
                  <div className="absolute top-7 left-1/2 hidden h-px w-full bg-gray-200 sm:block" />
                )}
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white text-blue shadow-sm">
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-navy">{title}</h3>
                <p className="mt-1 text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries & Included */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-xl font-semibold text-navy sm:text-2xl">
              İşlədiyimiz ölkələr
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Avropanın aparıcı universitetləri ilə tərəfdaşlıq edirik və daim yeni
              ölkələr əlavə edirik.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {COUNTRIES.map((country) => (
                <span
                  key={country}
                  className="rounded-pill bg-light px-4 py-1.5 text-sm font-medium text-navy"
                >
                  {country}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-navy sm:text-2xl">
              Hər müraciətə daxildir
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle2 size={18} className="shrink-0 text-blue" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
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
        </div>
      </section>

      <Footer />
    </main>
  );
}
