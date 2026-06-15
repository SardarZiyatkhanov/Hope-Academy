"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WorldMap } from "@/components/features/WorldMap";
import { getRouteForApplication } from "@/lib/constants";
import { ApplicationDoc, ApplicationStatus } from "@/types";

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
    const unsubscribe = onSnapshot(collection(db, "applications"), (snapshot) => {
      setApplications(
        snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as ApplicationDoc))
      );
    });
    return unsubscribe;
  }, []);

  const activeRoutes = useMemo(
    () =>
      applications
        .filter((application) => ACTIVE_STATUSES.has(application.status))
        .map((application) => getRouteForApplication(application))
        .filter((route): route is NonNullable<typeof route> => route !== null),
    [applications]
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-navy">Xəritə</h1>
      <p className="text-sm text-gray-500">
        Aktiv tələbə marşrutları · {activeRoutes.length} aktiv ərizə
      </p>
      <WorldMap routes={activeRoutes} height={520} />
    </div>
  );
}
