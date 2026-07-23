"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";

const STEPS = [
  {
    id: "field",
    question: "Hansı sahəni oxumaq istəyirsiniz?",
    options: [
      { value: "engineering", label: "🔧 Mühəndislik & Texnologiya" },
      { value: "business", label: "💼 Biznes & İqtisadiyyat" },
      { value: "medicine", label: "🩺 Tibb & Biologiya" },
      { value: "humanities", label: "📚 Humanitar & Sosial elmlər" },
      { value: "it", label: "💻 IT & Data Science" },
      { value: "law", label: "⚖️ Hüquq" },
    ],
  },
  {
    id: "budget",
    question: "İllik büdcəniz nə qədərdir?",
    options: [
      { value: "free", label: "🎓 Pulsuz / Burs axtarıram" },
      { value: "low", label: "💶 €1.000 – €5.000/il" },
      { value: "mid", label: "💶 €5.000 – €10.000/il" },
      { value: "high", label: "💶 €10.000+/il" },
    ],
  },
  {
    id: "language",
    question: "Dil bilikləriniz necədir?",
    options: [
      { value: "az_only", label: "🗣️ Yalnız Azərbaycan dili" },
      { value: "eng_basic", label: "🇬🇧 İngilis dili (IELTS 5.5 altı)" },
      { value: "eng_good", label: "🇬🇧 İngilis dili (IELTS 5.5–6.5)" },
      { value: "eng_great", label: "🇬🇧 İngilis dili (IELTS 6.5+)" },
      { value: "german", label: "🇩🇪 Alman dili (B1+)" },
    ],
  },
];

type Answers = Record<string, string>;

interface Recommendation {
  flag: string;
  country: string;
  slug: string;
  reason: string;
  universities: string[];
}

function getRecommendations(answers: Answers): Recommendation[] {
  const { field, budget, language } = answers;
  const recs: Recommendation[] = [];

  const wantsGerman = language === "german";
  const wantsFree = budget === "free";
  const hasGoodEng = language === "eng_good" || language === "eng_great";
  const needsLearnLang = language === "az_only" || language === "eng_basic";

  if (wantsGerman || (wantsFree && !needsLearnLang)) {
    recs.push({
      flag: "🇩🇪", country: "Almaniya", slug: "almaniya",
      reason: "Pulsuz dövlət universitetləri, yüksək akademik keyfiyyət",
      universities: ["TU München", "Humboldt Universität Berlin", "RWTH Aachen"],
    });
  }

  if (hasGoodEng && (budget === "mid" || budget === "high")) {
    recs.push({
      flag: "🇳🇱", country: "Niderland", slug: "niderland",
      reason: "2.000+ İngilisdilli proqram, innovasiya mərkəzi",
      universities: ["University of Amsterdam", "TU Delft", "Leiden University"],
    });
  }

  if ((field === "medicine" || wantsFree || needsLearnLang) && budget !== "high") {
    recs.push({
      flag: "🇨🇿", country: "Çexiya", slug: "cexiya",
      reason: "Ən aşağı yaşayış xərci, pulsuz Çexdilli proqramlar",
      universities: ["Charles University", "CTU Prague", "Masaryk University"],
    });
  }

  if (hasGoodEng && (field === "business" || field === "law" || field === "humanities")) {
    recs.push({
      flag: "🇧🇪", country: "Belçika", slug: "belcika",
      reason: "AB mərkəzi, KU Leuven dünya top 100-ündədir",
      universities: ["KU Leuven", "Ghent University", "ULB"],
    });
  }

  if (hasGoodEng && budget !== "free" && field !== "medicine") {
    recs.push({
      flag: "🇵🇱", country: "Polşa", slug: "polsa",
      reason: "Avropa'nın ən münasib universitetləri, İngilisdilli proqramlar",
      universities: ["University of Warsaw", "Warsaw University of Technology"],
    });
  }

  if (wantsGerman || budget === "low" || budget === "free") {
    recs.push({
      flag: "🇦🇹", country: "Avstriya", slug: "avstriya",
      reason: "Münasib tədris haqqı, Vyana — dünyanın №1 yaşanılabilir şəhəri",
      universities: ["University of Vienna", "TU Wien", "University of Graz"],
    });
  }

  // always show at least 2
  if (recs.length === 0) {
    recs.push(
      { flag: "🇩🇪", country: "Almaniya", slug: "almaniya", reason: "Pulsuz dövlət universitetləri", universities: ["TU München", "Humboldt Universität"] },
      { flag: "🇨🇿", country: "Çexiya", slug: "cexiya", reason: "Münasib qiymətli, Şengen zonası", universities: ["Charles University", "CTU Prague"] }
    );
  }

  return recs.slice(0, 3);
}

export function UniversityFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);

  const currentStep = STEPS[step];

  const select = (value: string) => {
    const newAnswers = { ...answers, [currentStep.id]: value };
    setAnswers(newAnswers);
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setDone(false);
  };

  const recommendations = done ? getRecommendations(answers) : [];

  return (
    <section className="bg-light py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            İnteraktiv bələdçi
          </span>
          <h2 className="mt-2 text-2xl font-semibold text-navy sm:text-3xl">
            Sizə uyğun ölkəni tapaq
          </h2>
          <p className="mt-2 text-sm text-gray-500">3 sadə suala cavab verin</p>
        </div>

        {/* Progress dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i < step || done ? "w-6 bg-blue" : i === step && !done ? "w-6 bg-gold" : "w-2 bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="rounded-card bg-white p-6 shadow-sm sm:p-8"
              >
                <h3 className="text-lg font-semibold text-navy">{currentStep.question}</h3>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {currentStep.options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => select(opt.value)}
                      className="flex items-center gap-3 rounded-card border border-gray-100 p-4 text-left text-sm font-medium text-navy transition-all hover:border-blue hover:bg-blue/5 hover:text-blue"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-card bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-navy">Sizə uyğun ölkələr:</h3>
                  <button
                    type="button"
                    onClick={reset}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-navy"
                  >
                    <RotateCcw size={12} /> Yenidən
                  </button>
                </div>

                <div className="mt-5 flex flex-col gap-4">
                  {recommendations.map((rec, i) => (
                    <motion.div
                      key={rec.slug}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link
                        href={`/countries/${rec.slug}`}
                        className="group flex items-start gap-4 rounded-card border border-gray-100 p-4 transition-all hover:border-blue/30 hover:shadow-md"
                      >
                        <span className="text-3xl">{rec.flag}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-navy">{rec.country}</p>
                            {i === 0 && (
                              <span className="rounded-pill bg-gold/20 px-2 py-0.5 text-[10px] font-semibold text-gold">
                                Ən uyğun
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-gray-500">{rec.reason}</p>
                          <p className="mt-1.5 text-xs text-blue">
                            {rec.universities.join(" · ")}
                          </p>
                        </div>
                        <ArrowRight size={16} className="mt-1 shrink-0 text-gray-300 transition-colors group-hover:text-blue" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 rounded-card bg-navy/5 p-4 text-center">
                  <p className="text-sm text-gray-600">
                    Daha ətraflı məsləhət almaq istəyirsiniz?
                  </p>
                  <Link href="/#apply" className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-blue hover:gap-3 transition-all">
                    Pulsuz məsləhət al <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
