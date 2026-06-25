"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/Skeleton";
import { BarChart } from "@/components/features/BarChart";
import { StatusDistributionChart } from "@/components/features/StatusDistributionChart";
import {
  APPLICATION_STATUS_ORDER,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_ORDER,
  STATUS_LABELS,
} from "@/lib/constants";
import { ApplicationDoc, LeadDoc, UserDoc } from "@/types";
import {
  BarChart3,
  TrendingUp,
  Users,
  GraduationCap,
  Target,
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

const MONTHS_AZ = [
  "Yan",
  "Fev",
  "Mar",
  "Apr",
  "May",
  "İyn",
  "İyl",
  "Avq",
  "Sen",
  "Okt",
  "Noy",
  "Dek",
];

export default function AdminAnalyticsPage() {
  const [applications, setApplications] = useState<ApplicationDoc[]>([]);
  const [leads, setLeads] = useState<LeadDoc[]>([]);
  const [students, setStudents] = useState<UserDoc[]>([]);
  const [managers, setManagers] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubs = [
      onSnapshot(collection(db, "applications"), (snap) => {
        setApplications(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as ApplicationDoc))
        );
        setLoading(false);
      }),
      onSnapshot(collection(db, "leads"), (snap) => {
        setLeads(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as LeadDoc))
        );
      }),
      onSnapshot(
        query(collection(db, "users"), where("role", "==", "student")),
        (snap) => {
          setStudents(
            snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserDoc))
          );
        }
      ),
      onSnapshot(
        query(collection(db, "users"), where("role", "==", "manager")),
        (snap) => {
          setManagers(
            snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserDoc))
          );
        }
      ),
    ];
    return () => unsubs.forEach((u) => u());
  }, []);

  const monthlyApps = useMemo(() => {
    const now = new Date();
    const months: { label: string; value: number; color: string }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const count = applications.filter((a) => {
        const ts = a.createdAt?.toDate?.();
        if (!ts) return false;
        return `${ts.getFullYear()}-${ts.getMonth()}` === key;
      }).length;
      months.push({
        label: MONTHS_AZ[d.getMonth()],
        value: count,
        color: "#1a4aa8",
      });
    }
    return months;
  }, [applications]);

  const monthlyLeads = useMemo(() => {
    const now = new Date();
    const months: { label: string; value: number; color: string }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const count = leads.filter((l) => {
        const ts = l.createdAt?.toDate?.();
        if (!ts) return false;
        return `${ts.getFullYear()}-${ts.getMonth()}` === key;
      }).length;
      months.push({
        label: MONTHS_AZ[d.getMonth()],
        value: count,
        color: "#8b5cf6",
      });
    }
    return months;
  }, [leads]);

  const leadFunnel = useMemo(
    () =>
      LEAD_STATUS_ORDER.map((status) => ({
        key: status,
        label: LEAD_STATUS_LABELS[status].az,
        value: leads.filter((l) => l.status === status).length,
        color: STATUS_COLOR_HEX[LEAD_STATUS_LABELS[status].color] ?? "#9ca3af",
      })),
    [leads]
  );

  const appDistribution = useMemo(
    () =>
      APPLICATION_STATUS_ORDER.map((status) => ({
        key: status,
        label: STATUS_LABELS[status].az,
        value: applications.filter((a) => a.status === status).length,
        color: STATUS_COLOR_HEX[STATUS_LABELS[status].color] ?? "#9ca3af",
      })),
    [applications]
  );

  const managerPerformance = useMemo(() => {
    return managers.map((m) => {
      const myStudents = students.filter((s) => s.managerId === m.uid);
      const studentIds = new Set(myStudents.map((s) => s.uid));
      const myApps = applications.filter((a) => studentIds.has(a.studentId));
      const accepted = myApps.filter((a) => a.status === "accepted").length;
      const myLeads = leads.filter((l) => l.assignedTo === m.uid);
      const convertedLeads = myLeads.filter(
        (l) => l.status === "became_student"
      ).length;
      return {
        name: m.name,
        students: myStudents.length,
        applications: myApps.length,
        accepted,
        leads: myLeads.length,
        converted: convertedLeads,
        conversionRate:
          myLeads.length > 0
            ? Math.round((convertedLeads / myLeads.length) * 100)
            : 0,
      };
    });
  }, [managers, students, applications, leads]);

  const countryStats = useMemo(() => {
    const map: Record<string, number> = {};
    applications.forEach((a) => {
      const country = a.universityCountry || "Digər";
      map[country] = (map[country] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .map(([country, count]) => ({ country, count }));
  }, [applications]);

  const conversionRate =
    leads.length > 0
      ? Math.round(
          (leads.filter((l) => l.status === "became_student").length /
            leads.length) *
            100
        )
      : 0;
  const acceptanceRate =
    applications.length > 0
      ? Math.round(
          (applications.filter((a) => a.status === "accepted").length /
            applications.length) *
            100
        )
      : 0;

  if (loading) {
    return (
      <div className="flex flex-col gap-7">
        <div>
          <Skeleton className="h-7 w-40" />
          <Skeleton className="mt-2 h-4 w-60" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="text-xl font-bold text-navy">Analitika</h1>
        <p className="mt-0.5 text-sm text-gray-400">
          Ətraflı statistika və hesabatlar
        </p>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <GraduationCap size={16} className="text-blue-600" />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Ərizə
            </p>
          </div>
          <p className="mt-3 text-3xl font-bold text-navy">
            {applications.length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
              <TrendingUp size={16} className="text-violet-600" />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Lid
            </p>
          </div>
          <p className="mt-3 text-3xl font-bold text-navy">{leads.length}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
              <Target size={16} className="text-green-600" />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Konversiya
            </p>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-navy">{conversionRate}%</p>
            <span className="flex items-center text-xs text-green-600">
              <ArrowUpRight size={12} />
              lid→tələbə
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
              <Users size={16} className="text-amber-600" />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Qəbul faizi
            </p>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-navy">{acceptanceRate}%</p>
            <span className="flex items-center text-xs text-blue-600">
              <ArrowUpRight size={12} />
              qəbul
            </span>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly applications */}
        <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
              <BarChart3 size={14} className="text-navy" />
            </span>
            <p className="text-sm font-semibold text-navy">
              Aylıq ərizələr (12 ay)
            </p>
          </div>
          <div className="p-5">
            <BarChart data={monthlyApps} height={180} />
          </div>
        </section>

        {/* Monthly leads */}
        <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
              <TrendingUp size={14} className="text-navy" />
            </span>
            <p className="text-sm font-semibold text-navy">
              Aylıq lidlər (12 ay)
            </p>
          </div>
          <div className="p-5">
            <BarChart data={monthlyLeads} height={180} />
          </div>
        </section>
      </div>

      {/* Distribution row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* App status distribution */}
        <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
              <BarChart3 size={14} className="text-navy" />
            </span>
            <p className="text-sm font-semibold text-navy">
              Ərizə statusları
            </p>
          </div>
          <div className="p-5">
            <StatusDistributionChart data={appDistribution} />
          </div>
        </section>

        {/* Lead funnel */}
        <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
              <Target size={14} className="text-navy" />
            </span>
            <p className="text-sm font-semibold text-navy">
              Lid konversiya hunisi
            </p>
          </div>
          <div className="p-5">
            <StatusDistributionChart data={leadFunnel} />
          </div>
        </section>
      </div>

      {/* Country breakdown */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
            <BarChart3 size={14} className="text-navy" />
          </span>
          <p className="text-sm font-semibold text-navy">
            Ölkə üzrə ərizələr
          </p>
        </div>
        <div className="p-5">
          {countryStats.length === 0 ? (
            <p className="text-sm text-gray-400">Məlumat yoxdur</p>
          ) : (
            <div className="flex flex-col gap-3">
              {countryStats.map(({ country, count }) => {
                const pct =
                  applications.length > 0
                    ? Math.round((count / applications.length) * 100)
                    : 0;
                return (
                  <div key={country} className="flex items-center gap-4">
                    <span className="w-28 text-sm font-medium text-navy">
                      {country}
                    </span>
                    <div className="flex-1">
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue to-accent transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-14 text-right text-sm font-semibold text-navy">
                      {count}
                    </span>
                    <span className="w-10 text-right text-xs text-gray-400">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Manager performance */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
            <Users size={14} className="text-navy" />
          </span>
          <p className="text-sm font-semibold text-navy">
            Menecer performansı
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/70 text-left">
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Menecer
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Tələbə
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Ərizə
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Qəbul
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Lid
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Konversiya
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {managerPerformance.map((m) => (
                <tr
                  key={m.name}
                  className="transition-colors hover:bg-blue-50/30"
                >
                  <td className="px-5 py-3.5 font-semibold text-navy">
                    {m.name}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{m.students}</td>
                  <td className="px-4 py-3.5 text-gray-600">
                    {m.applications}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-green-50 px-2 text-xs font-semibold text-green-700">
                      {m.accepted}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{m.leads}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600"
                          style={{ width: `${m.conversionRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {m.conversionRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {managerPerformance.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-sm text-gray-400"
                  >
                    Menecer yoxdur
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
