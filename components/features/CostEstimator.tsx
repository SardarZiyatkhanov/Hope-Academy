"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, RotateCcw, TrendingDown } from "lucide-react";

const COUNTRIES = [
  { slug: "almaniya", label: "Almaniya", flag: "🇩🇪" },
  { slug: "niderland", label: "Niderland", flag: "🇳🇱" },
  { slug: "cexiya", label: "Çexiya", flag: "🇨🇿" },
  { slug: "belcika", label: "Belçika", flag: "🇧🇪" },
  { slug: "fransa", label: "Fransa", flag: "🇫🇷" },
  { slug: "polsa", label: "Polşa", flag: "🇵🇱" },
  { slug: "avstriya", label: "Avstriya", flag: "🇦🇹" },
];

const LEVELS = [
  { value: "bachelor", label: "Bakalavr" },
  { value: "master", label: "Magistr" },
  { value: "phd", label: "Doktorantura (PhD)" },
];

type Level = "bachelor" | "master" | "phd";

interface CostEntry {
  tuition: Record<Level, string>;
  living: [number, number];
  food: [number, number];
  transport: [number, number];
}

const COSTS: Record<string, CostEntry> = {
  almaniya: {
    tuition: { bachelor: "Pulsuz ✓", master: "Pulsuz ✓", phd: "Pulsuz ✓" },
    living: [650, 950],
    food: [150, 250],
    transport: [50, 90],
  },
  niderland: {
    tuition: { bachelor: "€2.530/il", master: "€8.000–15.000/il", phd: "Əksər pulsuz" },
    living: [750, 1100],
    food: [200, 300],
    transport: [80, 120],
  },
  cexiya: {
    tuition: { bachelor: "Pulsuz ✓ (Çex)", master: "Pulsuz ✓ (Çex)", phd: "Pulsuz ✓" },
    living: [400, 600],
    food: [120, 200],
    transport: [30, 50],
  },
  belcika: {
    tuition: { bachelor: "€835–4.000/il", master: "€835–4.000/il", phd: "Əksər pulsuz" },
    living: [700, 1000],
    food: [180, 280],
    transport: [60, 90],
  },
  fransa: {
    tuition: { bachelor: "€170/il", master: "€243/il", phd: "€380/il" },
    living: [700, 1100],
    food: [200, 300],
    transport: [70, 100],
  },
  polsa: {
    tuition: { bachelor: "€2.000–4.000/il", master: "€2.000–5.000/il", phd: "Əksər pulsuz" },
    living: [400, 600],
    food: [120, 200],
    transport: [25, 45],
  },
  avstriya: {
    tuition: { bachelor: "€726/il", master: "€726/il", phd: "Əksər pulsuz" },
    living: [700, 1000],
    food: [180, 280],
    transport: [80, 110],
  },
};

export function CostEstimator() {
  const [country, setCountry] = useState<string | null>(null);
  const [level, setLevel] = useState<Level | null>(null);

  const reset = () => {
    setCountry(null);
    setLevel(null);
  };

  const showResult = country && level;
  const data = country ? COSTS[country] : null;
  const countryInfo = COUNTRIES.find((c) => c.slug === country);

  const monthlyMin = data ? data.living[0] + data.food[0] + data.transport[0] : 0;
  const monthlyMax = data ? data.living[1] + data.food[1] + data.transport[1] : 0;

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Büdcə kalkulatoru
          </span>
          <h2 className="mt-2 text-2xl font-semibold text-navy sm:text-3xl">
            Aylıq xərcinizi hesablayın
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Ölkə və təhsil səviyyəsini seçin — təxmini büdcənizi göstərək
          </p>
        </div>

        <div className="mt-10 rounded-card bg-[#f8f9fc] p-6 sm:p-8">
          {/* Step 1: Country */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              01 — Ölkə seçin
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {COUNTRIES.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => { setCountry(c.slug); setLevel(null); }}
                  className={`flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-sm font-medium transition-all ${
                    country === c.slug
                      ? "bg-navy text-white shadow-sm"
                      : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-blue/40"
                  }`}
                >
                  <span>{c.flag}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Level */}
          <AnimatePresence>
            {country && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-6"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  02 — Təhsil səviyyəsi
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {LEVELS.map((l) => (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => setLevel(l.value as Level)}
                      className={`rounded-pill px-4 py-2 text-sm font-medium transition-all ${
                        level === l.value
                          ? "bg-blue text-white shadow-sm"
                          : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-blue/40"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {showResult && data && countryInfo && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <div className="overflow-hidden rounded-[16px] bg-white shadow-sm ring-1 ring-gray-100">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{countryInfo.flag}</span>
                      <div>
                        <p className="text-sm font-semibold text-navy">{countryInfo.label}</p>
                        <p className="text-xs text-gray-400">
                          {LEVELS.find((l) => l.value === level)?.label}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={reset}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-navy"
                    >
                      <RotateCcw size={11} /> Yenidən
                    </button>
                  </div>

                  {/* Breakdown */}
                  <div className="divide-y divide-gray-50 px-5">
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-gray-500">Tədris haqqı</span>
                      <span className="text-sm font-semibold text-navy">
                        {data.tuition[level!]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-gray-500">Yaşayış (icarə)</span>
                      <span className="text-sm font-medium text-navy">
                        €{data.living[0]}–{data.living[1]}/ay
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-gray-500">Qida</span>
                      <span className="text-sm font-medium text-navy">
                        €{data.food[0]}–{data.food[1]}/ay
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-gray-500">Nəqliyyat</span>
                      <span className="text-sm font-medium text-navy">
                        €{data.transport[0]}–{data.transport[1]}/ay
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="mx-5 mb-5 mt-1 rounded-[12px] bg-navy px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingDown size={16} className="text-gold" />
                        <span className="text-sm font-medium text-white/80">
                          Aylıq toplam xərc
                        </span>
                      </div>
                      <span className="text-lg font-bold text-white">
                        €{monthlyMin}–{monthlyMax}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-white/40">
                      Tədris haqqı istisna olmaqla · Şəxsi xərclər daxil deyil
                    </p>
                  </div>

                  <div className="border-t border-gray-50 px-5 pb-5 pt-4 text-center">
                    <Link
                      href={`/countries/${country}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-blue hover:gap-3 transition-all"
                    >
                      {countryInfo.label} haqqında ətraflı <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
