"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Avatar } from "@/components/ui/Avatar";

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
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 sm:px-6">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" alt="Hope Academy" width={32} height={32} />
        <span className="text-base font-semibold text-navy">{title}</span>
      </Link>

      <div className="flex items-center gap-3">
        {profile && (
          <>
            <Avatar name={profile.name} />
            <span className="hidden text-sm font-medium text-navy sm:inline">
              {profile.name}
            </span>
          </>
        )}
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Çıxış"
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-light hover:text-navy"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
