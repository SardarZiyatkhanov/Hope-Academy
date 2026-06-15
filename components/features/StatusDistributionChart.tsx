"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export interface StatusDistributionSegment {
  key: string;
  label: string;
  value: number;
  color: string;
}

interface StatusDistributionChartProps {
  data: StatusDistributionSegment[];
}

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function StatusDistributionChart({ data }: StatusDistributionChartProps) {
  const [active, setActive] = useState<string | null>(null);

  const total = data.reduce((sum, segment) => sum + segment.value, 0);
  const segments = data.filter((segment) => segment.value > 0);

  if (total === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-gray-400">
        Hələ məlumat yoxdur
      </div>
    );
  }

  let cumulative = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center">
      <div className="relative h-48 w-48 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#f3f4f6" strokeWidth="14" />
          {segments.map((segment) => {
            const fraction = segment.value / total;
            const dash = fraction * CIRCUMFERENCE;
            const offset = cumulative;
            cumulative += dash;
            const isActive = active === segment.key;
            const isDimmed = active !== null && !isActive;

            return (
              <motion.circle
                key={segment.key}
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke={segment.color}
                strokeWidth={isActive ? 16 : 14}
                strokeLinecap="butt"
                strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                strokeDashoffset={-offset}
                initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}`, opacity: 1 }}
                animate={{
                  strokeDasharray: `${dash} ${CIRCUMFERENCE - dash}`,
                  opacity: isDimmed ? 0.35 : 1,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setActive(segment.key)}
                onMouseLeave={() => setActive(null)}
              />
            );
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {active ? (
            <>
              <p className="text-2xl font-bold text-navy">
                {data.find((segment) => segment.key === active)?.value ?? 0}
              </p>
              <p className="max-w-[7rem] text-center text-xs text-gray-500">
                {data.find((segment) => segment.key === active)?.label}
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-navy">{total}</p>
              <p className="text-xs text-gray-500">Cəmi ərizə</p>
            </>
          )}
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {data.map((segment) => {
          const percent = total ? Math.round((segment.value / total) * 100) : 0;
          const isActive = active === segment.key;
          return (
            <li
              key={segment.key}
              className="flex items-center gap-3 rounded-[8px] px-2 py-1 text-sm transition-colors"
              style={{ backgroundColor: isActive ? "rgba(43,109,232,0.06)" : "transparent" }}
              onMouseEnter={() => setActive(segment.key)}
              onMouseLeave={() => setActive(null)}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="min-w-[9rem] text-navy">{segment.label}</span>
              <span className="font-medium text-navy">{segment.value}</span>
              <span className="text-xs text-gray-400">{percent}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
