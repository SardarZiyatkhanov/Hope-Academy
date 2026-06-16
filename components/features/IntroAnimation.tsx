"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function IntroAnimation() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("ha-intro")) {
      sessionStorage.setItem("ha-intro", "1");
      setShow(true);
      const t = setTimeout(() => setShow(false), 3800);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-navy"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          {/* Globe video */}
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-[0.22]"
            autoPlay
            muted
            playsInline
            loop
          >
            <source src="/videos/globe-bg.mp4" type="video/mp4" />
          </video>

          {/* Overlay tint */}
          <div className="absolute inset-0 bg-navy/60" />

          {/* Glow blobs */}
          <div className="pointer-events-none absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue/25 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 translate-y-1/2 rounded-full bg-gold/15 blur-[100px]" />

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-5 text-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 }}
            >
              <Image
                src="/logo.jpg"
                alt="Hope Academy"
                width={96}
                height={96}
                className="rounded-full shadow-2xl ring-2 ring-white/20"
                priority
              />
            </motion.div>

            {/* Brand name */}
            <motion.h1
              className="font-heading text-sm font-bold uppercase tracking-[0.55em] text-white"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.75 }}
            >
              Hope Academy
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="text-[11px] tracking-[0.3em] text-white/45"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 1.25 }}
            >
              Edu and Career Counselling
            </motion.p>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-14 left-1/2 w-28 -translate-x-1/2 overflow-hidden rounded-full">
            <div className="h-px w-full bg-white/15" />
            <motion.div
              className="absolute inset-0 h-px rounded-full bg-gold"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              style={{ originX: 0 }}
              transition={{ duration: 3.0, delay: 0.2, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
