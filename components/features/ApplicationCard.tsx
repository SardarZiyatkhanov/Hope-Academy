import { ApplicationDoc } from "@/types";
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

const STATUS_STYLE: Record<string, string> = {
  gray: "bg-gray-100 text-gray-600",
  blue: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  purple: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  amber: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  green: "bg-green-50 text-green-700 ring-1 ring-green-200",
  red: "bg-red-50 text-red-700 ring-1 ring-red-200",
  orange: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  teal: "bg-teal-50 text-teal-700 ring-1 ring-teal-200",
};

interface ApplicationCardProps {
  application: ApplicationDoc;
  active?: boolean;
  onClick?: () => void;
}

export function ApplicationCard({ application, active, onClick }: ApplicationCardProps) {
  const status = STATUS_LABELS[application.status];
  const step = STATUS_STEP[application.status];
  const percent = Math.round((step / 5) * 100);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col gap-4 rounded-xl border bg-white p-5 text-left transition-all duration-150 hover:shadow-md",
        active
          ? "border-blue shadow-md ring-2 ring-blue/20"
          : "border-gray-100 shadow-sm hover:border-blue/30"
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-2xl">
            {COUNTRY_FLAGS[application.universityCountry] ?? "🌍"}
          </span>
          <div>
            <p className="text-sm font-bold text-navy leading-tight">{application.universityName}</p>
            <p className="mt-0.5 text-xs text-gray-500">{application.program}</p>
            <p className="mt-0.5 text-[11px] font-medium text-gray-400">{application.universityCountry}</p>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap",
            STATUS_STYLE[status.color] ?? STATUS_STYLE.gray
          )}
        >
          {status.az}
        </span>
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-gray-400">Proqres</p>
          <p className="text-[11px] font-semibold text-navy">{percent}%</p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue to-accent transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i < step ? "bg-blue/40" : "bg-transparent"
              )}
            />
          ))}
        </div>
      </div>
    </button>
  );
}
