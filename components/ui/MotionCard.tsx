"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface MotionCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  hoverY?: number;
}

export function MotionCard({
  children,
  className,
  hoverScale = 1.02,
  hoverY = -4,
}: MotionCardProps) {
  return (
    <motion.div
      whileHover={{ scale: hoverScale, y: hoverY }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
