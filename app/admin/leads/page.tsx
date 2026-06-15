"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { LeadStatusSelect } from "@/components/features/LeadStatusSelect";
import { CreateLeadModal } from "@/components/features/CreateLeadModal";
import { LEAD_LEVEL_LABELS } from "@/lib/constants";
import { LeadDoc, UserDoc } from "@/types";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadDoc[]>([]);
  const [managers, setManagers] = useState<UserDoc[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const leadsQuery = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(leadsQuery, (snapshot) => {
      setLeads(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as LeadDoc)));
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

  const managerNames: Record<string, string> = {};
  managers.forEach((manager) => {
    managerNames[manager.uid] = manager.name;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-navy">Lidlər</h1>
        <Button onClick={() => setModalOpen(true)}>Yeni lid</Button>
      </div>

      <div className="overflow-x-auto rounded-card bg-white p-4 sm:p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
              <th className="px-3 py-2">Ad</th>
              <th className="px-3 py-2">Telefon</th>
              <th className="px-3 py-2">Ölkə</th>
              <th className="px-3 py-2">Səviyyə</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Menecer</th>
              <th className="px-3 py-2">Tarix</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-gray-50">
                <td className="px-3 py-3 font-medium text-navy">
                  {lead.name} {lead.surname}
                </td>
                <td className="px-3 py-3 text-gray-600">{lead.phone}</td>
                <td className="px-3 py-3 text-gray-600">{lead.country}</td>
                <td className="px-3 py-3 text-gray-600">{LEAD_LEVEL_LABELS[lead.level]}</td>
                <td className="px-3 py-3">
                  <LeadStatusSelect leadId={lead.id} status={lead.status} />
                </td>
                <td className="px-3 py-3 text-gray-600">
                  {lead.assignedTo ? managerNames[lead.assignedTo] ?? "—" : "—"}
                </td>
                <td className="px-3 py-3 text-gray-600">
                  {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString("az-AZ") : "—"}
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-gray-400">
                  Hələ lid yoxdur
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateLeadModal open={modalOpen} onClose={() => setModalOpen(false)} managers={managers} />
    </div>
  );
}
