import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Target,
  Eye,
  ShieldCheck,
  HeartHandshake,
  Globe2,
  ArrowRight,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Haqqımızda",
  description: "Hope Academy — 2015-ci ildən Azərbaycanlı tələbələrə Avropada təhsil almaq üçün etibarlı dəstək.",
};
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { StaggerReveal, StaggerItem } from "@/components/ui/StaggerReveal";
import { MotionCard } from "@/components/ui/MotionCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const STATS = [
  { value: 2000, suffix: "+", label: "Uğurlu tələbə" },
  { value: 50, suffix: "+", label: "Tərəfdaş universitet" },
  { value: 35, suffix: "+", label: "Ölkə" },
  { value: 100, suffix: "%", label: "Şəffaf proses" },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Etibarlılıq",
    desc: "Hər addımda dəqiq və düzgün məlumat — gizli şərtlər və sürprizlər olmadan.",
    gradient: "from-blue to-navy",
  },
  {
    icon: HeartHandshake,
    title: "Fərdi yanaşma",
    desc: "Hər tələbənin hekayəsi fərqlidir — planımızı sənin məqsədlərinə uyğun qururuq.",
    gradient: "from-gold to-accent",
  },
  {
    icon: Globe2,
    title: "Geniş şəbəkə",
    desc: "Avropanın aparıcı universitetləri ilə birbaşa əlaqələr və yenilənən tərəfdaşlıqlar.",
    gradient: "from-accent to-blue",
  },
  {
    icon: Target,
    title: "Nəticəyə fokus",
    desc: "Qəbuldan vizaya qədər prosesi izləyir, son nəticəyə qədər yanında oluruq.",
    gradient: "from-navy to-blue",
  },
];

const TEAM = [
  {
    name: "Aytən Həsənova",
    role: "Baş məsləhətçi",
    exp: "8 il",
    countries: ["🇩🇪", "🇦🇹"],
    location: "Bakı",
    bio: "300+ tələbəyə Avropa universitetlərinin yolunu açdı.",
    gradient: "from-[#1a4aa8] to-[#0e2454]",
  },
  {
    name: "Rəşad Quliyev",
    role: "Viza mütəxəssisi",
    exp: "5 il",
    countries: ["🇳🇱", "🇧🇪"],
    location: "Bakı",
    bio: "Niderland və Belçika viza proseslərinin eksperti.",
    gradient: "from-[#bc0031] to-[#6b001c]",
  },
  {
    name: "Nərmin Əhmədova",
    role: "Universitet əlaqələri",
    exp: "6 il",
    countries: ["🇨🇿", "🇵🇱"],
    location: "Praqa",
    bio: "Çexiya universitetləri ilə birbaşa əlaqələri idarə edir.",
    gradient: "from-[#003087] to-[#001a4d]",
  },
  {
    name: "Tural Məmmədov",
    role: "Tələbə dəstəyi",
    exp: "3 il",
    countries: ["🇫🇷", "🇩🇪"],
    location: "Paris",
    bio: "Özü Parisdə oxumuş, hər tələbəyə şəxsi mentor.",
    gradient: "from-[#003f8a] to-[#002050]",
  },
];

export default function AboutPage() {
  return (
    <main>
      <Navbar />

      <PageHero
        badge="Haqqımızda"
        title="Bakıdan dünyaya açılan qapı"
        description="Hope Academy 2015-ci ildən bəri Azərbaycanlı tələbələrə xaricdə təhsil almaq üçün universitet seçimindən tutmuş viza prosesinə qədər hər addımda dəstək göstərir."
      />

      {/* Stats */}
      <section className="bg-[#0a1c44]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08}>
              <div className="flex flex-col items-center gap-1 bg-[#0a1c44] px-4 py-8 text-center">
                <p className="text-3xl font-bold text-white sm:text-4xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-white/50 sm:text-sm">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-light py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="group h-full overflow-hidden rounded-card bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-44 overflow-hidden">
                <Image
                  src="/images/about/team.jpg"
                  alt="Komanda"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
              </div>
              <div className="p-8 pt-4">
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
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="group h-full overflow-hidden rounded-card bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-44 overflow-hidden">
                <Image
                  src="/images/about/graduation.jpg"
                  alt="Məzuniyyət"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
              </div>
              <div className="p-8 pt-4">
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
            {VALUES.map(({ icon: Icon, title, desc, gradient }, index) => (
              <Reveal key={title} delay={index * 0.08}>
                <div
                  className={`flex flex-col items-center gap-6 text-center sm:gap-10 sm:text-left ${
                    index % 2 === 1 ? "sm:flex-row-reverse sm:text-right" : "sm:flex-row"
                  }`}
                >
                  <div className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-card bg-gradient-to-br ${gradient} text-white shadow-lg sm:h-28 sm:w-28`}>
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

      {/* Campus banner */}
      <section className="relative h-56 overflow-hidden sm:h-72">
        <Image
          src="/images/about/campus.jpg"
          alt="Universitet kampusu"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/60 to-transparent" />
        <Reveal className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-2xl font-bold text-white sm:text-3xl">
              Avropanın ən yaxşı kampusları <span className="text-gold">səni gözləyir</span>
            </p>
            <p className="mt-2 max-w-md text-sm text-white/70">
              Almaniyadan Avstriyaya, Niderlanddan Çexiyaya — hər ölkədə etibarlı tərəfdaşlarımız var.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Team */}
      <section className="bg-light py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Komanda
              </span>
              <h2 className="mt-2 text-2xl font-semibold text-navy sm:text-3xl">
                Sizinlə çalışan insanlar
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Hər üzv öz sahəsinin mütəxəssisi — real təcrübə, real nəticə.
              </p>
            </div>
          </Reveal>

          <StaggerReveal className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* TODO: Real team photos and bios needed — current data is illustrative */}
            {TEAM.map((member) => (
              <StaggerItem key={member.name}>
                <MotionCard className="group relative overflow-hidden rounded-card bg-white shadow-sm ring-1 ring-gray-100 hover:ring-blue/20">
                  {/* Top gradient bar */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${member.gradient}`} />

                  <div className="p-6">
                    {/* Avatar */}
                    <div className="flex items-start justify-between">
                      <div className={`rounded-full bg-gradient-to-br ${member.gradient} p-[2.5px]`}>
                        <Avatar
                          name={member.name}
                          className="h-14 w-14 border-2 border-white text-base"
                        />
                      </div>
                      <span className="rounded-pill bg-gold/10 px-2.5 py-1 text-[11px] font-semibold text-gold">
                        {member.exp}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="mt-4">
                      <p className="font-semibold text-navy">{member.name}</p>
                      <p className="mt-0.5 text-xs text-blue">{member.role}</p>
                    </div>

                    <p className="mt-2 text-xs text-gray-500">{member.bio}</p>

                    {/* Countries + location */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-1">
                        {member.countries.map((flag) => (
                          <span
                            key={flag}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50 text-sm ring-1 ring-gray-100"
                          >
                            {flag}
                          </span>
                        ))}
                      </div>
                      <span className="flex items-center gap-1 text-[10px] text-gray-400">
                        <MapPin size={9} /> {member.location}
                      </span>
                    </div>
                  </div>
                </MotionCard>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            Xaricdə təhsil səfərinə bu gün başla
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
