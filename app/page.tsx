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
import { DEFAULT_WORLD_ROUTES } from "@/lib/constants";

const USP_ITEMS = [
  { icon: MapPin, text: "Bakı, Azərbaycan" },
  { icon: Clock, text: "24 saat ərzində cavab" },
  { icon: ShieldCheck, text: "100% şəffaf proses" },
  { icon: Activity, text: "Onlayn izləmə paneli" },
  { icon: Phone, text: "+994 50 123 45 67" },
];

const STEPS = [
  { icon: <FileSignature size={22} />, title: "Müraciət", desc: "Formu doldurun, məsləhətçi sizinlə əlaqə saxlasın" },
  { icon: <FolderCheck size={22} />, title: "Sənədlər", desc: "Lazımi sənədləri toplayın və yükləyin" },
  { icon: <Send size={22} />, title: "Universitetə göndəriş", desc: "Sənədləriniz seçdiyiniz universitetə göndərilir" },
  { icon: <GraduationCap size={22} />, title: "Qəbul", desc: "Universitetdən qəbul məktubunu alırsınız" },
  { icon: <Plane size={22} />, title: "Viza & Uçuş", desc: "Viza prosesi və yola düşmə dəstəyi" },
];

export default function Home() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative bg-navy">
        <ParticleBackground />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[55%_45%] lg:px-8 lg:py-24">
          <HeroContent />

          <div className="order-first lg:order-last">
            <WorldMap routes={DEFAULT_WORLD_ROUTES} height={360} />
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

      <PartnerUniversities />

      {/* How it works */}
      <section id="how-it-works" className="bg-light py-16">
        <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-semibold text-navy sm:text-3xl">
            Necə işləyir?
          </h2>
          <HowItWorksSteps steps={STEPS} />
        </Reveal>
      </section>

      <Testimonials />

      {/* CTA tiles */}
      <section className="bg-white py-16">
        <Reveal className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
          <Link
            href="/login?role=student"
            className="group flex flex-col justify-between gap-4 rounded-card border border-gray-100 bg-light p-8 transition-shadow hover:shadow-md"
          >
            <div>
              <h3 className="text-lg font-semibold text-navy">Ərizəmin statusu</h3>
              <p className="mt-2 text-sm text-gray-600">
                Tələbə kabinetinə daxil olun və ərizənizin gedişatını izləyin.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-blue group-hover:gap-3">
              Daxil ol <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            href="/login?role=admin"
            className="group flex flex-col justify-between gap-4 rounded-card border border-gray-100 bg-navy p-8 text-white transition-shadow hover:shadow-md"
          >
            <div>
              <h3 className="text-lg font-semibold">İdarəetmə paneli</h3>
              <p className="mt-2 text-sm text-white/70">
                Komanda üzvləri üçün tələbə və ərizə idarəetmə paneli.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-gold group-hover:gap-3">
              Daxil ol <ArrowRight size={16} />
            </span>
          </Link>
        </Reveal>
      </section>

      <FAQ />

      {/* Lead form */}
      <section id="apply" className="bg-light py-16">
        <Reveal className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-card bg-white p-6 shadow-sm sm:p-10">
            <h2 className="text-2xl font-semibold text-navy sm:text-3xl">Müraciət et</h2>
            <p className="mt-2 text-sm text-gray-500">
              Formu doldurun — məsləhətçimiz 24 saat ərzində sizinlə əlaqə saxlayacaq.
            </p>
            <div className="mt-8">
              <LeadForm />
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
