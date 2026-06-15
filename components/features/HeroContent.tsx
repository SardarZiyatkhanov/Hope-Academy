"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const STATS = [
  { value: "1000+", label: "Tələbə" },
  { value: "35+", label: "Universitet" },
  { value: "100%", label: "Şəffaflıq" },
];

export function HeroContent() {
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

      <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
        Bakıdan bütün dünyaya
      </h1>

      <p className="max-w-lg text-base text-white/70 sm:text-lg">
        Hope Academy ilə xaricdə təhsil prosesinin hər addımını izləyin —
        sənədlərin hazırlanmasından qəbula və vizaya qədər hər şey bir
        platformada.
      </p>

      <div className="flex gap-8 sm:gap-12">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
            <p className="text-xs text-white/60 sm:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/login?role=student">
          <Button variant="primary">Ərizəmi yoxla</Button>
        </Link>
        <a href="#how-it-works">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            Necə işləyir?
          </Button>
        </a>
      </div>
    </motion.div>
  );
}
