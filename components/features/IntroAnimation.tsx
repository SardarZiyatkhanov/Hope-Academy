"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { HeroGlobe } from "./HeroGlobe";

const CITIES = ["Berlin", "Amsterdam", "Paris", "Prague", "Vienna", "London"];
const BRAND = "HOPE ACADEMY";

function StarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.3,
      speed: Math.random() * 0.3 + 0.05,
      phase: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    let raf: number;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      frame++;
      stars.forEach((s) => {
        const alpha = 0.3 + Math.sin(frame * 0.02 + s.phase) * 0.25;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        s.y -= s.speed;
        if (s.y < -5) { s.y = h + 5; s.x = Math.random() * w; }
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

function TypeWriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started || count >= text.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), 65);
    return () => clearTimeout(t);
  }, [started, count, text.length]);

  return (
    <span className="font-heading text-sm font-bold uppercase tracking-[0.55em] text-white">
      {text.slice(0, count)}
      {count < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-gold"
        >
          |
        </motion.span>
      )}
    </span>
  );
}

export function IntroAnimation() {
  const [show, setShow] = useState(false);
  const [cityIndex, setCityIndex] = useState(0);

  useEffect(() => {
    if (!sessionStorage.getItem("ha-intro")) {
      sessionStorage.setItem("ha-intro", "1");
      setShow(true);
      const t = setTimeout(() => setShow(false), 4500);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (!show) return;
    const t = setInterval(() => {
      setCityIndex((i) => (i + 1) % CITIES.length);
    }, 500);
    const stop = setTimeout(() => clearInterval(t), 3500);
    return () => { clearInterval(t); clearTimeout(stop); };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-navy"
          exit={{ opacity: 0, scale: 1.15 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <StarCanvas />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
            <HeroGlobe className="h-[130%] w-[130%] max-w-none" />
          </div>

          <div className="pointer-events-none absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue/20 blur-[150px]" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-gold/10 blur-[100px]" />

          <div className="relative z-10 flex flex-col items-center gap-6 text-center">
            {/* Glowing ring + logo */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
            >
              {/* Outer glow ring */}
              <motion.div
                className="absolute -inset-4 rounded-full border border-gold/30"
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -inset-8 rounded-full border border-blue/20"
                animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
              {/* Logo */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-gold/40 to-blue/40 blur-md" />
                <Image
                  src="/logo.jpg"
                  alt="Hope Academy"
                  width={88}
                  height={88}
                  className="relative rounded-full shadow-2xl ring-2 ring-white/25"
                  priority
                />
              </div>
            </motion.div>

            {/* Typewriter brand name */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <TypeWriter text={BRAND} delay={800} />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="text-[11px] tracking-[0.3em] text-white/40"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.0 }}
            >
              Edu and Career Counselling
            </motion.p>

            {/* Animated city ticker */}
            <motion.div
              className="mt-2 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4, duration: 0.4 }}
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-gold"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-xs text-white/50">Bakı</span>
              <motion.span
                className="text-white/30"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                →
              </motion.span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={cityIndex}
                  className="text-xs font-medium text-gold/80"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {CITIES[cityIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-12 left-1/2 w-32 -translate-x-1/2">
            <div className="h-[2px] w-full rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold to-amber-300"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.8, delay: 0.2, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Floating route lines decoration */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 1000 600">
            <motion.path
              d="M700,350 Q550,150 300,200"
              stroke="white"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
            />
            <motion.path
              d="M700,350 Q600,250 400,320"
              stroke="white"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
            />
            <motion.path
              d="M700,350 Q500,200 200,280"
              stroke="white"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1.1, ease: "easeOut" }}
            />
            <motion.path
              d="M700,350 Q650,180 350,150"
              stroke="white"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1.4, ease: "easeOut" }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
