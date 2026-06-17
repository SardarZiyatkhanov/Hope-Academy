"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WorldMap } from "@/components/features/WorldMap";
import { AppStatusSelect } from "@/components/features/AppStatusSelect";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusDistributionChart } from "@/components/features/StatusDistributionChart";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import { ApplicationDoc, ApplicationStatus, UserDoc } from "@/types";
import { APPLICATION_STATUS_ORDER, STATUS_LABELS, getRouteForApplication } from "@/lib/constants";
import {
  SearchX,
  Clock,
  FileCheck,
  GraduationCap,
  Stamp,
  MapPin,
  BarChart3,
  TableProperties,
  ArrowUpRight,
} from "lucide-react";

const STATUS_COLOR_HEX: Record<string, string> = {
  gray: "#9ca3af",
  blue: "#1a4aa8",
  purple: "#8b5cf6",
  amber: "#f59e0b",
  green: "#16a34a",
  red: "#ef4444",
  orange: "#f97316",
  teal: "#14b8a6",
};

const PAGE_SIZE = 20;

interface KpiDef {
  status: ApplicationStatus;
  label: string;
  icon: React.ElementType;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  numberColor: string;
  bgGradient: string;
}

const KPI_DEFS: KpiDef[] = [
  {
    status: "reviewing",
    label: "Baxılır",
    icon: Clock,
    borderColor: "border-l-blue-500",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    numberColor: "text-blue-700",
    bgGradient: "from-blue-50/60 to-transparent",
  },
  {
    status: "docs_ready",
    label: "Sənəd yoxlaması",
    icon: FileCheck,
    borderColor: "border-l-amber-500",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    numberColor: "text-amber-700",
    bgGradient: "from-amber-50/60 to-transparent",
  },
  {
    status: "accepted",
    label: "Qəbul edilib",
    icon: GraduationCap,
    borderColor: "border-l-green-500",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    numberColor: "text-green-700",
    bgGradient: "from-green-50/60 to-transparent",
  },
  {
    status: "visa",
    label: "Viza",
    icon: Stamp,
    borderColor: "border-l-violet-500",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    numberColor: "text-violet-700",
    bgGradient: "from-violet-50/60 to-transparent",
  },
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "applications"), (snapshot) => {
      setApplications(
        snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as ApplicationDoc))
      );
      setLoading(false);
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
        count: applications.filter((a) => a.status === def.status).length,
      })),
    [applications]
  );

  const statusDistribution = useMemo(
    () =>
      APPLICATION_STATUS_ORDER.map((status) => ({
        key: status,
        label: STATUS_LABELS[status].az,
        value: applications.filter((a) => a.status === status).length,
        color: STATUS_COLOR_HEX[STATUS_LABELS[status].color] ?? "#9ca3af",
      })),
    [applications]
  );

  const activeRoutes = useMemo(
    () =>
      applications
        .filter((a) => ACTIVE_STATUSES.has(a.status))
        .map((a) => getRouteForApplication(a))
        .filter((r): r is NonNullable<typeof r> => r !== null),
    [applications]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return applications;
    const term = search.trim().toLowerCase();
    return applications.filter((a) =>
      (students[a.studentId]?.name ?? "").toLowerCase().includes(term)
    );
  }, [applications, students, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const total = applications.length;

  return (
    <div className="flex flex-col gap-7">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy">Ərizələr</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Cəmi <span className="font-semibold text-navy">{total}</span> ərizə
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.status}
              className={cn(
                "relative overflow-hidden rounded-xl border border-l-4 border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
                kpi.borderColor
              )}
            >
              {/* Background icon watermark */}
              <Icon
                size={72}
                className={cn("absolute -right-3 -top-3 opacity-[0.05]", kpi.iconColor)}
              />
              {/* Gradient overlay */}
              <div
                className={cn("absolute inset-0 bg-gradient-to-br opacity-40", kpi.bgGradient)}
              />
              <div className="relative">
                <div
                  className={cn(
                    "mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl shadow-sm",
                    kpi.iconBg
                  )}
                >
                  <Icon size={20} className={kpi.iconColor} />
                </div>
                <p className="text-[12px] font-medium uppercase tracking-wide text-gray-400">
                  {kpi.label}
                </p>
                {loading ? (
                  <Skeleton className="mt-2 h-9 w-10" />
                ) : (
                  <p className={cn("mt-1 text-4xl font-bold", kpi.numberColor)}>
                    {kpi.count}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Map + Chart row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Map */}
        <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
              <MapPin size={14} className="text-navy" />
            </span>
            <p className="text-sm font-semibold text-navy">Aktiv tələbə marşrutları</p>
            <span className="ml-auto rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              {activeRoutes.length} aktiv
            </span>
          </div>
          <div className="p-4">
            <WorldMap routes={activeRoutes} height={150} />
          </div>
        </section>

        {/* Status distribution */}
        <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
              <BarChart3 size={14} className="text-navy" />
            </span>
            <p className="text-sm font-semibold text-navy">Status üzrə bölgüsü</p>
          </div>
          <div className="p-4 sm:p-5">
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <Skeleton className="h-40 w-40 rounded-full" />
              </div>
            ) : (
              <StatusDistributionChart data={statusDistribution} />
            )}
          </div>
        </section>
      </div>

      {/* All applications table */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
              <TableProperties size={14} className="text-navy" />
            </span>
            <h2 className="text-sm font-semibold text-navy">Bütün ərizələr</h2>
          </div>
          <Input
            placeholder="Tələbə adı ilə axtar..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/70 text-left">
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Tələbə
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Universitet
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Ölkə
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Status
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Əməliyyat
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <TableSkeleton cols={5} />
              ) : (
                <>
                  {pageItems.map((application) => {
                    const studentName = students[application.studentId]?.name ?? "—";
                    return (
                      <tr
                        key={application.id}
                        className="group transition-colors hover:bg-blue-50/30"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar name={studentName} className="h-8 w-8 shrink-0 text-xs" />
                            <span className="font-semibold text-navy">{studentName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-600">{application.universityName}</td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-gray-600">
                            {application.universityCountry}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <AppStatusSelect
                            applicationId={application.id}
                            status={application.status}
                          />
                        </td>
                        <td className="px-4 py-3.5">
                          <Link href={`/admin/students/${application.studentId}`}>
                            <Button
                              variant="ghost"
                              className="h-8 gap-1.5 px-3 text-xs font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            >
                              Aç
                              <ArrowUpRight size={13} />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                  {pageItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-10">
                        <EmptyState
                          icon={SearchX}
                          title="Nəticə tapılmadı"
                          description={
                            search.trim()
                              ? "Axtarış sorğusuna uyğun ərizə tapılmadı. Başqa açar söz cəhd edin."
                              : "Hələ heç bir ərizə əlavə edilməyib."
                          }
                        />
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3.5">
          <p className="text-xs text-gray-400">
            <span className="font-semibold text-navy">{filtered.length}</span> nəticə
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-8 px-3 text-xs"
            >
              ← Əvvəlki
            </Button>
            <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-navy">
              {page} / {totalPages}
            </span>
            <Button
              variant="ghost"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 px-3 text-xs"
            >
              Növbəti →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
