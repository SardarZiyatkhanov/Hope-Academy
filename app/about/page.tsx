import Link from "next/link";
import {
  Target,
  Eye,
  ShieldCheck,
  HeartHandshake,
  Users,
  Globe2,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";

const STATS = [
  { value: "1000+", label: "Tələbə" },
  { value: "35+", label: "Universitet tərəfdaşı" },
  { value: "12+", label: "Ölkə" },
  { value: "100%", label: "Şəffaf proses" },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Etibarlılıq",
    desc: "Hər addımda dəqiq və düzgün məlumat — gizli şərtlər və sürprizlər olmadan.",
  },
  {
    icon: HeartHandshake,
    title: "Fərdi yanaşma",
    desc: "Hər tələbənin hekayəsi fərqlidir — planımızı sənin məqsədlərinə uyğun qururuq.",
  },
  {
    icon: Globe2,
    title: "Geniş şəbəkə",
    desc: "Avropanın aparıcı universitetləri ilə birbaşa əlaqələr və yenilənən tərəfdaşlıqlar.",
  },
  {
    icon: Target,
    title: "Nəticəyə fokus",
    desc: "Qəbuldan vizaya qədər prosesi izləyir, son nəticəyə qədər yanında oluruq.",
  },
];

const TEAM = [
  { name: "Aytən Həsənova", role: "Baş məsləhətçi" },
  { name: "Rəşad Quliyev", role: "Viza üzrə mütəxəssis" },
  { name: "Nərmin Əhmədova", role: "Universitet əlaqələri" },
  { name: "Tural Məmmədov", role: "Tələbə dəstəyi" },
];

export default function AboutPage() {
  return (
    <main>
      <Navbar />

      <PageHero
        badge="Haqqımızda"
        title="Bakıdan dünyaya açılan qapı"
        description="Hope Academy 2015-ci ildən bəri Azərbaycanlı tələbələrə xaricdə təhsil almaq üçün universitet seçimindən tutmuş viza prosesinə qədər hər addımda dəstək göstərir. Məqsədimiz sadədir: hər tələbənin öz potensialına uyğun ən doğru universiteti tapmasına kömək etmək."
      />

      {/* Stats */}
      <section className="bg-[#0a1c44]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 divide-x divide-y divide-white/10 px-4 py-8 sm:grid-cols-4 sm:divide-y-0 sm:px-6 lg:px-8">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08}>
              <div className="flex flex-col items-center gap-1 px-2 py-3 text-center">
                <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                <p className="text-xs text-white/60 sm:text-sm">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-light py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="h-full rounded-card bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-card bg-gradient-to-br from-blue to-navy text-white">
                <Target size={24} />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-navy">Missiyamız</h2>
              <p className="mt-2 text-sm text-gray-600">
                Hər bir tələbəyə xaricdə təhsil prosesini sadə, şəffaf və əlçatan etmək.
                Sənədlərin hazırlanmasından tutmuş viza müsahibəsinə qədər hər mərhələdə
                etibarlı məsləhət və dəstək təqdim edirik.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-card bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-card bg-gradient-to-br from-gold to-accent text-white">
                <Eye size={24} />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-navy">Vizyonumuz</h2>
              <p className="mt-2 text-sm text-gray-600">
                Azərbaycanlı gənclər üçün xaricdə təhsilin ilk seçim mənbəyi olmaq —
                tələbələri dünyanın aparıcı universitetləri ilə birləşdirən etibarlı
                körpü qurmaq.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-center text-2xl font-semibold text-navy sm:text-3xl">
              Niyə Hope Academy?
            </h2>
          </Reveal>
          <div className="mt-12 flex flex-col gap-12 sm:gap-16">
            {VALUES.map(({ icon: Icon, title, desc }, index) => (
              <Reveal key={title} delay={index * 0.08}>
                <div
                  className={`flex flex-col items-center gap-6 text-center sm:gap-10 sm:text-left ${
                    index % 2 === 1 ? "sm:flex-row-reverse sm:text-right" : "sm:flex-row"
                  }`}
                >
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-card bg-gradient-to-br from-blue to-navy text-white shadow-lg sm:h-28 sm:w-28">
                    <Icon size={40} />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-gold">0{index + 1}</span>
                    <h3 className="mt-1 text-lg font-semibold text-navy sm:text-xl">{title}</h3>
                    <p className="mt-2 text-sm text-gray-500 sm:text-base">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-light py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex items-center gap-2">
              <Users size={20} className="text-blue" />
              <h2 className="text-2xl font-semibold text-navy sm:text-3xl">Komandamız</h2>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              Təcrübəli məsləhətçilər və viza mütəxəssislərindən ibarət komandamız hər
              addımda yanınızdadır.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member, index) => (
              <Reveal key={member.name} delay={index * 0.08}>
                <div className="flex flex-col items-center gap-3 rounded-card bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="rounded-full bg-gradient-to-br from-blue via-accent to-gold p-[3px]">
                    <Avatar name={member.name} className="h-16 w-16 border-2 border-white text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            Xaricdə təhsil yolculuğuna bu gün başla
          </h2>
          <p className="max-w-xl text-sm text-white/70 sm:text-base">
            Komandamızla əlaqə saxlayın, ya da birbaşa müraciət formunu doldurun —
            sizə uyğun planı birlikdə quraq.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact">
              <Button variant="primary">
                Bizimlə əlaqə <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/#apply">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Müraciət et
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
