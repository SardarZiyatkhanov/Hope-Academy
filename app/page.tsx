import Link from "next/link";
import {
  FileSignature,
  FolderCheck,
  Send,
  GraduationCap,
  Plane,
  MapPin,
  Clock,
  ShieldCheck,
  Activity,
  Phone,
  ArrowRight,
  Compass,
  FileCheck,
  Home as HomeIcon,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WorldMap } from "@/components/features/WorldMap";
import { LeadForm } from "@/components/features/LeadForm";
import { HeroContent } from "@/components/features/HeroContent";
import { ParticleBackground } from "@/components/features/ParticleBackground";
import { HowItWorksSteps } from "@/components/features/HowItWorksSteps";
import { PartnerUniversities } from "@/components/features/PartnerUniversities";
import { Testimonials } from "@/components/features/Testimonials";
import { FAQ } from "@/components/features/FAQ";
import { Reveal } from "@/components/ui/Reveal";
import { UniversityFinder } from "@/components/features/UniversityFinder";
import { CostEstimator } from "@/components/features/CostEstimator";
import { DEFAULT_WORLD_ROUTES, CONTACT } from "@/lib/constants";

const USP_ITEMS = [
  { icon: MapPin, text: "Bakı, Azərbaycan" },
  { icon: Clock, text: "24 saat ərzində cavab" },
  { icon: ShieldCheck, text: "100% şəffaf proses" },
  { icon: Activity, text: "Onlayn izləmə paneli" },
  { icon: Phone, text: CONTACT.phone },
];

const STEPS = [
  { icon: <FileSignature size={22} />, title: "Müraciət", desc: "Formu doldurun, məsləhətçi sizinlə əlaqə saxlasın" },
  { icon: <FolderCheck size={22} />, title: "Sənədlər", desc: "Lazımi sənədləri toplayın və yükləyin" },
  { icon: <Send size={22} />, title: "Universitetə göndəriş", desc: "Sənədləriniz seçdiyiniz universitetə göndərilir" },
  { icon: <GraduationCap size={22} />, title: "Qəbul", desc: "Universitetdən qəbul məktubunu alırsınız" },
  { icon: <Plane size={22} />, title: "Viza & Uçuş", desc: "Viza prosesi və yola düşmə dəstəyi" },
];

const HOME_SERVICES = [
  {
    icon: Compass,
    title: "Universitet seçimi",
    desc: "Maraqlarınıza və büdcənizə uyğun ən doğru universitet və proqramı birlikdə müəyyənləşdiririk.",
    gradient: "from-blue to-navy",
  },
  {
    icon: FileCheck,
    title: "Sənəd hazırlığı",
    desc: "Diplom, transkript, motivasiya məktubu — bütün sənədləri tələblərə uyğun hazırlayırıq.",
    gradient: "from-gold to-accent",
  },
  {
    icon: Send,
    title: "Müraciətin göndərilməsi",
    desc: "Sənədləri vaxtında və düzgün formatda universitetə çatdırır, prosesi izləyirik.",
    gradient: "from-accent to-blue",
  },
  {
    icon: GraduationCap,
    title: "Qəbul & Qeydiyyat",
    desc: "Qəbul məktubundan sonra qeydiyyat, ödəniş və universitetin bütün tələblərini həll edirik.",
    gradient: "from-navy to-blue",
  },
  {
    icon: Plane,
    title: "Viza & Uçuş",
    desc: "Viza sənədləri, müsahibəyə hazırlıq və uçuş planlaması — hamısında dəstək.",
    gradient: "from-gold to-navy",
  },
  {
    icon: HomeIcon,
    title: "Yaşayış dəstəyi",
    desc: "Yeni şəhərdə yaşayış yeri tapılması və məskunlaşma üçün praktiki məsləhətlər.",
    gradient: "from-blue to-accent",
  },
];

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "Hope Academy",
            alternateName: "Hope Academy — Edu and Career Counselling",
            url: "https://hopeacademy.az",
            logo: "https://hopeacademy.az/logo.jpg",
            image: "https://hopeacademy.az/logo.jpg",
            description: "Bakıdan bütün dünyaya — təhsil məsləhəti və müraciət platforması",
            address: {
              "@type": "PostalAddress",
              streetAddress: CONTACT.address,
              addressLocality: "Bakı",
              addressCountry: "AZ",
            },
            telephone: CONTACT.phoneRaw,
            email: CONTACT.email,
            sameAs: [],
          }),
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[85vh] bg-navy">
        <ParticleBackground />
        <div className="relative z-10 mx-auto grid min-h-[85vh] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <HeroContent />
          <div className="order-first lg:order-last">
            <WorldMap routes={DEFAULT_WORLD_ROUTES} className="h-[320px] sm:h-[400px] lg:h-[520px]" />
          </div>
        </div>
      </section>

      {/* USP strip */}
      <section className="bg-[#0a1c44]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 divide-y divide-white/10 px-4 py-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:grid-cols-5 lg:px-8">
          {USP_ITEMS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 px-2 py-3 sm:justify-center sm:px-4">
              <Icon size={18} className="text-gold" />
              <span className="text-sm font-medium text-white/90">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Xidmətlərimiz
              </span>
              <h2 className="mt-2 text-2xl font-semibold text-navy sm:text-3xl">
                Hər addımda yanınızdayıq
              </h2>
            </div>
            <Link
              href="/services"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-blue transition-all hover:gap-3"
            >
              Hamısına bax <ArrowRight size={15} />
            </Link>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_SERVICES.map(({ icon: Icon, title, desc, gradient }, index) => (
              <Reveal key={title} delay={(index % 3) * 0.08}>
                <div className="group h-full rounded-card border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-card bg-gradient-to-br ${gradient} text-white shadow-sm`}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-navy">{title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PartnerUniversities />

      {/* How it works */}
      <section id="how-it-works" className="bg-light py-20 sm:py-28">
        <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="block text-center text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Proses
          </span>
          <h2 className="mt-2 text-center text-2xl font-semibold text-navy sm:text-3xl">
            Necə işləyir?
          </h2>
          <HowItWorksSteps steps={STEPS} />
        </Reveal>
      </section>

      <Testimonials />

      <FAQ />

      <UniversityFinder />

      <CostEstimator />

      {/* Lead form */}
      <section id="apply" className="relative overflow-hidden bg-navy py-20 sm:py-28">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue/25 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-blue/15 blur-3xl" />

        <Reveal className="relative z-10 mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Müraciət
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Xaricdə təhsil yolculuğuna{" "}
            <span className="bg-gradient-to-r from-gold via-yellow-300 to-gold bg-clip-text text-transparent">
              bu gün başla
            </span>
          </h2>
          <p className="mt-4 text-white/60 sm:text-base">
            Formu doldurun — məsləhətçimiz 24 saat ərzində sizinlə əlaqə saxlayacaq.
          </p>
        </Reveal>

        <Reveal delay={0.12} className="relative z-10 mx-auto mt-10 max-w-xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-card bg-white p-6 shadow-2xl ring-1 ring-white/10 sm:p-10">
            <LeadForm />
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
