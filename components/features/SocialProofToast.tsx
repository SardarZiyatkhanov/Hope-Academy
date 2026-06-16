"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GraduationCap } from "lucide-react";

const MESSAGES = [
  { name: "Aytən M.", action: "DAAD bursu qazandı", detail: "TU München · Almaniya", flag: "🇩🇪" },
  { name: "Rəşad Q.", action: "qəbul məktubu aldı", detail: "University of Amsterdam · NL", flag: "🇳🇱" },
  { name: "Nigar Ə.", action: "UCL-ə qəbul oldu", detail: "London, Böyük Britaniya", flag: "🇬🇧" },
  { name: "Kamran H.", action: "tibb oxumağa başladı", detail: "Charles University · Praqa", flag: "🇨🇿" },
  { name: "Səbinə İ.", action: "burs qazandı", detail: "KU Leuven · Belçika", flag: "🇧🇪" },
  { name: "Tural A.", action: "viza aldı", detail: "TU Wien · Vyana", flag: "🇦🇹" },
  { name: "Günel M.", action: "sənədlərini hazırladı", detail: "LMU München · Almaniya", flag: "🇩🇪" },
  { name: "Orxan B.", action: "müraciət etdi", detail: "Ghent University · Belçika", flag: "🇧🇪" },
];

export function SocialProofToast() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    function showNext() {
      indexRef.current = indexRef.current % MESSAGES.length;
      setIndex(indexRef.current);
      setVisible(true);

      timeoutId = setTimeout(() => {
        setVisible(false);
        indexRef.current++;
        timeoutId = setTimeout(showNext, 9000);
      }, 5000);
    }

    timeoutId = setTimeout(showNext, 10000);
    return () => clearTimeout(timeoutId);
  }, []);

  const msg = MESSAGES[index];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-24 left-4 z-40 sm:left-6"
        >
          <div className="flex items-start gap-3 rounded-[14px] bg-white p-3 pr-4 shadow-2xl ring-1 ring-gray-100">
            {/* Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-xl">
              {msg.flag}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <GraduationCap size={11} className="shrink-0 text-gold" />
                <p className="text-xs font-semibold text-navy">
                  {msg.name} — {msg.action}
                </p>
              </div>
              <p className="mt-0.5 text-[10px] text-gray-400">{msg.detail}</p>
              {/* Progress bar */}
              <motion.div
                className="mt-2 h-0.5 origin-left rounded-full bg-gold"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </div>

            <button
              type="button"
              onClick={() => setVisible(false)}
              className="ml-0.5 mt-0.5 shrink-0 text-gray-300 transition-colors hover:text-gray-500"
            >
              <X size={13} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
