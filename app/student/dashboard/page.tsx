"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { PortalHeader } from "@/components/layout/PortalHeader";
import { WorldMap } from "@/components/features/WorldMap";
import { ApplicationCard } from "@/components/features/ApplicationCard";
import { Timeline } from "@/components/features/Timeline";
import { DocumentList } from "@/components/features/DocumentList";
import { ChatThread } from "@/components/features/ChatThread";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ApplicationDoc, DocumentDoc } from "@/types";
import { getRouteForApplication } from "@/lib/constants";
import {
  FileSearch,
  GraduationCap,
  CheckCircle,
  LayoutGrid,
  MapPin,
  FileText,
  MessageSquare,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";

const FINAL_STATUSES = new Set(["accepted", "rejected", "departed"]);

export default function StudentDashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<ApplicationDoc[]>([]);
  const [documents, setDocuments] = useState<DocumentDoc[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [appsLoading, setAppsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "applications"), where("studentId", "==", user.uid));
    return onSnapshot(q, (snap) => {
      const apps = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ApplicationDoc));
      setApplications(apps);
      setActiveId((cur) => cur ?? apps[0]?.id ?? null);
      setAppsLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "documents"), where("studentId", "==", user.uid));
    return onSnapshot(q, (snap) => {
      setDocuments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as DocumentDoc)));
    });
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light">
        <Spinner />
      </div>
    );
  }

  const activeApplication = applications.find((a) => a.id === activeId) ?? applications[0];
  const route = activeApplication ? getRouteForApplication(activeApplication) : null;
  const activeCount = applications.filter((a) => !FINAL_STATUSES.has(a.status)).length;
  const acceptedCount = applications.filter((a) => a.status === "accepted").length;

  return (
    <div className="min-h-screen bg-light">
      <PortalHeader title="Mənim ərizələrim" />

      <main className="mx-auto max-w-7xl p-4 sm:p-6">
        {/* Welcome banner */}
        <div className="mb-6 flex items-center gap-4 rounded-xl border border-blue/10 bg-gradient-to-r from-navy to-[#1a3a6e] px-6 py-5 shadow-sm">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Sparkles size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold text-white">
              Xoş gəlmisiniz, {profile?.name?.split(" ")[0] ?? user.displayName?.split(" ")[0] ?? "Tələbə"}!
            </p>
            <p className="mt-0.5 text-sm text-white/60">
              Xaricdə təhsil yolunuzu buradan izləyə bilərsiniz.
            </p>
          </div>
          <div className="hidden shrink-0 items-center gap-6 sm:flex">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{applications.length}</p>
              <p className="text-[11px] text-white/50">Ərizə</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{documents.length}</p>
              <p className="text-[11px] text-white/50">Sənəd</p>
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <section className="mb-6 grid grid-cols-3 gap-4">
          <KpiCard
            icon={LayoutGrid}
            label="Aktiv ərizə"
            value={activeCount}
            loading={appsLoading}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            borderColor="border-l-blue-500"
            numColor="text-blue-700"
          />
          <KpiCard
            icon={CheckCircle}
            label="Qəbul edilib"
            value={acceptedCount}
            loading={appsLoading}
            iconBg="bg-green-50"
            iconColor="text-green-600"
            borderColor="border-l-green-500"
            numColor="text-green-700"
          />
          <KpiCard
            icon={GraduationCap}
            label="Cəmi ərizə"
            value={applications.length}
            loading={appsLoading}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
            borderColor="border-l-violet-500"
            numColor="text-violet-700"
          />
        </section>

        {/* Map + Applications row */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Map */}
          <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
                <MapPin size={14} className="text-navy" />
              </span>
              <p className="text-sm font-semibold text-navy">
                {route ? `Bakı → ${route.label}` : "Marşrut"}
              </p>
              {route && (
                <span className="ml-auto rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  Aktiv
                </span>
              )}
            </div>
            <div className="p-4">
              <WorldMap routes={route ? [route] : []} height={200} />
            </div>
          </section>

          {/* Application cards */}
          <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
                <LayoutGrid size={14} className="text-navy" />
              </span>
              <p className="text-sm font-semibold text-navy">Ərizələrim</p>
              <span className="ml-auto rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                {applications.length}
              </span>
            </div>
            <div className="flex flex-col gap-3 p-4">
              {appsLoading ? (
                <>
                  <Skeleton className="h-28 w-full rounded-xl" />
                  <Skeleton className="h-28 w-full rounded-xl" />
                </>
              ) : applications.length === 0 ? (
                <EmptyState
                  icon={FileSearch}
                  title="Hələ ərizə yoxdur"
                  description="Meneceriniz müraciətinizi yaratdıqdan sonra burada görünəcək. Sualınız varsa aşağıdakı mesajlaşma bölməsindən yazın."
                />
              ) : (
                applications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    active={application.id === activeApplication?.id}
                    onClick={() => setActiveId(application.id)}
                  />
                ))
              )}
            </div>
          </section>
        </div>

        {/* Timeline */}
        {activeApplication && (
          <section className="mb-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
                <ListChecks size={14} className="text-navy" />
              </span>
              <div>
                <p className="text-sm font-semibold text-navy">{activeApplication.universityName}</p>
                <p className="text-xs text-gray-400">{activeApplication.program}</p>
              </div>
            </div>
            <div className="p-5">
              <Timeline application={activeApplication} />
            </div>
          </section>
        )}

        {/* Documents + Chat */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Documents */}
          <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
                <FileText size={14} className="text-navy" />
              </span>
              <p className="text-sm font-semibold text-navy">Sənədlər</p>
              <span className="ml-auto rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                {documents.length}
              </span>
            </div>
            <div className="p-5">
              <DocumentList studentId={user.uid} documents={documents} uploadedBy={user.uid} />
            </div>
          </section>

          {/* Chat */}
          <section className="flex h-[440px] flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
                <MessageSquare size={14} className="text-navy" />
              </span>
              <p className="text-sm font-semibold text-navy">Menecer ilə mesajlaşma</p>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatThread studentId={user.uid} currentUserRole="student" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  loading,
  iconBg,
  iconColor,
  borderColor,
  numColor,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  loading?: boolean;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  numColor: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-l-4 border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5",
        borderColor
      )}
    >
      <Icon
        size={64}
        className={cn("absolute -right-3 -top-3 opacity-[0.05]", iconColor)}
      />
      <div className="relative">
        <div className={cn("mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl", iconBg)}>
          <Icon size={18} className={iconColor} />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
        {loading ? (
          <Skeleton className="mt-1.5 h-8 w-8" />
        ) : (
          <p className={cn("mt-1 text-3xl font-bold", numColor)}>{value}</p>
        )}
      </div>
    </div>
  );
}
