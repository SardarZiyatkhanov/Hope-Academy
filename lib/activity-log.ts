import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { ActivityAction, ActivityEntity } from "@/types";

interface LogParams {
  action: ActivityAction;
  entity: ActivityEntity;
  entityId: string;
  entityName: string;
  userId: string;
  userName: string;
  details?: string;
  oldValue?: string;
  newValue?: string;
}

export async function logActivity(params: LogParams) {
  try {
    await addDoc(collection(db, "activityLogs"), {
      ...params,
      createdAt: serverTimestamp(),
    });
  } catch {
    // Activity logging should never block the main operation
  }
}
