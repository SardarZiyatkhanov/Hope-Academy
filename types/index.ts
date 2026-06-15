import { Timestamp } from "firebase/firestore";

export type UserRole = "superadmin" | "manager" | "student";

export interface UserDoc {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Timestamp;
  // students only
  managerId?: string;
  phone?: string;
  // managers only
  assignedStudents?: string[];
}

export type LeadLevel = "bachelor" | "master" | "phd";

export type LeadStatus =
  | "new"
  | "processing"
  | "contacted"
  | "consultation"
  | "became_student"
  | "rejected";

export interface LeadDoc {
  id: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  country: string;
  level: LeadLevel;
  specialty: string;
  city?: string;
  status: LeadStatus;
  assignedTo?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  notes?: string;
}

export interface UniversityDoc {
  id: string;
  name: string;
  country: string;
  city: string;
  logoUrl?: string;
  website?: string;
  ieltsMin?: number;
  tuitionPerYear?: number;
  specialties: string[];
  createdAt: Timestamp;
}

export type ApplicationStatus =
  | "preparation"
  | "docs_ready"
  | "submitted"
  | "reviewing"
  | "accepted"
  | "rejected"
  | "visa"
  | "departed";

export interface ApplicationStatusHistoryEntry {
  status: string;
  changedAt: Timestamp;
  changedBy: string;
}

export interface ApplicationDoc {
  id: string;
  studentId: string;
  universityId: string;
  universityName: string;
  universityCountry: string;
  program: string;
  status: ApplicationStatus;
  notes?: string;
  internalNotes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  statusHistory: ApplicationStatusHistoryEntry[];
}

export type DocumentType =
  | "passport"
  | "diploma"
  | "transcript"
  | "motivation"
  | "ielts"
  | "photo"
  | "recommendation"
  | "acceptance"
  | "other";

export interface DocumentDoc {
  id: string;
  studentId: string;
  type: DocumentType;
  name: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Timestamp;
}

export interface MessageDoc {
  id: string;
  senderId: string;
  senderRole: "student" | "manager";
  text?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: Timestamp;
  read: boolean;
}
