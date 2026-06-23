"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Avatar } from "@/components/ui/Avatar";
import { NotificationBell } from "@/components/features/NotificationBell";
import { MobileAdminNav } from "@/components/layout/Sidebar";

interface PortalHeaderProps {
  title: string;
}

export function PortalHeader({ title }: PortalHeaderProps) {
  const { profile, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-100 bg-white/95 px-4 py-2.5 shadow-sm backdrop-blur-sm sm:px-6">
      <Link href="/" className="flex items-center gap-2.5">
        <Image
          src="/logo.jpg"
          alt="Hope Academy"
          width={30}
          height={30}
          className="rounded-full ring-1 ring-gray-200"
        />
        <span className="text-[15px] font-bold text-navy">{title}</span>
      </Link>

      <div className="flex items-center gap-2">
        <MobileAdminNav />
        <NotificationBell />

        {profile && (
          <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 py-1.5 pl-1.5 pr-3 shadow-sm">
            <Avatar name={profile.name} className="h-7 w-7 text-[11px]" />
            <span className="hidden text-[13px] font-semibold text-navy sm:inline">
              {profile.name}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Çıxış"
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
