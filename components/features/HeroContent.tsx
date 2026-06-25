"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const DESTINATIONS = [
  "dünyaya",
  "Almaniyaya",
  "Niderlandda",
  "Çexiyaya",
  "Belçikaya",
  "Avstriyaya",
];

const STATS = [
  { value: 1000, suffix: "+", label: "Tələbə" },
  { value: 35, suffix: "+", label: "Universitet" },
  { value: 100, suffix: "%", label: "Şəffaflıq" },
];

export function HeroContent() {
  const [destIndex, setDestIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDestIndex((i) => (i + 1) % DESTINATIONS.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <div className="inline-flex w-fit items-center gap-2 rounded-pill bg-white/10 px-4 py-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
        </span>
        <span className="text-xs font-medium text-white/90">
          1000+ tələbə dünyada oxuyur
        </span>
      </div>

      <h1 className="font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
        Bakıdan bütün{" "}
        <br className="hidden sm:block" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={destIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="inline-block pb-1 bg-gradient-to-r from-gold via-yellow-300 to-gold bg-clip-text text-transparent"
          >
            {DESTINATIONS[destIndex]}
          </motion.span>
        </AnimatePresence>
      </h1>

      <p className="max-w-lg text-base text-white/70 sm:text-lg">
        Hope Academy ilə xaricdə təhsil prosesinin hər addımını izləyin —
        sənədlərin hazırlanmasından qəbula və vizaya qədər hər şey bir
        platformada.
      </p>

      <div className="flex gap-8 sm:gap-12">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl font-bold text-white sm:text-3xl">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="text-xs text-white/60 sm:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <a href="#apply">
          <Button variant="primary">Pulsuz məsləhət al</Button>
        </a>
        <a href="#how-it-works">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            Necə işləyir?
          </Button>
        </a>
      </div>
    </motion.div>
  );
}
