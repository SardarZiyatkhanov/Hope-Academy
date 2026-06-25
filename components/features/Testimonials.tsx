"use client";

import { Star, Quote } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";

const TESTIMONIALS = [
  {
    name: "Aysel Məmmədova",
    university: "Humboldt Universiteti",
    city: "Berlin, Almaniya",
    flag: "🇩🇪",
    year: "2023",
    quote:
      "Sənəd hazırlığından viza müsahibəsinə qədər hər addımda Hope Academy komandası yanımda idi. Onlayn paneldə proseslərimi izləmək çox rahat idi.",
    initials: "AM",
  },
  {
    name: "Rəşad Quliyev",
    university: "Amsterdam Universiteti",
    city: "Amsterdam, Niderland",
    flag: "🇳🇱",
    year: "2023",
    quote:
      "Universitet seçimində çox dəqiq məsləhət aldım. Sənədlərimi cəmi 3 həftəyə hazırladıq və qəbul məktubunu vaxtında əldə etdim.",
    initials: "RQ",
  },
  {
    name: "Nigar Əliyeva",
    university: "UCL",
    city: "London, Böyük Britaniya",
    flag: "🇬🇧",
    year: "2024",
    quote:
      "IELTS hazırlığından bursa müraciətə qədər hər mövzuda dəstək gördüm. İndi xəyalımdakı universitetdə oxuyuram!",
    initials: "NƏ",
  },
  {
    name: "Kamran Hüseynov",
    university: "Charles University",
    city: "Praqa, Çexiya",
    flag: "🇨🇿",
    year: "2024",
    quote:
      "Çexiyada pulsuz dövlət universitetinə qəbul olacağımı heç təsəvvür etməzdim. Hope Academy bu imkanı reallığa çevirdi.",
    initials: "KH",
  },
  {
    name: "Səbinə İsmayılova",
    university: "KU Leuven",
    city: "Leuven, Belçika",
    flag: "🇧🇪",
    year: "2024",
    quote:
      "Sənədlər, viza, yaşayış — hamısında kömək etdilər. Bakıdan Belçikaya keçid bu qədər rahat keçəcəyini gözləmirdim.",
    initials: "Sİ",
  },
  {
    name: "Elvin Həsənzadə",
    university: "TU Wien",
    city: "Vyana, Avstriya",
    flag: "🇦🇹",
    year: "2023",
    quote:
      "Mühəndislik proqramına qəbul prosesi mürəkkəb idi, amma Hope Academy hər detalla məşğul oldu. İndi Vyanada yaşayıram!",
    initials: "EH",
  },
  {
    name: "Günay Rzayeva",
    university: "Sorbonne Université",
    city: "Paris, Fransa",
    flag: "🇫🇷",
    year: "2024",
    quote:
      "Fransız dilini bilmirdim, amma hazırlıq proqramı ilə qəbul oldum. Hope Academy hər addımda dəstək oldu.",
    initials: "GR",
  },
  {
    name: "Orxan Babayev",
    university: "University of Warsaw",
    city: "Varşava, Polşa",
    flag: "🇵🇱",
    year: "2023",
    quote:
      "Polşada təhsil haqqında heç məlumatım yox idi. Hope Academy mənə tam yol xəritəsi verdi və hazırda magistr proqramındayam.",
    initials: "OB",
  },
];

const ROW_1 = TESTIMONIALS.slice(0, 4);
const ROW_2 = TESTIMONIALS.slice(4);

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[0] }) {
  return (
    <div aria-label={`${t.name} — ${t.university}`} className="flex w-[340px] shrink-0 flex-col gap-4 rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/[0.08] backdrop-blur-sm transition-colors hover:bg-white/[0.1] sm:w-[380px]">
      <Quote className="text-gold/60" size={24} />
      <p className="line-clamp-4 text-sm leading-relaxed text-white/80">
        {t.quote}
      </p>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue to-navy text-xs font-semibold text-white ring-2 ring-white/10">
            {t.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{t.name}</p>
            <p className="text-xs text-white/50">
              {t.flag} {t.university}
            </p>
          </div>
        </div>
        <div className="flex gap-0.5" aria-label="5 ulduz reytinq">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={11} className="fill-gold text-gold" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="bg-navy py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <span className="block text-center text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Uğur hekayələri
          </span>
          <h2 className="mt-2 text-center text-2xl font-semibold text-white sm:text-3xl">
            Tələbələrimiz nə deyir?
          </h2>
        </Reveal>
      </div>

      <div className="mt-12 flex flex-col gap-5">
        <Marquee speed="slow" pauseOnHover>
          {ROW_1.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </Marquee>
        <Marquee speed="slow" pauseOnHover reverse>
          {ROW_2.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
