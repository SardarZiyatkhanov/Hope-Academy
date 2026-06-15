import { cn } from "@/lib/cn";

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Yüklənir"
      className={cn(
        "h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-blue",
        className
      )}
    />
  );
}
