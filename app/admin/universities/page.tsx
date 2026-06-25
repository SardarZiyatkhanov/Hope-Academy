"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { logActivity } from "@/lib/activity-log";
import { exportToCSV } from "@/lib/export-csv";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { CreateUniversityModal } from "@/components/features/CreateUniversityModal";
import { useToast } from "@/components/ui/Toast";
import { UniversityDoc } from "@/types";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Download,
  Search,
  Globe,
} from "lucide-react";

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState<UniversityDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UniversityDoc | null>(null);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const { showToast } = useToast();
  const { user, profile } = useAuth();

  useEffect(() => {
    return onSnapshot(collection(db, "universities"), (snap) => {
      setUniversities(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as UniversityDoc))
      );
      setLoading(false);
    });
  }, []);

  const countries = useMemo(
    () => Array.from(new Set(universities.map((u) => u.country))).sort(),
    [universities]
  );

  const filtered = useMemo(() => {
    let list = universities;
    if (countryFilter) {
      list = list.filter((u) => u.country === countryFilter);
    }
    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.city.toLowerCase().includes(term)
      );
    }
    return list;
  }, [universities, search, countryFilter]);

  const handleDelete = async (uni: UniversityDoc) => {
    if (
      !confirm(`"${uni.name}" universitetini silmək istədiyinizə əminsiniz?`)
    )
      return;
    await deleteDoc(doc(db, "universities", uni.id));
    await logActivity({
      action: "delete",
      entity: "university",
      entityId: uni.id,
      entityName: uni.name,
      userId: user?.uid ?? "",
      userName: profile?.name ?? "",
    });
    showToast("Universitet silindi");
  };

  const handleEdit = (uni: UniversityDoc) => {
    setEditing(uni);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleExport = () => {
    exportToCSV(
      universities.map((u) => ({
        Ad: u.name,
        Ölkə: u.country,
        Şəhər: u.city,
        "IELTS min": u.ieltsMin ?? "",
        "Təhsil haqqı (€)": u.tuitionPerYear ?? "",
        İxtisaslar: u.specialties?.join("; ") ?? "",
        Vebsayt: u.website ?? "",
      })),
      "universitetler"
    );
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy">Universitetlər</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Cəmi{" "}
            <span className="font-semibold text-navy">
              {universities.length}
            </span>{" "}
            universitet
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
            <Plus size={16} />
            Yeni universitet
          </Button>
        </div>
      </div>

      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
              <Building2 size={14} className="text-navy" />
            </span>
            <h2 className="text-sm font-semibold text-navy">
              Bütün universitetlər
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-navy outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Bütün ölkələr</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
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
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/70 text-left">
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Universitet
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Ölkə / Şəhər
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  IELTS
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Təhsil haqqı
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  İxtisaslar
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
                  {filtered.map((uni) => (
                    <tr
                      key={uni.id}
                      className="group transition-colors hover:bg-blue-50/30"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Globe size={15} />
                          </span>
                          <div>
                            <p className="font-semibold text-navy">
                              {uni.name}
                            </p>
                            {uni.website && (
                              <p className="text-xs text-gray-400">
                                {uni.website}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {uni.country}, {uni.city}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {uni.ieltsMin ?? "—"}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {uni.tuitionPerYear
                          ? `€${uni.tuitionPerYear.toLocaleString()}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-violet-50 px-2 text-xs font-semibold text-violet-700">
                          {uni.specialties?.length ?? 0}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            onClick={() => handleEdit(uni)}
                            className="h-8 gap-1.5 px-3 text-xs font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Pencil size={12} />
                            Redaktə
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleDelete(uni)}
                            className="h-8 gap-1.5 px-3 text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-12">
                        <EmptyState
                          icon={Building2}
                          title="Universitet tapılmadı"
                          description="Yeni universitet əlavə etmək üçün düymədən istifadə edin."
                          action={
                            <Button onClick={() => setModalOpen(true)}>
                              Yeni universitet
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

      <CreateUniversityModal
        open={modalOpen}
        onClose={handleCloseModal}
        editing={editing}
      />
    </div>
  );
}
