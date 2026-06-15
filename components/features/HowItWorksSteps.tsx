"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Step {
  icon: ReactNode;
  title: string;
  desc: string;
}

export function HowItWorksSteps({ steps }: { steps: Step[] }) {
  return (
    <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-5">
      {steps.map(({ icon, title, desc }, index) => (
        <div key={title} className="relative flex flex-col items-center text-center">
          {index < steps.length - 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
              className="absolute top-7 left-1/2 hidden h-px w-full bg-gray-200 sm:block"
            />
          )}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, delay: index * 0.15, ease: "easeOut" }}
            className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white text-blue shadow-sm"
          >
            {icon}
          </motion.div>
          <h3 className="mt-4 text-sm font-semibold text-navy">{title}</h3>
          <p className="mt-1 text-xs text-gray-500">{desc}</p>
        </div>
      ))}
    </div>
  );
}
