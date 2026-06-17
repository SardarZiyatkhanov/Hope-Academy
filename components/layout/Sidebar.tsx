"use client";

import Image from "next/image";
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
    <aside
      className="hidden w-[200px] shrink-0 sm:flex sm:flex-col"
      style={{ background: "linear-gradient(180deg, #0e2454 0%, #091b43 100%)" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-[18px]">
        <div className="relative">
          <Image
            src="/logo.jpg"
            alt="Hope Academy"
            width={32}
            height={32}
            className="rounded-full ring-2 ring-white/20 ring-offset-1 ring-offset-navy"
          />
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-navy bg-green-400" />
        </div>
        <div className="leading-tight">
          <p className="text-[13px] font-bold text-white">Hope Academy</p>
          <p className="text-[10px] text-white/40">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 p-2.5 pt-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.isActive(pathname, view);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-[13px] font-medium transition-all duration-150",
                active
                  ? "bg-white/[0.12] text-white shadow-sm"
                  : "text-white/55 hover:bg-white/[0.07] hover:text-white/90"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-150",
                  active
                    ? "bg-[#1a4aa8] text-white shadow-md shadow-blue-900/40"
                    : "text-white/40 group-hover:text-white/70"
                )}
              >
                <Icon size={15} />
              </span>
              <span className="flex-1">{item.label}</span>
              {active && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer spacer */}
      <div className="mt-auto border-t border-white/10 px-4 py-3">
        <p className="text-[10px] text-white/25">v1.0 · Hope Academy</p>
      </div>
    </aside>
  );
}
