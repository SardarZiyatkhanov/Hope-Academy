"use client";

import { cn } from "@/lib/cn";

export interface BarChartItem {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartItem[];
  height?: number;
  className?: string;
}

export function BarChart({ data, height = 200, className }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-gray-400"
        style={{ height }}
      >
        Məlumat yoxdur
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        className="flex items-end gap-1.5"
        style={{ height }}
      >
        {data.map((item, i) => {
          const pct = (item.value / max) * 100;
          return (
            <div
              key={i}
              className="group relative flex flex-1 flex-col items-center"
              style={{ height: "100%" }}
            >
              <div className="relative flex w-full flex-1 items-end justify-center">
                <div
                  className="w-full max-w-[40px] rounded-t-md transition-all duration-300"
                  style={{
                    height: `${Math.max(pct, 2)}%`,
                    backgroundColor: item.color ?? "#1a4aa8",
                  }}
                />
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded bg-navy px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-1.5">
        {data.map((item, i) => (
          <div key={i} className="flex-1 text-center">
            <span className="text-[10px] text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
