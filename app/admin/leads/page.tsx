"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { exportToCSV } from "@/lib/export-csv";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { LeadStatusSelect } from "@/components/features/LeadStatusSelect";
import { CreateLeadModal } from "@/components/features/CreateLeadModal";
import { LEAD_LEVEL_LABELS, LEAD_STATUS_LABELS, LEAD_STATUS_ORDER } from "@/lib/constants";
import { LeadDoc, UserDoc } from "@/types";
import { UserPlus, TrendingUp, Download, Search, Filter } from "lucide-react";
import { cn } from "@/lib/cn";

const LEVEL_STYLE: Record<string, string> = {
  hot: "bg-red-50 text-red-700 ring-1 ring-red-200",
  warm: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  cold: "bg-blue-50 text-blue-600 ring-1 ring-blue-200",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadDoc[]>([]);
  const [managers, setManagers] = useState<UserDoc[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [managerFilter, setManagerFilter] = useState("");

  useEffect(() => {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setLeads(snap.docs.map((d) => ({ id: d.id, ...d.data() } as LeadDoc)));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "manager"));
    return onSnapshot(q, (snap) => {
      setManagers(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserDoc)));
    });
  }, []);

  const managerNames: Record<string, string> = {};
  managers.forEach((m) => { managerNames[m.uid] = m.name; });

  const filtered = useMemo(() => {
    let list = leads;
    if (statusFilter) list = list.filter((l) => l.status === statusFilter);
    if (levelFilter) list = list.filter((l) => l.level === levelFilter);
    if (managerFilter) list = list.filter((l) => l.assignedTo === managerFilter);
    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(
        (l) =>
          `${l.name} ${l.surname}`.toLowerCase().includes(term) ||
          l.phone.includes(term) ||
          l.email.toLowerCase().includes(term)
      );
    }
    return list;
  }, [leads, search, statusFilter, levelFilter, managerFilter]);

  const handleExport = () => {
    exportToCSV(
      filtered.map((l) => ({
        Ad: l.name,
        Soyad: l.surname,
        Telefon: l.phone,
        Email: l.email,
        Ölkə: l.country,
        Səviyyə: LEAD_LEVEL_LABELS[l.level],
        İxtisas: l.specialty,
        Status: LEAD_STATUS_LABELS[l.status].az,
        Menecer: l.assignedTo ? managerNames[l.assignedTo] ?? "" : "",
        Tarix: l.createdAt?.toDate?.()?.toLocaleDateString("az-AZ") ?? "",
      })),
      "lidler"
    );
  };

  const activeFilters = [statusFilter, levelFilter, managerFilter].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-7">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy">Lidlər</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Cəmi <span className="font-semibold text-navy">{leads.length}</span> potensial tələbə
            {filtered.length !== leads.length && (
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
            Yeni lid
          </Button>
        </div>
      </div>

      {/* Table card */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
              <TrendingUp size={14} className="text-navy" />
            </span>
            <h2 className="text-sm font-semibold text-navy">Bütün lidlər</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Filter size={13} />
              {activeFilters > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue px-1 text-[10px] font-bold text-white">
                  {activeFilters}
                </span>
              )}
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-navy outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Bütün statuslar</option>
              {LEAD_STATUS_ORDER.map((s) => (
                <option key={s} value={s}>{LEAD_STATUS_LABELS[s].az}</option>
              ))}
            </select>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-navy outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Bütün səviyyələr</option>
              {Object.entries(LEAD_LEVEL_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
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
                placeholder="Ad, telefon, email..."
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
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Telefon</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Ölkə</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Səviyyə</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Status</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Menecer</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Tarix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <TableSkeleton cols={7} />
              ) : (
                <>
                  {filtered.map((lead) => (
                    <tr key={lead.id} className="group transition-colors hover:bg-blue-50/30">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={`${lead.name} ${lead.surname}`}
                            className="h-8 w-8 shrink-0 text-xs"
                          />
                          <span className="font-semibold text-navy">
                            {lead.name} {lead.surname}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">{lead.phone}</td>
                      <td className="px-4 py-3.5 text-gray-600">{lead.country}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            LEVEL_STYLE[lead.level] ?? "bg-gray-100 text-gray-600"
                          )}
                        >
                          {LEAD_LEVEL_LABELS[lead.level]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <LeadStatusSelect
                          leadId={lead.id}
                          status={lead.status}
                          leadName={`${lead.name} ${lead.surname}`}
                        />
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {lead.assignedTo ? managerNames[lead.assignedTo] ?? "—" : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-gray-400 text-xs">
                        {lead.createdAt?.toDate
                          ? lead.createdAt.toDate().toLocaleDateString("az-AZ")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-12">
                        <EmptyState
                          icon={UserPlus}
                          title={search || activeFilters ? "Nəticə tapılmadı" : "Hələ lid yoxdur"}
                          description={
                            search || activeFilters
                              ? "Filtrləri dəyişdirin və ya axtarış sorğusunu yenidən cəhd edin."
                              : "Yeni potensial tələbə əlavə etmək üçün düymədən istifadə edin."
                          }
                          action={
                            !search && !activeFilters ? (
                              <Button onClick={() => setModalOpen(true)}>Yeni lid</Button>
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

      <CreateLeadModal open={modalOpen} onClose={() => setModalOpen(false)} managers={managers} />
    </div>
  );
}
