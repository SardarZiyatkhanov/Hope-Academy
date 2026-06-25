"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminError({
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
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle size={24} className="text-red-500" />
      </div>
      <h2 className="mt-4 text-xl font-bold text-navy">Xəta baş verdi</h2>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        Məlumatlar yüklənərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.
      </p>
      <Button variant="primary" className="mt-4" onClick={reset}>
        <RotateCcw size={16} /> Yenidən cəhd et
      </Button>
    </div>
  );
}
