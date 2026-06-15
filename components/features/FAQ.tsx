"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

const FAQ_ITEMS = [
  {
    q: "Xaricdə təhsil üçün müraciət prosesi nə qədər davam edir?",
    a: "Adətən sənədlərin hazırlanmasından qəbul məktubunun alınmasına qədər 2-6 ay vaxt aparır. Bu, seçdiyiniz ölkə, universitet və proqramdan asılı olaraq dəyişə bilər.",
  },
  {
    q: "Hope Academy-nin xidmətləri nə qədər başa gəlir?",
    a: "İlkin konsultasiya pulsuzdur. Xidmət haqqı seçdiyiniz paketdən (universitet seçimi, sənəd hazırlığı, viza dəstəyi və s.) asılı olaraq fərqlənir — dəqiq qiymət üçün bizimlə əlaqə saxlayın.",
  },
  {
    q: "IELTS/TOEFL sertifikatım yoxdur, müraciət edə bilərəm?",
    a: "Bəli. Bir sıra universitetlər dil sertifikatı olmadan və ya hazırlıq proqramı ilə qəbul edir. Sizə uyğun seçimləri birlikdə müəyyənləşdiririk.",
  },
  {
    q: "Hansı ölkələrə müraciət etmək mümkündür?",
    a: "Almaniya, Avstriya, Hollandiya, Fransa, Polşa, Belçika, Çexiya, Macarıstan, İtaliya, Böyük Britaniya, Türkiyə və BƏƏ daxil olmaqla 35-dən çox universitetlə əməkdaşlıq edirik.",
  },
  {
    q: "Viza prosesində dəstək alacam?",
    a: "Bəli. Viza ərizəsinin doldurulmasından sənəd siyahısının yoxlanmasına və müsahibəyə hazırlığa qədər bütün addımlarda yanınızdayıq.",
  },
  {
    q: "Eyni vaxtda bir neçə universitetə müraciət edə bilərəmmi?",
    a: "Bəli, strategiyanıza uyğun olaraq bir neçə universitetə paralel müraciət edə bilərsiniz — bu, qəbul şansınızı artırır.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-center text-2xl font-semibold text-navy sm:text-3xl">
            Tez-tez verilən suallar
          </h2>
        </Reveal>
        <div className="mt-10 flex flex-col gap-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal
                key={item.q}
                delay={index * 0.05}
                className="rounded-card border border-gray-100 bg-light"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-navy">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-gray-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-gray-600">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
