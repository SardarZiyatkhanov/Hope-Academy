"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Yuxarı qayıt"
      className="fixed bottom-24 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-navy/90 text-white shadow-lg ring-1 ring-white/10 backdrop-blur-sm transition-all hover:bg-navy hover:scale-110 sm:right-6"
    >
      <ArrowUp size={18} />
    </button>
  );
}
