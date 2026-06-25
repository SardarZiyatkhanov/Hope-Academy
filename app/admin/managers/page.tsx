"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { logActivity } from "@/lib/activity-log";
import { exportToCSV } from "@/lib/export-csv";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { CreateManagerModal } from "@/components/features/CreateManagerModal";
import { useToast } from "@/components/ui/Toast";
import { ApplicationDoc, UserDoc } from "@/types";
import {
  UserCog,
  UserPlus,
  Trash2,
  Download,
  Search,
} from "lucide-react";

export default function AdminManagersPage() {
  const [managers, setManagers] = useState<UserDoc[]>([]);
  const [students, setStudents] = useState<UserDoc[]>([]);
  const [applications, setApplications] = useState<ApplicationDoc[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();
  const { user, profile } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "manager"));
    return onSnapshot(q, (snap) => {
      setManagers(
        snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserDoc))
      );
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    return onSnapshot(q, (snap) => {
      setStudents(
        snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserDoc))
      );
    });
  }, []);

  useEffect(() => {
    return onSnapshot(collection(db, "applications"), (snap) => {
      setApplications(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as ApplicationDoc))
      );
    });
  }, []);

  const managerStats = useMemo(() => {
    const map: Record<string, { studentCount: number; appCount: number }> = {};
    managers.forEach((m) => {
      const myStudents = students.filter((s) => s.managerId === m.uid);
      const myApps = applications.filter((a) =>
        myStudents.some((s) => s.uid === a.studentId)
      );
      map[m.uid] = { studentCount: myStudents.length, appCount: myApps.length };
    });
    return map;
  }, [managers, students, applications]);

  const filtered = useMemo(() => {
    if (!search.trim()) return managers;
    const term = search.toLowerCase();
    return managers.filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term)
    );
  }, [managers, search]);

  const handleDelete = async (manager: UserDoc) => {
    if (!confirm(`"${manager.name}" menecerini silmək istədiyinizə əminsiniz?`))
      return;
    await deleteDoc(doc(db, "users", manager.uid));
    await logActivity({
      action: "delete",
      entity: "manager",
      entityId: manager.uid,
      entityName: manager.name,
      userId: user?.uid ?? "",
      userName: profile?.name ?? "",
    });
    showToast("Menecer silindi");
  };

  const handleExport = () => {
    exportToCSV(
      managers.map((m) => ({
        Ad: m.name,
        Email: m.email,
        Telefon: m.phone ?? "",
        Tələbə: managerStats[m.uid]?.studentCount ?? 0,
        Ərizə: managerStats[m.uid]?.appCount ?? 0,
      })),
      "menecerler"
    );
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy">Menecerlər</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Cəmi{" "}
            <span className="font-semibold text-navy">{managers.length}</span>{" "}
            menecer
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download size={15} />
            CSV
          </Button>
          <Button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2"
          >
            <UserPlus size={16} />
            Yeni menecer
          </Button>
        </div>
      </div>

      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
              <UserCog size={14} className="text-navy" />
            </span>
            <h2 className="text-sm font-semibold text-navy">
              Bütün menecerlər
            </h2>
          </div>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-navy outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/70 text-left">
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Ad
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Email
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Telefon
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Tələbə
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Ərizə
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Əməliyyat
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <TableSkeleton cols={6} />
              ) : (
                <>
                  {filtered.map((manager) => {
                    const stats = managerStats[manager.uid] ?? {
                      studentCount: 0,
                      appCount: 0,
                    };
                    return (
                      <tr
                        key={manager.uid}
                        className="group transition-colors hover:bg-blue-50/30"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={manager.name}
                              className="h-8 w-8 shrink-0 text-xs"
                            />
                            <span className="font-semibold text-navy">
                              {manager.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500">
                          {manager.email}
                        </td>
                        <td className="px-4 py-3.5 text-gray-500">
                          {manager.phone ?? "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-50 px-2 text-xs font-semibold text-blue-700">
                            {stats.studentCount}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-green-50 px-2 text-xs font-semibold text-green-700">
                            {stats.appCount}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <Button
                            variant="ghost"
                            onClick={() => handleDelete(manager)}
                            className="h-8 gap-1.5 px-3 text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={13} />
                            Sil
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-12">
                        <EmptyState
                          icon={UserCog}
                          title="Menecer tapılmadı"
                          description="Yeni menecer əlavə etmək üçün düymədən istifadə edin."
                          action={
                            <Button onClick={() => setModalOpen(true)}>
                              Yeni menecer
                            </Button>
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
      </section>

      <CreateManagerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
