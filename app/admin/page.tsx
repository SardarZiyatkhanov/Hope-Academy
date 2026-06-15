"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WorldMap } from "@/components/features/WorldMap";
import { AppStatusSelect } from "@/components/features/AppStatusSelect";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { ApplicationDoc, ApplicationStatus, UserDoc } from "@/types";
import { getRouteForApplication } from "@/lib/constants";

const PAGE_SIZE = 20;

const KPI_DEFS: Array<{ status: ApplicationStatus; label: string; color: string }> = [
  { status: "reviewing", label: "Baxılır", color: "bg-blue-50 text-blue-700" },
  { status: "docs_ready", label: "Sənəd yoxlaması", color: "bg-amber-50 text-amber-700" },
  { status: "accepted", label: "Qəbul edilib", color: "bg-green-50 text-green-700" },
  { status: "visa", label: "Viza", color: "bg-red-50 text-red-700" },
];

const ACTIVE_STATUSES = new Set<ApplicationStatus>([
  "preparation",
  "docs_ready",
  "submitted",
  "reviewing",
  "visa",
]);

export default function AdminDashboardPage() {
  const [applications, setApplications] = useState<ApplicationDoc[]>([]);
  const [students, setStudents] = useState<Record<string, UserDoc>>({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "applications"), (snapshot) => {
      setApplications(
        snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as ApplicationDoc))
      );
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const studentsQuery = query(collection(db, "users"), where("role", "==", "student"));
    const unsubscribe = onSnapshot(studentsQuery, (snapshot) => {
      const map: Record<string, UserDoc> = {};
      snapshot.docs.forEach((docSnap) => {
        map[docSnap.id] = { uid: docSnap.id, ...docSnap.data() } as UserDoc;
      });
      setStudents(map);
    });
    return unsubscribe;
  }, []);

  const kpis = useMemo(
    () =>
      KPI_DEFS.map((def) => ({
        ...def,
        count: applications.filter((application) => application.status === def.status).length,
      })),
    [applications]
  );

  const activeRoutes = useMemo(
    () =>
      applications
        .filter((application) => ACTIVE_STATUSES.has(application.status))
        .map((application) => getRouteForApplication(application))
        .filter((route): route is NonNullable<typeof route> => route !== null),
    [applications]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return applications;
    const term = search.trim().toLowerCase();
    return applications.filter((application) =>
      (students[application.studentId]?.name ?? "").toLowerCase().includes(term)
    );
  }, [applications, students, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-navy">Ərizələr</h1>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.status} className="rounded-card bg-white p-4">
            <span className={cn("inline-flex rounded-pill px-3 py-1 text-xs font-medium", kpi.color)}>
              {kpi.label}
            </span>
            <p className="mt-3 text-2xl font-bold text-navy">{kpi.count}</p>
          </div>
        ))}
      </section>

      <section>
        <p className="mb-2 text-sm font-medium text-navy">
          Aktiv tələbə marşrutları · {activeRoutes.length} aktiv ərizə
        </p>
        <WorldMap routes={activeRoutes} height={150} />
      </section>

      <section className="rounded-card bg-white p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-navy">Bütün ərizələr</h2>
          <Input
            placeholder="Tələbə adı ilə axtar..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
                <th className="px-3 py-2">Tələbə</th>
                <th className="px-3 py-2">Universitet</th>
                <th className="px-3 py-2">Ölkə</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((application) => (
                <tr key={application.id} className="border-b border-gray-50">
                  <td className="px-3 py-3 font-medium text-navy">
                    {students[application.studentId]?.name ?? "—"}
                  </td>
                  <td className="px-3 py-3">{application.universityName}</td>
                  <td className="px-3 py-3">{application.universityCountry}</td>
                  <td className="px-3 py-3">
                    <AppStatusSelect applicationId={application.id} status={application.status} />
                  </td>
                  <td className="px-3 py-3">
                    <Link href={`/admin/students/${application.studentId}`}>
                      <Button variant="ghost">Aç</Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-gray-400">
                    Nəticə tapılmadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-gray-400">{filtered.length} nəticə</p>
          <div className="flex gap-2">
            <Button variant="ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Əvvəlki
            </Button>
            <Button
              variant="ghost"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Növbəti
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
