import { ApplicationDoc } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { STATUS_LABELS, STATUS_STEP } from "@/lib/constants";
import { cn } from "@/lib/cn";

const COUNTRY_FLAGS: Record<string, string> = {
  Almaniya: "🇩🇪",
  Niderland: "🇳🇱",
  Çexiya: "🇨🇿",
  Belçika: "🇧🇪",
  Fransa: "🇫🇷",
  Polşa: "🇵🇱",
  Avstriya: "🇦🇹",
  Azərbaycan: "🇦🇿",
};

interface ApplicationCardProps {
  application: ApplicationDoc;
  active?: boolean;
  onClick?: () => void;
}

export function ApplicationCard({ application, active, onClick }: ApplicationCardProps) {
  const status = STATUS_LABELS[application.status];
  const step = STATUS_STEP[application.status];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col gap-3 rounded-card border bg-white p-4 text-left transition-shadow hover:shadow-md",
        active ? "border-accent ring-2 ring-accent/30" : "border-gray-100"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {COUNTRY_FLAGS[application.universityCountry] ?? "🌍"}
          </span>
          <div>
            <p className="text-sm font-semibold text-navy">{application.universityName}</p>
            <p className="text-xs text-gray-500">{application.program}</p>
          </div>
        </div>
        <Badge color={status.color}>{status.az}</Badge>
      </div>

      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-1.5 flex-1 rounded-pill",
              index < step ? "bg-blue" : "bg-gray-100"
            )}
          />
        ))}
      </div>
    </button>
  );
}
