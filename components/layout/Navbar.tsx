"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { NAV_LINKS } from "@/lib/constants";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-navy">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="Hope Academy"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-semibold text-white">Hope Academy</span>
            <span className="text-[10px] font-medium uppercase tracking-wide text-white/50">
              Edu and Career Counselling
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-pill px-4 py-2 text-sm font-medium transition-colors",
                  active ? "bg-white/10 text-white" : "text-white/70 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login?role=student">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Ərizəmi yoxla
            </Button>
          </Link>
          <Link href="/login?role=admin">
            <Button variant="primary">Panel</Button>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex items-center justify-center rounded-pill p-2 text-white lg:hidden"
          aria-label="Menyu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-1 pt-3">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-[8px] px-3 py-2 text-sm font-medium transition-colors",
                    active ? "bg-white/10 text-white" : "text-white/70 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/login?role=student" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full text-white hover:bg-white/10">
                Ərizəmi yoxla
              </Button>
            </Link>
            <Link href="/login?role=admin" onClick={() => setOpen(false)}>
              <Button variant="primary" className="w-full">
                Panel
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
