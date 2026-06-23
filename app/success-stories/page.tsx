import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GraduationCap, MapPin, Calendar } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Uğur Hekayələri",
  description: "Hope Academy ilə xaricdə təhsil alan tələbələrin uğur hekayələri.",
};

const STORIES = [
  {
    name: "Aysel Məmmədova",
    initials: "AM",
    flag: "🇩🇪",
    university: "Humboldt-Universität zu Berlin",
    field: "Beynəlxalq Münasibətlər",
    year: "2023",
    city: "Berlin, Almaniya",
    cityImage: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400&q=80",
    quote:
      "Hər şey bir zəngdən başladı. Sənəd hazırlığından viza müsahibəsinə qədər Hope Academy hər addımda yanımda idi. İndi Berlində Beynəlxalq Münasibətlər oxuyuram — bir il əvvəl bunu yalnız xəyal edirdim.",
    challenge: "Alman dilini sıfırdan öyrənmək və sənədləri DAAD tələblərinə uyğun hazırlamaq.",
    result: "TestDaF keçib, tam burs əldə etdi, 2023-cü ilin oktyabrında Berlinə getdi.",
    gradient: "from-[#1a3a6b] to-[#0d2244]",
  },
  {
    name: "Rəşad Quliyev",
    initials: "RQ",
    flag: "🇳🇱",
    university: "University of Amsterdam",
    field: "Data Science",
    year: "2023",
    city: "Amsterdam, Niderland",
    cityImage: "https://images.unsplash.com/photo-1534351590666-13e3e96b5571?w=400&q=80",
    quote:
      "Niderlandda İngilisdilli proqramlar olduğunu bilmirdim. Hope Academy bunu mənə açıq etdi. Cəmi 3 həftəyə sənədlərimi hazırladıq və qəbul məktubunu vaxtında aldım.",
    challenge: "Qısa müddətdə (2 ay) tam sənəd paketi hazırlamaq.",
    result: "IELTS 7.0 aldı, UvA Data Science magistrinə qəbul oldu, Holland Scholarship qazandı.",
    gradient: "from-[#bc0031] to-[#8a0023]",
  },
  {
    name: "Nigar Əliyeva",
    initials: "NƏ",
    flag: "🇬🇧",
    university: "University College London",
    field: "Hüquq",
    year: "2024",
    city: "London, Böyük Britaniya",
    cityImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80",
    quote:
      "UCL-ə müraciətin bu qədər mürəkkəb olacağını bilmirdim. Motivasiya məktubu, tövsiyə məktubları, müsahibəyə hazırlıq — hamısında dəstək gördüm. İndi xəyalımdakı universitetdə oxuyuram.",
    challenge: "UCL hüquq fakültəsinin çox yüksək qəbul tələbləri (IELTS 7.5, güclü motivasiya məktubu).",
    result: "IELTS 7.5 aldı, motivasiya məktubunu 6 dəfə təkmilləşdirdi, UCL-ə qəbul oldu.",
    gradient: "from-[#500778] to-[#36054f]",
  },
  {
    name: "Kamran Hüseynov",
    initials: "KH",
    flag: "🇨🇿",
    university: "Charles University",
    field: "Tibb",
    year: "2024",
    city: "Praqa, Çexiya",
    cityImage: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=400&q=80",
    quote:
      "Çexiyada pulsuz tibb oxuyacağımı heç düşünməzdim. 1 il Çex dili kursu ilə Charles University Tibb fakültəsinə qəbul oldum. Xərclər İngiltərə ilə müqayisədə 10 qat azdır.",
    challenge: "Tibb üçün Çex dilini B2 səviyyəsinə çatdırmaq — 10 ay intensiv kurs.",
    result: "B2 Çex dili sertifikatı, Charles University pulsuz tibb proqramına qəbul.",
    gradient: "from-[#003087] to-[#001f59]",
  },
  {
    name: "Səbinə İsmayılova",
    initials: "Sİ",
    flag: "🇧🇪",
    university: "KU Leuven",
    field: "Biotibbiyyat",
    year: "2024",
    city: "Leuven, Belçika",
    cityImage: "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=400&q=80",
    quote:
      "KU Leuven Avropadakı ən yaxşı universitetlər sırasındadır. Belçikada yaşayış xərclərini, KU Leuven-in tədris haqqını, vizasını — hamısını birgə planladıq. Proses çox rahat keçdi.",
    challenge: "Biotibbiyyat proqramı üçün yüksək akademik ortalama (3.8/4.0) və müsahibə tələbi.",
    result: "KU Leuven biotibbiyyat magistrinə qəbul, KU Leuven Excellence bursunu aldı.",
    gradient: "from-[#003f8a] to-[#002a5c]",
  },
  {
    name: "Tural Abbasov",
    initials: "TA",
    flag: "🇦🇹",
    university: "TU Wien",
    field: "Kompüter Mühəndisliyi",
    year: "2022",
    city: "Vyana, Avstriya",
    cityImage: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=400&q=80",
    quote:
      "Vyanada yaşamaq — dünya standartlarında şəhər, münasib həyat xərcləri. TU Wien kompüter mühəndisliyi proqramı beynəlxalq tanınır. Hope Academy olmadan bu qədər sürətli proses mümkün olmazdı.",
    challenge: "Alman dilini sıfırdan öyrənmək, eyni zamanda universitetə müraciət etmək.",
    result: "DSH-2 alman dili sertifikatı, TU Wien kompüter mühəndisliyinə qəbul.",
    gradient: "from-[#0063a6] to-[#004477]",
  },
];

