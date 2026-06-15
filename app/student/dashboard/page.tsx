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
import { FileSearch } from "lucide-react";

const FINAL_STATUSES = new Set(["accepted", "rejected", "departed"]);

export default function StudentDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<ApplicationDoc[]>([]);
  const [documents, setDocuments] = useState<DocumentDoc[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [appsLoading, setAppsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const applicationsQuery = query(
      collection(db, "applications"),
      where("studentId", "==", user.uid)
    );
    const unsubscribe = onSnapshot(applicationsQuery, (snapshot) => {
      const apps = snapshot.docs.map(
        (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as ApplicationDoc)
      );
      setApplications(apps);
      setActiveId((current) => current ?? apps[0]?.id ?? null);
      setAppsLoading(false);
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const documentsQuery = query(
      collection(db, "documents"),
      where("studentId", "==", user.uid)
    );
    const unsubscribe = onSnapshot(documentsQuery, (snapshot) => {
      setDocuments(
        snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as DocumentDoc))
      );
    });
    return unsubscribe;
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light">
        <Spinner />
      </div>
    );
  }

  const activeApplication =
    applications.find((application) => application.id === activeId) ?? applications[0];
  const route = activeApplication ? getRouteForApplication(activeApplication) : null;

  const activeCount = applications.filter(
    (application) => !FINAL_STATUSES.has(application.status)
  ).length;
  const acceptedCount = applications.filter(
    (application) => application.status === "accepted"
  ).length;

  return (
    <div className="min-h-screen bg-light">
      <PortalHeader title="Mənim ərizələrim" />

      <main className="mx-auto max-w-7xl p-4 sm:p-6">
        {/* Block A — route map */}
        <section className="mb-6">
          <p className="mb-2 text-sm font-medium text-navy">
            {route ? `Bakı → ${route.label} marşrutu` : "Marşrut mövcud deyil"}
          </p>
          <WorldMap routes={route ? [route] : []} height={200} />
        </section>

        {/* Block B — summary cards */}
        <section className="mb-6 grid grid-cols-3 gap-4">
          <SummaryCard label="Aktiv" value={activeCount} loading={appsLoading} />
          <SummaryCard label="Qəbul" value={acceptedCount} loading={appsLoading} />
          <SummaryCard label="Cəmi" value={applications.length} loading={appsLoading} />
        </section>

        {/* Block C — application cards */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {appsLoading ? (
            <>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </>
          ) : applications.length === 0 ? (
            <div className="col-span-1 rounded-card bg-white sm:col-span-2">
              <EmptyState
                icon={FileSearch}
                title="Hələ ərizə yoxdur"
                description="Müraciətləriniz hazır olduqda burada görünəcək. Suallarınız varsa, menecerinizlə əlaqə saxlayın."
              />
            </div>
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
        </section>

        {/* Block D — detailed timeline */}
        {activeApplication && (
          <section className="mb-6 rounded-card bg-white p-4 sm:p-6">
            <h2 className="mb-4 text-base font-semibold text-navy">
              {activeApplication.universityName} — {activeApplication.program}
            </h2>
            <Timeline application={activeApplication} />
          </section>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Block E — documents */}
          <section className="rounded-card bg-white p-4 sm:p-6">
            <h2 className="mb-4 text-base font-semibold text-navy">Sənədlər</h2>
            <DocumentList studentId={user.uid} documents={documents} uploadedBy={user.uid} />
          </section>

          {/* Block F — chat */}
          <section className="flex h-[420px] flex-col overflow-hidden rounded-card bg-white">
            <h2 className="border-b border-gray-100 p-4 text-base font-semibold text-navy">
              Mesajlar
            </h2>
            <div className="flex-1 overflow-hidden">
              <ChatThread studentId={user.uid} currentUserRole="student" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  loading,
}: {
  label: string;
  value: number;
  loading?: boolean;
}) {
  return (
    <div className="rounded-card bg-white p-4 text-center">
      {loading ? (
        <Skeleton className="mx-auto h-8 w-10" />
      ) : (
        <p className="text-2xl font-bold text-navy">{value}</p>
      )}
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  );
}
