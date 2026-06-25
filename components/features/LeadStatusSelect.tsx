"use client";

import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Select } from "@/components/ui/Input";
import { LEAD_STATUS_LABELS, LEAD_STATUS_ORDER } from "@/lib/constants";
import { LeadStatus } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth-context";
import { logActivity } from "@/lib/activity-log";

interface LeadStatusSelectProps {
  leadId: string;
  status: LeadStatus;
  leadName?: string;
}

export function LeadStatusSelect({ leadId, status, leadName }: LeadStatusSelectProps) {
  const { showToast } = useToast();
  const { user, profile } = useAuth();

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value as LeadStatus;
    const oldStatus = status;
    await updateDoc(doc(db, "leads", leadId), {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
    await logActivity({
      action: "status_change",
      entity: "lead",
      entityId: leadId,
      entityName: leadName ?? leadId,
      userId: user?.uid ?? "",
      userName: profile?.name ?? "",
      oldValue: LEAD_STATUS_LABELS[oldStatus].az,
      newValue: LEAD_STATUS_LABELS[newStatus].az,
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
