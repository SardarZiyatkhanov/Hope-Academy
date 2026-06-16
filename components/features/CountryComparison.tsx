"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";

const ALL_COUNTRIES = [
  { slug: "almaniya",  flag: "🇩🇪", label: "Almaniya" },
  { slug: "niderland", flag: "🇳🇱", label: "Niderland" },
  { slug: "cexiya",   flag: "🇨🇿", label: "Çexiya" },
  { slug: "belcika",  flag: "🇧🇪", label: "Belçika" },
  { slug: "fransa",   flag: "🇫🇷", label: "Fransa" },
  { slug: "polsa",    flag: "🇵🇱", label: "Polşa" },
  { slug: "avstriya", flag: "🇦🇹", label: "Avstriya" },
];

interface CompareData {
  tuition: string;
  monthly: string;
  lang: string;
  work: string;
  postGrad: string;
  schengen: boolean;
  scholarship: boolean;
}

const DATA: Record<string, CompareData> = {
  almaniya:  { tuition: "Pulsuz",       monthly: "€850–1.100", lang: "Alman / İngilis", work: "20 s/həf", postGrad: "18 ay", schengen: true,  scholarship: true  },
  niderland: { tuition: "€2.5K–15K/il", monthly: "€1.000–1.400", lang: "İngilis",       work: "16 s/həf", postGrad: "12 ay", schengen: true,  scholarship: true  },
  cexiya:    { tuition: "Pulsuz*",      monthly: "€550–800",  lang: "Çex / İngilis",    work: "20 s/həf", postGrad: "12 ay", schengen: true,  scholarship: false },
  belcika:   { tuition: "€835–4K/il",  monthly: "€950–1.300", lang: "Fransız / Nider.", work: "20 s/həf", postGrad: "12 ay", schengen: true,  scholarship: true  },
  fransa:    { tuition: "€170–380/il", monthly: "€950–1.400", lang: "Fransız / İngilis",work: "20 s/həf", postGrad: "24 ay", schengen: true,  scholarship: true  },
  polsa:     { tuition: "€2K–5K/il",   monthly: "€550–750",  lang: "Polşa / İngilis",  work: "20 s/həf", postGrad: "12 ay", schengen: true,  scholarship: false },
  avstriya:  { tuition: "€726/il",     monthly: "€900–1.200", lang: "Alman / İngilis",  work: "20 s/həf", postGrad: "12 ay", schengen: true,  scholarship: true  },
};

const ROWS: { key: keyof CompareData; label: string }[] = [
  { key: "tuition",     label: "Tədris haqqı" },
  { key: "monthly",     label: "Aylıq xərc" },
  { key: "lang",        label: "Dil tələbi" },
  { key: "work",        label: "İş hüququ" },
  { key: "postGrad",    label: "Post-grad icazə" },
  { key: "schengen",    label: "Şengen zonası" },
  { key: "scholarship", label: "Burs imkanı" },
];

export function CountryComparison() {
  const [selected, setSelected] = useState<string[]>(["almaniya", "niderland", "cexiya"]);

  function toggle(slug: string) {
    setSelected((prev) => {
      if (prev.includes(slug)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter((s) => s !== slug);
      }
      if (prev.length >= 3) return [...prev.slice(1), slug]; // replace oldest
      return [...prev, slug];
    });
  }

  const selectedData = selected.map((s) => ({
    ...ALL_COUNTRIES.find((c) => c.slug === s)!,
    data: DATA[s],
  }));

  function renderCell(val: string | boolean) {
    if (typeof val === "boolean") {
      return val ? (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-50">
          <Check size={13} className="text-green-500" />
        </span>
      ) : (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-50">
          <X size={13} className="text-red-400" />
        </span>
      );
    }
    return <span className="text-sm text-navy">{val}</span>;
  }

  return (
    <section className="bg-[#f8f9fc] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Müqayisə
          </span>
          <h2 className="mt-2 text-2xl font-semibold text-navy sm:text-3xl">
            Ölkələri yan-yana müqayisə et
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Max 3 ölkə seçin — cədvəl avtomatik yenilənir
          </p>
        </div>

        {/* Country selector */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {ALL_COUNTRIES.map((c) => {
            const active = selected.includes(c.slug);
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => toggle(c.slug)}
                className={`flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-navy text-white shadow-sm"
                    : "bg-white text-gray-500 ring-1 ring-gray-200 hover:ring-blue/40"
                }`}
              >
                <span>{c.flag}</span>
                {c.label}
                {active && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold text-white">
                    {selected.indexOf(c.slug) + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Comparison table */}
        <motion.div
          layout
          className="mt-8 overflow-hidden rounded-card bg-white shadow-sm ring-1 ring-gray-100"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 pl-5 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Xüsusiyyət
                  </th>
                  {selectedData.map((c) => (
                    <th key={c.slug} className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl">{c.flag}</span>
                        <span className="text-xs font-semibold text-navy">{c.label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr
                    key={row.key}
                    className={i % 2 === 0 ? "bg-white" : "bg-[#fafbff]"}
                  >
                    <td className="py-3.5 pl-5 pr-3 text-sm font-medium text-gray-500">
                      {row.label}
                    </td>
                    {selectedData.map((c) => (
                      <td key={c.slug} className="px-4 py-3.5 text-center">
                        {renderCell(c.data[row.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 px-5 py-4">
            <p className="text-[11px] text-gray-400">
              * Çexiya: Çex dilindəki proqramlar pulsuz, İngilisdilli proqramlar €2K–5K/il
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {selectedData.map((c) => (
                <Link
                  key={c.slug}
                  href={`/countries/${c.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue hover:gap-2 transition-all"
                >
                  {c.flag} {c.label} haqqında <ArrowRight size={11} />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
