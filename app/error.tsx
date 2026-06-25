"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle size={28} className="text-red-500" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-navy">Xəta baş verdi</h1>
      <p className="mt-2 max-w-md text-sm text-gray-500">
        Gözlənilməz bir xəta baş verdi. Zəhmət olmasa yenidən cəhd edin və ya
        ana səhifəyə qayıdın.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button variant="primary" onClick={reset}>
          <RotateCcw size={16} /> Yenidən cəhd et
        </Button>
        <Link href="/">
          <Button variant="ghost">
            <Home size={16} /> Ana səhifə
          </Button>
        </Link>
      </div>
    </div>
  );
}
