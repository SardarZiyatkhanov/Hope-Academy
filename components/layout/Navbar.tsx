"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Globe, BookOpen, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

const MAIN_LINKS = [
  { href: "/", label: "Ana səhifə" },
  { href: "/about", label: "Haqqımızda" },
  { href: "/services", label: "Xidmətlər" },
  { href: "/contact", label: "Əlaqə" },
];

const RESOURCE_LINKS = [
  {
    href: "/countries",
    label: "Ölkələr",
    desc: "7 Avropa ölkəsi",
    icon: Globe,
  },
  {
    href: "/blog",
    label: "Blog",
    desc: "Faydalı məqalələr",
    icon: BookOpen,
  },
  {
    href: "/success-stories",
    label: "Uğur hekayələri",
    desc: "Real tələbə hekayələri",
    icon: Star,
  },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col items-center gap-0.5 px-3 py-2 text-sm font-medium transition-colors duration-200",
        active ? "text-white" : "text-white/60 hover:text-white"
      )}
    >
      {label}
      <span
        className={cn(
          "h-[2px] w-4 rounded-full bg-gold transition-all duration-300",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-60"
        )}
      />
    </Link>
  );
}

function ResourcesDropdown() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = RESOURCE_LINKS.some((l) => pathname.startsWith(l.href));

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "group flex flex-col items-center gap-0.5 px-3 py-2 text-sm font-medium transition-colors duration-200",
          isActive ? "text-white" : "text-white/60 hover:text-white"
        )}
      >
        <span className="flex items-center gap-1">
          Resurslar
          <ChevronDown
            size={14}
            className={cn("transition-transform duration-200", open ? "rotate-180" : "")}
          />
        </span>
        <span
          className={cn(
            "h-[2px] w-4 rounded-full bg-gold transition-all duration-300",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-1/2 top-full z-50 mt-1 w-64 -translate-x-1/2"
          >
            {/* Arrow */}
            <div className="flex justify-center">
              <div className="h-2 w-4 overflow-hidden">
                <div className="h-3 w-3 -translate-y-1.5 translate-x-0.5 rotate-45 bg-[#0e2454] ring-1 ring-white/10" />
              </div>
            </div>
            <div className="overflow-hidden rounded-[16px] border-t-2 border-gold bg-[#0e2454] shadow-2xl ring-1 ring-white/10">
              <div className="p-2">
                {RESOURCE_LINKS.map((link) => {
                  const Icon = link.icon;
                  const active = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-[10px] p-3 transition-all duration-150",
                        active ? "bg-white/10" : "hover:bg-white/5"
                      )}
                    >
                      <div className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] transition-colors",
                        active ? "bg-gold/20 text-gold" : "bg-white/5 text-white/50 group-hover:bg-gold/10 group-hover:text-gold"
                      )}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1">
                        <p className={cn("text-sm font-medium", active ? "text-white" : "text-white/80 group-hover:text-white")}>
                          {link.label}
                        </p>
                        <p className="text-xs text-white/40">{link.desc}</p>
                      </div>
                      <ArrowRight size={13} className="text-white/20 transition-colors group-hover:text-white/50" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-navy/90 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
          : "bg-navy"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gold/20 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <Image
              src="/logo.jpg"
              alt="Hope Academy"
              width={38}
              height={38}
              className="relative rounded-full ring-1 ring-white/10 transition-all duration-300 group-hover:ring-gold/40"
            />
          </div>
          <span className="flex flex-col leading-tight">
            <span className="text-[15px] font-semibold tracking-tight text-white">
              Hope Academy
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-white/40">
              Edu and Career Counselling
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center lg:flex">
          {MAIN_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
          <ResourcesDropdown />
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/login?role=student"
            className="rounded-pill px-4 py-2 text-sm font-medium text-white/60 ring-1 ring-white/15 transition-all duration-200 hover:text-white hover:ring-white/30"
          >
            Ərizəmi yoxla
          </Link>
          <Link
            href="/login?role=admin"
            className="group relative overflow-hidden rounded-pill bg-gradient-to-r from-gold to-amber-400 px-5 py-2 text-sm font-semibold text-navy shadow-[0_0_20px_rgba(232,160,32,0.3)] transition-all duration-200 hover:shadow-[0_0_28px_rgba(232,160,32,0.5)]"
          >
            <span className="relative z-10">Panel</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-amber-300 to-gold transition-transform duration-300 group-hover:translate-x-0" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center rounded-[10px] p-2 text-white ring-1 ring-white/10 lg:hidden"
          aria-label="Menyu"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/8 lg:hidden"
          >
            <div className="px-4 pb-5 pt-3">
              <nav className="flex flex-col gap-0.5">
                {MAIN_LINKS.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
                      {link.label}
                    </Link>
                  );
                })}
                <div className="my-2 border-t border-white/8" />
                <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  Resurslar
                </p>
                {RESOURCE_LINKS.map((link) => {
                  const Icon = link.icon;
                  const active = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <Icon size={15} className={active ? "text-gold" : "text-white/30"} />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/login?role=student"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-pill py-2.5 text-center text-sm font-medium text-white/70 ring-1 ring-white/15 transition-all hover:text-white hover:ring-white/30"
                >
                  Ərizəmi yoxla
                </Link>
                <Link
                  href="/login?role=admin"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-pill bg-gradient-to-r from-gold to-amber-400 py-2.5 text-center text-sm font-semibold text-navy shadow-[0_0_20px_rgba(232,160,32,0.25)]"
                >
                  Panel
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
