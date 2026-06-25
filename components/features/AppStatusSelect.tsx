"use client";

import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Select } from "@/components/ui/Input";
import { APPLICATION_STATUS_ORDER, STATUS_LABELS } from "@/lib/constants";
import { ApplicationStatus } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth-context";
import { logActivity } from "@/lib/activity-log";

interface AppStatusSelectProps {
  applicationId: string;
  status: ApplicationStatus;
  applicationName?: string;
}

export function AppStatusSelect({ applicationId, status, applicationName }: AppStatusSelectProps) {
  const { showToast } = useToast();
  const { user, profile } = useAuth();

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value as ApplicationStatus;
    const oldStatus = status;
    await updateDoc(doc(db, "applications", applicationId), {
      status: newStatus,
      updatedAt: serverTimestamp(),
      statusHistory: arrayUnion({
        status: newStatus,
        changedAt: Timestamp.now(),
        changedBy: user?.uid ?? "",
      }),
    });
    await logActivity({
      action: "status_change",
      entity: "application",
      entityId: applicationId,
      entityName: applicationName ?? applicationId,
      userId: user?.uid ?? "",
      userName: profile?.name ?? "",
      oldValue: STATUS_LABELS[oldStatus].az,
      newValue: STATUS_LABELS[newStatus].az,
    });
    showToast("Status yeniləndi · Tələbə məlumatlandırıldı");
  };

  return (
    <Select value={status} onChange={handleChange} className="w-auto">
      {APPLICATION_STATUS_ORDER.map((value) => (
        <option key={value} value={value}>
          {STATUS_LABELS[value].az}
        </option>
      ))}
    </Select>
  );
}
