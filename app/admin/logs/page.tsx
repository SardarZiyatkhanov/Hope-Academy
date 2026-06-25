"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  ACTIVITY_ACTION_LABELS,
  ACTIVITY_ENTITY_LABELS,
} from "@/lib/constants";
import { ActivityLogDoc } from "@/types";
import {
  History,
  Plus,
  RefreshCw,
  Trash2,
  ArrowRightLeft,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/cn";

const ACTION_ICON: Record<string, React.ElementType> = {
  create: Plus,
  update: RefreshCw,
  delete: Trash2,
  status_change: ArrowRightLeft,
};

const ACTION_COLOR: Record<string, string> = {
  create: "bg-green-50 text-green-600",
  update: "bg-blue-50 text-blue-600",
  delete: "bg-red-50 text-red-600",
  status_change: "bg-amber-50 text-amber-600",
};

const PAGE_SIZE = 30;

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<ActivityLogDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const q = query(
      collection(db, "activityLogs"),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) => {
      setLogs(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as ActivityLogDoc))
      );
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = logs;
    if (entityFilter) list = list.filter((l) => l.entity === entityFilter);
    if (actionFilter) list = list.filter((l) => l.action === actionFilter);
    return list;
  }, [logs, entityFilter, actionFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="text-xl font-bold text-navy">Fəaliyyət jurnalı</h1>
        <p className="mt-0.5 text-sm text-gray-400">
          Cəmi{" "}
          <span className="font-semibold text-navy">{logs.length}</span>{" "}
          qeyd
        </p>
      </div>

      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
              <History size={14} className="text-navy" />
            </span>
            <h2 className="text-sm font-semibold text-navy">
              Bütün əməliyyatlar
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Filter size={14} className="text-gray-400" />
            <select
              value={entityFilter}
              onChange={(e) => {
                setEntityFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-navy outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Bütün obyektlər</option>
              {Object.entries(ACTIVITY_ENTITY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-navy outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Bütün əməliyyatlar</option>
              {Object.entries(ACTIVITY_ACTION_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="flex flex-col gap-0">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          ) : pageItems.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={History}
                title="Qeyd tapılmadı"
                description="Fəaliyyət jurnalında hələ heç bir qeyd yoxdur."
              />
            </div>
          ) : (
            pageItems.map((log) => {
              const Icon = ACTION_ICON[log.action] ?? RefreshCw;
              const colorClass = ACTION_COLOR[log.action] ?? "bg-gray-50 text-gray-600";
              const date = log.createdAt?.toDate?.();

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-gray-50/50"
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      colorClass
                    )}
                  >
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-navy">
                      <span className="font-semibold">{log.userName}</span>
                      {" · "}
                      <span className="text-gray-500">
                        {ACTIVITY_ACTION_LABELS[log.action] ?? log.action}
                      </span>
                      {" · "}
                      <span className="font-medium">
                        {ACTIVITY_ENTITY_LABELS[log.entity] ?? log.entity}
                      </span>
                      {" — "}
                      <span className="text-gray-600">{log.entityName}</span>
                    </p>
                    {(log.oldValue || log.newValue) && (
                      <p className="mt-0.5 text-xs text-gray-400">
                        {log.oldValue && (
                          <span className="line-through">{log.oldValue}</span>
                        )}
                        {log.oldValue && log.newValue && " → "}
                        {log.newValue && (
                          <span className="font-medium text-gray-600">
                            {log.newValue}
                          </span>
                        )}
                      </p>
                    )}
                    {log.details && (
                      <p className="mt-0.5 text-xs text-gray-400">
                        {log.details}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">
                    {date
                      ? date.toLocaleString("az-AZ", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3.5">
            <p className="text-xs text-gray-400">
              <span className="font-semibold text-navy">{filtered.length}</span>{" "}
              qeyd
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg px-3 py-1 text-xs font-medium text-navy transition-colors hover:bg-gray-100 disabled:opacity-40"
              >
                ← Əvvəlki
              </button>
              <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-navy">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg px-3 py-1 text-xs font-medium text-navy transition-colors hover:bg-gray-100 disabled:opacity-40"
              >
                Növbəti →
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
