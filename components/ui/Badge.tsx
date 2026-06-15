import { ReactNode } from "react";
import { cn } from "@/lib/cn";

const COLOR_CLASSES: Record<string, string> = {
  gray: "bg-gray-100 text-gray-600",
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  amber: "bg-amber-100 text-amber-700",
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  orange: "bg-orange-100 text-orange-700",
  teal: "bg-teal-100 text-teal-700",
};

interface BadgeProps {
  color?: string;
  children: ReactNode;
  className?: string;
}

export function Badge({ color = "gray", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium whitespace-nowrap",
        COLOR_CLASSES[color] ?? COLOR_CLASSES.gray,
        className
      )}
    >
      {children}
    </span>
  );
}
