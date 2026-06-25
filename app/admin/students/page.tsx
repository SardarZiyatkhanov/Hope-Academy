"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { exportToCSV } from "@/lib/export-csv";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { CreateStudentModal } from "@/components/features/CreateStudentModal";
import { ApplicationDoc, DocumentDoc, UserDoc } from "@/types";
import { STATUS_STEP, DOCUMENT_TYPE_LABELS } from "@/lib/constants";
import {
  GraduationCap,
  Users,
  ArrowUpRight,
  UserPlus,
  Download,
  Search,
  Filter,
  FileText,
  ExternalLink,
} from "lucide-react";

export default function AdminStudentsPage() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const isDocumentsView = view === "documents";

  const [students, setStudents] = useState<UserDoc[]>([]);
  const [managers, setManagers] = useState<UserDoc[]>([]);
  const [applications, setApplications] = useState<ApplicationDoc[]>([]);
  const [documents, setDocuments] = useState<DocumentDoc[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [docsLoading, setDocsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [managerFilter, setManagerFilter] = useState("");
  const [docSearch, setDocSearch] = useState("");
  const [docTypeFilter, setDocTypeFilter] = useState("");
  const [docStudentFilter, setDocStudentFilter] = useState("");

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

  useEffect(() => {
    return onSnapshot(collection(db, "documents"), (snap) => {
      setDocuments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as DocumentDoc)));
      setDocsLoading(false);
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

  const filtered = useMemo(() => {
    let list = students;
    if (managerFilter) list = list.filter((s) => s.managerId === managerFilter);
    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.email.toLowerCase().includes(term)
      );
    }
    return list;
  }, [students, search, managerFilter]);

  const studentNames = useMemo(() => {
    const map: Record<string, string> = {};
    students.forEach((s) => { map[s.uid] = s.name; });
    return map;
  }, [students]);

  const filteredDocs = useMemo(() => {
    let list = documents;
    if (docTypeFilter) list = list.filter((d) => d.type === docTypeFilter);
    if (docStudentFilter) list = list.filter((d) => d.studentId === docStudentFilter);
    if (docSearch.trim()) {
      const term = docSearch.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(term) ||
          (studentNames[d.studentId] ?? "").toLowerCase().includes(term)
      );
    }
    return list;
  }, [documents, docTypeFilter, docStudentFilter, docSearch, studentNames]);

  const handleExport = () => {
    exportToCSV(
      filtered.map((s) => ({
        Ad: s.name,
        Email: s.email,
        Telefon: s.phone ?? "",
        Menecer: s.managerId ? managerNames[s.managerId] ?? "" : "",
        Ərizə: studentStats[s.uid]?.count ?? 0,
        "Proqres %": studentStats[s.uid]?.progress ?? 0,
      })),
      "telebeler"
    );
  };

  const handleDocsExport = () => {
    exportToCSV(
      filteredDocs.map((d) => ({
        Tələbə: studentNames[d.studentId] ?? d.studentId,
        Sənəd: d.name,
        Növ: DOCUMENT_TYPE_LABELS[d.type] ?? d.type,
        Ölçü: `${(d.fileSize / 1024).toFixed(0)} KB`,
      })),
      "senedler"
    );
  };

  if (isDocumentsView) {
    return (
      <div className="flex flex-col gap-7">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-navy">Sənədlər</h1>
            <p className="mt-0.5 text-sm text-gray-400">
              Cəmi <span className="font-semibold text-navy">{filteredDocs.length}</span> sənəd
            </p>
          </div>
          <Button variant="ghost" onClick={handleDocsExport} className="flex items-center gap-2">
            <Download size={15} />
            CSV
          </Button>
        </div>

        <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
                <FileText size={14} className="text-navy" />
              </span>
              <h2 className="text-sm font-semibold text-navy">Bütün sənədlər</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Filter size={13} className="text-gray-400" />
              <select
                value={docStudentFilter}
                onChange={(e) => setDocStudentFilter(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-navy outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Bütün tələbələr</option>
                {students.map((s) => (
                  <option key={s.uid} value={s.uid}>{s.name}</option>
                ))}
              </select>
              <select
                value={docTypeFilter}
                onChange={(e) => setDocTypeFilter(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-navy outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Bütün növlər</option>
                {(Object.entries(DOCUMENT_TYPE_LABELS) as [string, string][]).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Sənəd adı, tələbə..."
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  className="rounded-lg border border-gray-200 bg-white py-2 pl-8 pr-3 text-xs text-navy outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/70 text-left">
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Tələbə</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Sənəd</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Növ</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Ölçü</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {docsLoading ? (
                  <TableSkeleton cols={5} />
                ) : (
                  <>
                    {filteredDocs.map((doc) => (
                      <tr key={doc.id} className="group transition-colors hover:bg-blue-50/30">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={studentNames[doc.studentId] ?? "?"}
                              className="h-8 w-8 shrink-0 text-xs"
                            />
                            <Link
                              href={`/admin/students/${doc.studentId}`}
                              className="font-semibold text-navy hover:text-blue"
                            >
                              {studentNames[doc.studentId] ?? doc.studentId}
                            </Link>
                          </div>
                        </td>
                        <td className="max-w-[200px] px-4 py-3.5">
                          <p className="truncate text-gray-700">{doc.name}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700">
                            {DOCUMENT_TYPE_LABELS[doc.type] ?? doc.type}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 text-xs">
                          {(doc.fileSize / 1024).toFixed(0)} KB
                        </td>
                        <td className="px-4 py-3.5">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Button
                              variant="ghost"
                              className="h-8 gap-1.5 px-3 text-xs font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <ExternalLink size={13} />
                              Aç
                            </Button>
                          </a>
                        </td>
                      </tr>
                    ))}
                    {filteredDocs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-12">
                          <EmptyState
                            icon={FileText}
                            title="Sənəd tapılmadı"
                            description="Filtri dəyişdirin və ya tələbəyə sənəd yükləyin."
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
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy">Tələbələr</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Cəmi <span className="font-semibold text-navy">{students.length}</span> tələbə
            {filtered.length !== students.length && (
              <span className="ml-1 text-blue-600">
                ({filtered.length} göstərilir)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handleExport} className="flex items-center gap-2">
            <Download size={15} />
            CSV
          </Button>
          <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
            <UserPlus size={16} />
            Yeni tələbə
          </Button>
        </div>
      </div>

      {/* Table card */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
              <Users size={14} className="text-navy" />
            </span>
            <h2 className="text-sm font-semibold text-navy">Bütün tələbələr</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Filter size={13} className="text-gray-400" />
            <select
              value={managerFilter}
              onChange={(e) => setManagerFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-navy outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Bütün menecerlər</option>
              {managers.map((m) => (
                <option key={m.uid} value={m.uid}>{m.name}</option>
              ))}
            </select>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Ad, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white py-2 pl-8 pr-3 text-xs text-navy outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
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
                  {filtered.map((student) => {
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
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-12">
                        <EmptyState
                          icon={GraduationCap}
                          title={search || managerFilter ? "Nəticə tapılmadı" : "Hələ tələbə yoxdur"}
                          description={
                            search || managerFilter
                              ? "Filtrləri dəyişdirin və ya axtarış sorğusunu yenidən cəhd edin."
                              : "Yeni tələbə hesabı yaratmaq üçün düymədən istifadə edin."
                          }
                          action={
                            !search && !managerFilter ? (
                              <Button onClick={() => setModalOpen(true)}>Yeni tələbə</Button>
                            ) : undefined
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

      <CreateStudentModal open={modalOpen} onClose={() => setModalOpen(false)} managers={managers} />
    </div>
  );
}