export default function SuccessStoriesPage() {
  return (
    <main>
      <Navbar />

      <PageHero
        badge="Uğur Hekayələri"
        title="Onlar bacardı — siz də bacara bilərsiniz"
        description="Hope Academy ilə xaricdə təhsil alan tələbələrin real hekayələri. Hər biri Bakıdan Avropanın aparıcı universitetlərinə gedən yolu keçdi."
      />

      {/* Stats */}
      <section className="bg-[#0a1c44]">
        <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-white/10 px-4 py-8 sm:px-6 lg:px-8">
          {[
            { value: "1000+", label: "Uğurlu tələbə" },
            { value: "35+", label: "Partner universitet" },
            { value: "12+", label: "Ölkə" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 px-4 py-2 text-center">
              <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
              <p className="text-xs text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stories */}
      <section className="bg-light py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10">
            {STORIES.map((story) => (
              <Reveal key={story.name} delay={0.05}>
                <div className="overflow-hidden rounded-card bg-white shadow-sm ring-1 ring-gray-100">
                  <div className="flex">
                    <div className="relative hidden w-36 shrink-0 overflow-hidden sm:block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={story.cityImage}
                        alt={story.city}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-r ${story.gradient} opacity-40`} />
                    </div>
                    <div className="flex-1">
                  <div className={`h-1.5 w-full bg-gradient-to-r ${story.gradient}`} />
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                      {/* Avatar */}
                      <div className="flex flex-col items-center gap-2 sm:w-40 sm:shrink-0">
                        <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${story.gradient} text-xl font-bold text-white`}>
                          {story.initials}
                        </div>
                        <p className="text-center text-sm font-semibold text-navy">{story.name}</p>
                        <div className="flex flex-col items-center gap-0.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin size={10} /> {story.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={10} /> {story.year}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-lg">{story.flag}</span>
                          <h2 className="text-lg font-semibold text-navy">{story.university}</h2>
                          <span className="rounded-pill bg-blue/10 px-2.5 py-0.5 text-xs font-medium text-blue">
                            {story.field}
                          </span>
                        </div>

                        <blockquote className="mt-4 border-l-2 border-gold pl-4 text-sm italic text-gray-600 sm:text-base">
                          &ldquo;{story.quote}&rdquo;
                        </blockquote>

                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="rounded-[8px] bg-light p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Çətinlik</p>
                            <p className="mt-1 text-xs text-gray-600">{story.challenge}</p>
                          </div>
                          <div className="rounded-[8px] bg-blue/5 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-blue">Nəticə</p>
                            <p className="mt-1 text-xs text-gray-600">{story.result}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                    </div>
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
          <GraduationCap size={36} className="text-gold" />
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            Növbəti uğur hekayəsi sizin olsun
          </h2>
          <p className="max-w-xl text-sm text-white/70 sm:text-base">
            Pulsuz məsləhət üçün müraciət formunu doldurun — komandamız 24 saat ərzində sizinlə əlaqə saxlayacaq.
          </p>
          <Link href="/#apply">
            <Button variant="primary">
              Pulsuz məsləhət al <ArrowRight size={16} />
            </Button>
          </Link>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
