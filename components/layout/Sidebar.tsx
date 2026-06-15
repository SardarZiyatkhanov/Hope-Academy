"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Users,
  FileText,
  MessageSquare,
  Mail,
  UserPlus,
  Settings,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: (pathname: string, view: string | null) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/admin",
    label: "Ərizələr",
    icon: LayoutDashboard,
    isActive: (pathname) => pathname === "/admin",
  },
  {
    href: "/admin/map",
    label: "Xəritə",
    icon: Globe,
    isActive: (pathname) => pathname === "/admin/map",
  },
  {
    href: "/admin/students",
    label: "Tələbələr",
    icon: Users,
    isActive: (pathname, view) => pathname === "/admin/students" && view !== "documents",
  },
  {
    href: "/admin/students?view=documents",
    label: "Sənədlər",
    icon: FileText,
    isActive: (pathname, view) => pathname === "/admin/students" && view === "documents",
  },
  {
    href: "/admin/chat",
    label: "Mesajlar",
    icon: MessageSquare,
    isActive: (pathname) => pathname === "/admin/chat",
  },
  {
    href: "/admin/leads",
    label: "Lidlər",
    icon: UserPlus,
    isActive: (pathname) => pathname === "/admin/leads",
  },
  {
    href: "/admin/messages",
    label: "Mesaj qutusu",
    icon: Mail,
    isActive: (pathname) => pathname === "/admin/messages",
  },
  {
    href: "/admin/settings",
    label: "Parametrlər",
    icon: Settings,
    isActive: (pathname) => pathname === "/admin/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  return (
    <aside className="hidden w-[168px] shrink-0 bg-navy sm:flex sm:flex-col">
      <nav className="flex flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.isActive(pathname, view);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-blue text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
