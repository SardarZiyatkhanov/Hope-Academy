import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-light text-blue">
        <Icon size={22} />
      </div>
      <p className="text-sm font-medium text-navy">{title}</p>
      {description && <p className="max-w-sm text-xs text-gray-400">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
