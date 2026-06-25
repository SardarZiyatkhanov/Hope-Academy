"use client";

import { cn } from "@/lib/cn";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  speed?: "slow" | "normal" | "fast";
  fade?: boolean;
}

const SPEED_MAP = { slow: "60s", normal: "40s", fast: "25s" };

export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
  speed = "normal",
  fade = true,
}: MarqueeProps) {
  return (
    <div
      role="region"
      aria-label="Sürüşən məzmun"
      aria-roledescription="carousel"
      tabIndex={0}
      className={cn(
        "group overflow-hidden",
        "focus:[&>div]:[animation-play-state:paused]",
        fade &&
          "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max gap-6",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{ animationDuration: SPEED_MAP[speed] }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
