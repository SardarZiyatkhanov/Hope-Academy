import { Check } from "lucide-react";
import { ApplicationDoc } from "@/types";
import { STATUS_STEP } from "@/lib/constants";
import { cn } from "@/lib/cn";

const STEPS = [
  "Müraciət qeydə alındı",
  "Sənədlər hazırlanır",
  "Universitetə göndərildi",
  "Qərar gözlənilir",
  "Yola düşüb",
];

interface TimelineProps {
  application: ApplicationDoc;
}

export function Timeline({ application }: TimelineProps) {
  const currentStep = STATUS_STEP[application.status];

  return (
    <ol className="flex flex-col">
      {STEPS.map((label, index) => {
        const step = index + 1;
        const state = step < currentStep ? "done" : step === currentStep ? "now" : "soon";
        const isLast = step === STEPS.length;

        return (
          <li key={label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  state === "done" && "bg-green-500 text-white",
                  state === "now" && "animate-pulse bg-navy text-white",
                  state === "soon" && "bg-gray-100 text-gray-400"
                )}
              >
                {state === "done" ? <Check size={16} /> : step}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-px flex-1",
                    state === "done" ? "bg-green-500" : "bg-gray-200"
                  )}
                />
              )}
            </div>
            <div className="pb-6">
              <p className={cn("pt-1 text-sm font-medium", state === "soon" ? "text-gray-400" : "text-navy")}>
                {label}
              </p>
              {state === "now" && application.notes && (
                <p className="mt-2 rounded-[8px] bg-light px-3 py-2 text-xs text-navy/80">
                  {application.notes}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
