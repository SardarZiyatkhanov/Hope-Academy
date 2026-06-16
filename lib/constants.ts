import { ApplicationDoc, ApplicationStatus, DocumentType, LeadLevel, LeadStatus } from "@/types";

export const NAV_LINKS = [
  { href: "/", label: "Ana səhifə" },
  { href: "/about", label: "Haqqımızda" },
  { href: "/services", label: "Xidmətlər" },
  { href: "/countries", label: "Ölkələr" },
  { href: "/blog", label: "Blog" },
  { href: "/success-stories", label: "Uğur hekayələri" },
  { href: "/contact", label: "Əlaqə" },
];

export const STATUS_LABELS: Record<
  ApplicationStatus,
  { az: string; color: string }
> = {
  preparation: { az: "Hazırlıq", color: "gray" },
  docs_ready: { az: "Sənədlər hazırdır", color: "blue" },
  submitted: { az: "Universitetə göndərildi", color: "purple" },
  reviewing: { az: "Baxılır", color: "amber" },
  accepted: { az: "Qəbul edildi ✓", color: "green" },
  rejected: { az: "İmtina", color: "red" },
  visa: { az: "Viza mərhələsi", color: "orange" },
  departed: { az: "Yola düşüb ✈", color: "teal" },
};

export const STATUS_STEP: Record<ApplicationStatus, number> = {
  preparation: 1,
  docs_ready: 2,
  submitted: 3,
  reviewing: 3,
  accepted: 4,
  rejected: 4,
  visa: 4,
  departed: 5,
};

export const APPLICATION_STATUS_ORDER: ApplicationStatus[] = [
  "preparation",
  "docs_ready",
  "submitted",
  "reviewing",
  "accepted",
  "rejected",
  "visa",
  "departed",
];

export const LEAD_STATUS_LABELS: Record<
  LeadStatus,
  { az: string; color: string }
> = {
  new: { az: "Yeni", color: "blue" },
  processing: { az: "İşlənir", color: "amber" },
  contacted: { az: "Əlaqə saxlanıldı", color: "purple" },
  consultation: { az: "Konsultasiya", color: "teal" },
  became_student: { az: "Tələbə oldu", color: "green" },
  rejected: { az: "İmtina", color: "red" },
};

export const LEAD_STATUS_ORDER: LeadStatus[] = [
  "new",
  "processing",
  "contacted",
  "consultation",
  "became_student",
  "rejected",
];

export const LEAD_LEVEL_LABELS: Record<LeadLevel, string> = {
  bachelor: "Bakalavr",
  master: "Magistr",
  phd: "Doktorantura (PhD)",
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  passport: "Pasport",
  diploma: "Diplom",
  transcript: "Transkript",
  motivation: "Motivasiya məktubu",
  ielts: "IELTS sertifikatı",
  photo: "Şəkil",
  recommendation: "Tövsiyə məktubu",
  acceptance: "Qəbul məktubu",
  other: "Digər",
};

// Baku coordinates [lng, lat]
export const BAKU_COORDS: [number, number] = [49.9, 40.4];

export interface WorldMapRoute {
  to: [number, number];
  label: string;
  progress: number;
}

export const DEFAULT_WORLD_ROUTES: WorldMapRoute[] = [
  { to: [13.4, 52.5], label: "Berlin", progress: 0.45 },
  { to: [4.9, 52.3], label: "Amsterdam", progress: 0.9 },
  { to: [16.4, 48.2], label: "Vienna", progress: 0.3 },
  { to: [2.3, 48.9], label: "Paris", progress: 0.6 },
  { to: [18.6, 54.4], label: "Warsaw", progress: 0.5 },
  { to: [4.5, 50.8], label: "Brussels", progress: 0.8 },
  { to: [14.4, 50.1], label: "Prague", progress: 0.15 },
  { to: [19.0, 47.5], label: "Budapest", progress: 0.65 },
  { to: [12.5, 41.9], label: "Rome", progress: 0.4 },
  { to: [-0.1, 51.5], label: "London", progress: 0.75 },
  { to: [29.0, 41.0], label: "Istanbul", progress: 0.25 },
  { to: [55.3, 25.2], label: "Dubai", progress: 0.55 },
  { to: [31.2, 30.0], label: "Cairo", progress: 0.85 },
  { to: [-74.0, 40.7], label: "New York", progress: 0.2 },
  { to: [-79.4, 43.7], label: "Toronto", progress: 0.7 },
];

// City coordinates [lng, lat], used to draw routes for applications
export const CITY_COORDS: Record<string, [number, number]> = {
  Berlin: [13.4, 52.5],
  Amsterdam: [4.9, 52.3],
  Vienna: [16.4, 48.2],
  Paris: [2.3, 48.9],
  Warsaw: [18.6, 54.4],
  Brussels: [4.5, 50.8],
  Delft: [4.36, 52.01],
  Praga: [14.4, 50.1],
  Prague: [14.4, 50.1],
};

// Maps university name -> city, so an application can be drawn on the map
export const UNIVERSITY_CITY: Record<string, string> = {
  "TU Berlin": "Berlin",
  "TU Delft": "Delft",
  "Charles University": "Praga",
};

export function getRouteForApplication(application: ApplicationDoc): WorldMapRoute | null {
  const city = UNIVERSITY_CITY[application.universityName];
  const coords = city ? CITY_COORDS[city] : undefined;
  if (!coords) return null;
  return { to: coords, label: city, progress: 0.5 };
}
