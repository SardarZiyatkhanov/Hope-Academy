"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WorldMap } from "@/components/features/WorldMap";
import { getRouteForApplication } from "@/lib/constants";
import { ApplicationDoc, ApplicationStatus } from "@/types";
import { Globe, Navigation } from "lucide-react";

const ACTIVE_STATUSES = new Set<ApplicationStatus>([
  "preparation",
  "docs_ready",
  "submitted",
  "reviewing",
  "visa",
]);

export default function AdminMapPage() {
  const [applications, setApplications] = useState<ApplicationDoc[]>([]);

  useEffect(() => {
    return onSnapshot(collection(db, "applications"), (snap) => {
      setApplications(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ApplicationDoc)));
    });
  }, []);

  const activeRoutes = useMemo(
    () =>
      applications
        .filter((a) => ACTIVE_STATUSES.has(a.status))
        .map((a) => getRouteForApplication(a))
        .filter((r): r is NonNullable<typeof r> => r !== null),
    [applications]
  );

  const uniqueCountries = useMemo(
    () => new Set(activeRoutes.map((r) => r.to)).size,
    [activeRoutes]
  );

  return (
    <div className="flex flex-col gap-7">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-navy">Xəritə</h1>
        <p className="mt-0.5 text-sm text-gray-400">Aktiv tələbə marşrutlarının coğrafi görünüşü</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Aktiv ərizə</p>
          <p className="mt-2 text-3xl font-bold text-navy">{activeRoutes.length}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Ölkə</p>
          <p className="mt-2 text-3xl font-bold text-navy">{uniqueCountries}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Cəmi ərizə</p>
          <p className="mt-2 text-3xl font-bold text-navy">{applications.length}</p>
        </div>
      </div>

      {/* Map card */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
            <Globe size={14} className="text-navy" />
          </span>
          <p className="text-sm font-semibold text-navy">Tələbə marşrutları</p>
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
            <Navigation size={11} />
            {activeRoutes.length} aktiv
          </span>
        </div>
        <div className="p-4">
          <WorldMap routes={activeRoutes} height={520} />
        </div>
      </section>
    </div>
  );
}
