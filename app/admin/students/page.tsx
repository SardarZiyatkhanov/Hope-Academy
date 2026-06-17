"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { CreateStudentModal } from "@/components/features/CreateStudentModal";
import { ApplicationDoc, UserDoc } from "@/types";
import { STATUS_STEP } from "@/lib/constants";
import { GraduationCap, Users, ArrowUpRight, UserPlus } from "lucide-react";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<UserDoc[]>([]);
  const [managers, setManagers] = useState<UserDoc[]>([]);
  const [applications, setApplications] = useState<ApplicationDoc[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    return onSnapshot(q, (snap) => {
      setStudents(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserDoc)));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "manager"));
    return onSnapshot(q, (snap) => {
      setManagers(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserDoc)));
    });
  }, []);

  useEffect(() => {
    return onSnapshot(collection(db, "applications"), (snap) => {
      setApplications(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ApplicationDoc)));
    });
  }, []);

  const managerNames = useMemo(() => {
    const map: Record<string, string> = {};
    managers.forEach((m) => { map[m.uid] = m.name; });
    return map;
  }, [managers]);

  const studentStats = useMemo(() => {
    const map: Record<string, { count: number; progress: number }> = {};
    students.forEach((s) => {
      const apps = applications.filter((a) => a.studentId === s.uid);
      const progress = apps.length
        ? Math.round((apps.reduce((sum, a) => sum + STATUS_STEP[a.status], 0) / (apps.length * 5)) * 100)
        : 0;
      map[s.uid] = { count: apps.length, progress };
    });
    return map;
  }, [students, applications]);

  return (
    <div className="flex flex-col gap-7">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy">Tələbələr</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Cəmi <span className="font-semibold text-navy">{students.length}</span> tələbə
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <UserPlus size={16} />
          Yeni tələbə
        </Button>
      </div>

      {/* Table card */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
            <Users size={14} className="text-navy" />
          </span>
          <h2 className="text-sm font-semibold text-navy">Bütün tələbələr</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/70 text-left">
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Ad</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Email</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Menecer</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Ərizələr</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Proqres</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <TableSkeleton cols={6} />
              ) : (
                <>
                  {students.map((student) => {
                    const stats = studentStats[student.uid] ?? { count: 0, progress: 0 };
                    return (
                      <tr key={student.uid} className="group transition-colors hover:bg-blue-50/30">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar name={student.name} className="h-8 w-8 shrink-0 text-xs" />
                            <span className="font-semibold text-navy">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500">{student.email}</td>
                        <td className="px-4 py-3.5 text-gray-600">
                          {student.managerId ? managerNames[student.managerId] ?? "—" : "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-50 px-2 text-xs font-semibold text-blue-700">
                            {stats.count}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-blue to-accent transition-all"
                                style={{ width: `${stats.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400">{stats.progress}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <Link href={`/admin/students/${student.uid}`}>
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
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-12">
                        <EmptyState
                          icon={GraduationCap}
                          title="Hələ tələbə yoxdur"
                          description="Yeni tələbə hesabı yaratmaq üçün düymədən istifadə edin."
                          action={<Button onClick={() => setModalOpen(true)}>Yeni tələbə</Button>}
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

      <CreateStudentModal open={modalOpen} onClose={() => setModalOpen(false)} managers={managers} />
    </div>
  );
}
