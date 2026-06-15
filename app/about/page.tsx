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

      {/* Hero */}
      <section className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-pill bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90">
              Haqqımızda
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Bakıdan dünyaya açılan qapı
            </h1>
            <p className="mt-4 text-base text-white/70 sm:text-lg">
              Hope Academy 2015-ci ildən bəri Azərbaycanlı tələbələrə xaricdə təhsil
              almaq üçün universitet seçimindən tutmuş viza prosesinə qədər hər
              addımda dəstək göstərir. Məqsədimiz sadədir: hər tələbənin öz
              potensialına uyğun ən doğru universiteti tapmasına kömək etmək.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#0a1c44]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 divide-x divide-y divide-white/10 px-4 py-8 sm:grid-cols-4 sm:divide-y-0 sm:px-6 lg:px-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 px-2 py-3 text-center">
              <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
              <p className="text-xs text-white/60 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-light py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-card bg-white p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-card bg-light text-blue">
              <Target size={24} />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-navy">Missiyamız</h2>
            <p className="mt-2 text-sm text-gray-600">
              Hər bir tələbəyə xaricdə təhsil prosesini sadə, şəffaf və əlçatan etmək.
              Sənədlərin hazırlanmasından tutmuş viza müsahibəsinə qədər hər mərhələdə
              etibarlı məsləhət və dəstək təqdim edirik.
            </p>
          </div>
          <div className="rounded-card bg-white p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-card bg-light text-blue">
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
      </section>

      {/* Values */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-semibold text-navy sm:text-3xl">
            Niyə Hope Academy?
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, desc }) => (
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

      {/* Team */}
      <section className="bg-light py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-blue" />
            <h2 className="text-2xl font-semibold text-navy sm:text-3xl">Komandamız</h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Təcrübəli məsləhətçilər və viza mütəxəssislərindən ibarət komandamız hər
            addımda yanınızdadır.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center gap-3 rounded-card bg-white p-6 text-center shadow-sm"
              >
                <Avatar name={member.name} className="h-16 w-16 text-xl" />
                <div>
                  <p className="text-sm font-semibold text-navy">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
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
        </div>
      </section>

      <Footer />
    </main>
  );
}
