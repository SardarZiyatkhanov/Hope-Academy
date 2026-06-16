"use client";

import { useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

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
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length);

  const t = TESTIMONIALS[current];

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

        <div className="mt-12 flex flex-col items-center gap-8">
          {/* Main quote card */}
          <div className="relative w-full max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="rounded-card bg-white/5 p-8 ring-1 ring-white/10 sm:p-12"
              >
                <Quote className="text-gold" size={32} />
                <p className="mt-6 text-lg leading-relaxed text-white/90 sm:text-xl">
                  {t.quote}
                </p>

                <div className="mt-8 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue to-navy text-sm font-semibold text-white ring-2 ring-white/20">
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="text-sm text-white/60">
                        {t.flag} {t.university} · {t.city}
                      </p>
                    </div>
                  </div>
                  <div className="hidden flex-col items-end gap-1 sm:flex">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} className="fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="text-xs text-white/40">{t.year}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Əvvəlki"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? "w-6 bg-gold" : "w-2 bg-white/30"
                  }`}
                  aria-label={`${i + 1}-ci rəy`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Növbəti"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
