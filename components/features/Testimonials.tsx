import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const TESTIMONIALS = [
  {
    name: "Aysel Məmmədova",
    detail: "Humboldt Universiteti, Berlin",
    quote:
      "Sənəd hazırlığından viza müsahibəsinə qədər hər addımda Hope Academy komandası yanımda idi. Onlayn paneldə proseslərimi izləmək çox rahat idi.",
    initials: "AM",
  },
  {
    name: "Rəşad Quliyev",
    detail: "Amsterdam Universiteti, Hollandiya",
    quote:
      "Universitet seçimində çox dəqiq məsləhət aldım. Sənədlərimi cəmi 3 həftəyə hazırladıq və qəbul məktubunu vaxtında əldə etdim.",
    initials: "RQ",
  },
  {
    name: "Nigar Əliyeva",
    detail: "UCL, London",
    quote:
      "IELTS hazırlığından bursa müraciətə qədər hər mövzuda dəstək gördüm. İndi xəyalımdakı universitetdə oxuyuram!",
    initials: "NƏ",
  },
];

export function Testimonials() {
  return (
    <section className="bg-light py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-center text-2xl font-semibold text-navy sm:text-3xl">
            Tələbələrimiz nə deyir?
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t, index) => (
            <Reveal
              key={t.name}
              delay={index * 0.1}
              className="flex flex-col gap-4 rounded-card bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Quote className="text-blue" size={24} />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-gold text-gold" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">{t.quote}</p>
              <div className="mt-auto flex items-center gap-3 pt-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
