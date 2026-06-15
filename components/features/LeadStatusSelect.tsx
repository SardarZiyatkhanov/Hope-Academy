"use client";

import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Select } from "@/components/ui/Input";
import { LEAD_STATUS_LABELS, LEAD_STATUS_ORDER } from "@/lib/constants";
import { LeadStatus } from "@/types";
import { useToast } from "@/components/ui/Toast";

interface LeadStatusSelectProps {
  leadId: string;
  status: LeadStatus;
}

export function LeadStatusSelect({ leadId, status }: LeadStatusSelectProps) {
  const { showToast } = useToast();

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value as LeadStatus;
    await updateDoc(doc(db, "leads", leadId), {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
    showToast("Status yeniləndi");
  };

  return (
    <Select value={status} onChange={handleChange} className="w-auto">
      {LEAD_STATUS_ORDER.map((value) => (
        <option key={value} value={value}>
          {LEAD_STATUS_LABELS[value].az}
        </option>
      ))}
    </Select>
  );
}
