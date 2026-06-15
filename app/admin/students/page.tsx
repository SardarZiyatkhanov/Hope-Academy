"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { CreateStudentModal } from "@/components/features/CreateStudentModal";
import { ApplicationDoc, UserDoc } from "@/types";
import { STATUS_STEP } from "@/lib/constants";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<UserDoc[]>([]);
  const [managers, setManagers] = useState<UserDoc[]>([]);
  const [applications, setApplications] = useState<ApplicationDoc[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const studentsQuery = query(collection(db, "users"), where("role", "==", "student"));
    const unsubscribe = onSnapshot(studentsQuery, (snapshot) => {
      setStudents(
        snapshot.docs.map((docSnap) => ({ uid: docSnap.id, ...docSnap.data() } as UserDoc))
      );
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const managersQuery = query(collection(db, "users"), where("role", "==", "manager"));
    const unsubscribe = onSnapshot(managersQuery, (snapshot) => {
      setManagers(
        snapshot.docs.map((docSnap) => ({ uid: docSnap.id, ...docSnap.data() } as UserDoc))
      );
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "applications"), (snapshot) => {
      setApplications(
        snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as ApplicationDoc))
      );
    });
    return unsubscribe;
  }, []);

  const managerNames = useMemo(() => {
    const map: Record<string, string> = {};
    managers.forEach((manager) => {
      map[manager.uid] = manager.name;
    });
    return map;
  }, [managers]);

  const studentStats = useMemo(() => {
    const map: Record<string, { count: number; progress: number }> = {};
    students.forEach((student) => {
      const apps = applications.filter((application) => application.studentId === student.uid);
      const progress = apps.length
        ? Math.round(
            (apps.reduce((sum, app) => sum + STATUS_STEP[app.status], 0) / (apps.length * 5)) * 100
          )
        : 0;
      map[student.uid] = { count: apps.length, progress };
    });
    return map;
  }, [students, applications]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-navy">Tələbələr</h1>
        <Button onClick={() => setModalOpen(true)}>Yeni tələbə</Button>
      </div>

      <div className="overflow-x-auto rounded-card bg-white p-4 sm:p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
              <th className="px-3 py-2">Ad</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Menecer</th>
              <th className="px-3 py-2">Ərizələr</th>
              <th className="px-3 py-2">Proqres</th>
              <th className="px-3 py-2">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const stats = studentStats[student.uid] ?? { count: 0, progress: 0 };
              return (
                <tr key={student.uid} className="border-b border-gray-50">
                  <td className="px-3 py-3 font-medium text-navy">{student.name}</td>
                  <td className="px-3 py-3 text-gray-600">{student.email}</td>
                  <td className="px-3 py-3 text-gray-600">
                    {student.managerId ? managerNames[student.managerId] ?? "—" : "—"}
                  </td>
                  <td className="px-3 py-3">{stats.count}</td>
                  <td className="px-3 py-3">
                    <div className="h-1.5 w-24 rounded-pill bg-gray-100">
                      <div
                        className="h-1.5 rounded-pill bg-blue"
                        style={{ width: `${stats.progress}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Link href={`/admin/students/${student.uid}`}>
                      <Button variant="ghost">Aç</Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
            {students.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-gray-400">
                  Hələ tələbə yoxdur
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateStudentModal open={modalOpen} onClose={() => setModalOpen(false)} managers={managers} />
    </div>
  );
}
