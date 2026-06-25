"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/admin", label: "Ərizələr", icon: LayoutDashboard },
  { href: "/admin/students", label: "Tələbələr", icon: Users },
  { href: "/admin/leads", label: "Lidlər", icon: UserPlus },
  { href: "/admin/chat", label: "Mesajlar", icon: MessageSquare },
  { href: "/admin/analytics", label: "Analitika", icon: BarChart3 },
];

export function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white sm:hidden" aria-label="Admin naviqasiya">
      <div className="flex items-stretch">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                active ? "text-blue" : "text-gray-400"
              )}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
