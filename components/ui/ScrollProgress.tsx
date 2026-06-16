"use client";

import { useScroll, motion } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[9998] h-[2px] origin-left bg-gradient-to-r from-blue via-gold to-accent"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
