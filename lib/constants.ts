import { ApplicationDoc, ApplicationStatus, DocumentType, LeadLevel, LeadStatus } from "@/types";

// ─── Contact info (update once, used everywhere) ───
export const CONTACT = {
  phone: "+994 51 940 43 03",
  phoneRaw: "+994519404303",
  email: "info@hopeacademy.az",
  address: "Nizami küçəsi 203",
  city: "Bakı, Azərbaycan",
  whatsapp: "994519404303",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Ana səhifə" },
  { href: "/about", label: "Haqqımızda" },
  { href: "/services", label: "Xidmətlər" },
  { href: "/contact", label: "Əlaqə" },
];

export const RESOURCE_LINKS = [
  { href: "/countries", label: "Ölkələr" },
  { href: "/blog", label: "Blog" },
  { href: "/success-stories", label: "Uğur hekayələri" },
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
  München: [11.58, 48.14],
  Heidelberg: [8.69, 49.4],
  Aachen: [6.08, 50.78],
  Amsterdam: [4.9, 52.3],
  Delft: [4.36, 52.01],
  Groningen: [6.57, 53.22],
  Eindhoven: [5.47, 51.44],
  Prague: [14.4, 50.1],
  Praga: [14.4, 50.1],
  Brno: [16.6, 49.2],
  Brussels: [4.5, 50.8],
  Leuven: [4.7, 50.88],
  Ghent: [3.72, 51.05],
  Paris: [2.3, 48.9],
  Lyon: [4.83, 45.76],
  Strasbourg: [7.75, 48.58],
  Warsaw: [21.01, 52.23],
  Kraków: [19.94, 50.06],
  Wrocław: [17.04, 51.1],
  Vienna: [16.4, 48.2],
  Graz: [15.44, 47.07],
  Linz: [14.29, 48.31],
  Budapest: [19.0, 47.5],
  Rome: [12.5, 41.9],
  London: [-0.1, 51.5],
  Istanbul: [29.0, 41.0],
  Dubai: [55.3, 25.2],
};

// Maps university name -> city, so an application can be drawn on the map
export const UNIVERSITY_CITY: Record<string, string> = {
  // Germany
  "TU Berlin": "Berlin",
  "Humboldt Universität Berlin": "Berlin",
  "FU Berlin": "Berlin",
  "TU München": "München",
  "LMU München": "München",
  "Heidelberg University": "Heidelberg",
  "RWTH Aachen": "Aachen",
  // Netherlands
  "TU Delft": "Delft",
  "University of Amsterdam": "Amsterdam",
  "VU Amsterdam": "Amsterdam",
  "University of Groningen": "Groningen",
  "TU Eindhoven": "Eindhoven",
  // Czech Republic
  "Charles University": "Prague",
  "Czech Technical University": "Prague",
  "Masaryk University": "Brno",
  // Belgium
  "KU Leuven": "Leuven",
  "Ghent University": "Ghent",
  "Université libre de Bruxelles": "Brussels",
  "Vrije Universiteit Brussel": "Brussels",
  // France
  "Sorbonne University": "Paris",
  "Sciences Po": "Paris",
  "Université de Lyon": "Lyon",
  "Université de Strasbourg": "Strasbourg",
  // Poland
  "University of Warsaw": "Warsaw",
  "Jagiellonian University": "Kraków",
  "Wrocław University": "Wrocław",
  // Austria
  "University of Vienna": "Vienna",
  "TU Wien": "Vienna",
  "University of Graz": "Graz",
  "JKU Linz": "Linz",
};

export function getRouteForApplication(application: ApplicationDoc): WorldMapRoute | null {
  const city = UNIVERSITY_CITY[application.universityName];
  const coords = city ? CITY_COORDS[city] : undefined;
  if (!coords) return null;
  return { to: coords, label: city, progress: 0.5 };
}
