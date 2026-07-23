"use client";

import { FormEvent, useEffect, useState } from "react";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { AppStatusSelect } from "@/components/features/AppStatusSelect";
import { Timeline } from "@/components/features/Timeline";
import { DocumentList } from "@/components/features/DocumentList";
import { ChatThread } from "@/components/features/ChatThread";
import { AddApplicationModal } from "@/components/features/AddApplicationModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { ApplicationDoc, DocumentDoc, UniversityDoc, UserDoc } from "@/types";
import {
  GraduationCap,
  FileText,
  MessageSquare,
  User,
  Plus,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Save,
} from "lucide-react";

const TABS = [
  { key: "Ərizələr", icon: GraduationCap },
  { key: "Sənədlər", icon: FileText },
  { key: "Mesajlar", icon: MessageSquare },
  { key: "Məlumatlar", icon: User },
] as const;

type Tab = (typeof TABS)[number]["key"];

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  const studentId = params.id;
  const { user } = useAuth();
  const { showToast } = useToast();

  const [student, setStudent] = useState<UserDoc | null>(null);
  const [applications, setApplications] = useState<ApplicationDoc[]>([]);
  const [documents, setDocuments] = useState<DocumentDoc[]>([]);
  const [universities, setUniversities] = useState<UniversityDoc[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("Ərizələr");
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return onSnapshot(doc(db, "users", studentId), (snap) => {
      if (snap.exists()) {
        const data = { uid: snap.id, ...snap.data() } as UserDoc;
        setStudent(data);
        setName(data.name);
        setPhone(data.phone ?? "");
      }
    });
  }, [studentId]);

  useEffect(() => {
    const q = query(collection(db, "applications"), where("studentId", "==", studentId));
    return onSnapshot(q, (snap) => {
      setApplications(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ApplicationDoc)));
    });
  }, [studentId]);

  useEffect(() => {
    const q = query(collection(db, "documents"), where("studentId", "==", studentId));
    return onSnapshot(q, (snap) => {
      setDocuments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as DocumentDoc)));
    });
  }, [studentId]);

  useEffect(() => {
    return onSnapshot(collection(db, "universities"), (snap) => {
      setUniversities(snap.docs.map((d) => ({ id: d.id, ...d.data() } as UniversityDoc)));
    });
  }, []);

  const handleProfileSave = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    await updateDoc(doc(db, "users", studentId), { name, phone });
    showToast("Məlumatlar yeniləndi");
    setSaving(false);
  };

  if (!student) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Profile header */}
      <div className="flex items-center gap-5 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <Avatar name={student.name} className="h-14 w-14 text-xl" />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-navy">{student.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <Mail size={13} />
              {student.email}
            </span>
            {student.phone && (
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Phone size={13} />
                {student.phone}
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Ərizə</p>
          <p className="text-2xl font-bold text-navy">{applications.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-gray-100 bg-white p-1.5 shadow-sm">
        {TABS.map(({ key, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
              activeTab === key
                ? "bg-navy text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100 hover:text-navy"
            )}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{key}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Ərizələr" && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
              <Plus size={16} />
              Yeni ərizə əlavə et
            </Button>
          </div>

          {applications.length === 0 && (
            <div className="rounded-xl border border-gray-100 bg-white py-12 shadow-sm">
              <div className="text-center">
                <GraduationCap size={36} className="mx-auto mb-3 text-gray-200" />
                <p className="font-medium text-gray-400">Hələ ərizə yoxdur</p>
              </div>
            </div>
          )}

          {applications.map((application) => (
            <div
              key={application.id}
              className="rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="font-semibold text-navy">{application.universityName}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {application.program} · {application.universityCountry}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <AppStatusSelect applicationId={application.id} status={application.status} />
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId((cur) => (cur === application.id ? null : application.id))
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:border-navy hover:text-navy"
                  >
                    {expandedId === application.id ? (
                      <ChevronUp size={15} />
                    ) : (
                      <ChevronDown size={15} />
                    )}
                  </button>
                </div>
              </div>
              {expandedId === application.id && (
                <div className="border-t border-gray-100 p-5">
                  <Timeline application={application} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "Sənədlər" && (
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <DocumentList studentId={studentId} documents={documents} uploadedBy={user?.uid ?? ""} />
        </div>
      )}

      {activeTab === "Mesajlar" && (
        <div className="flex h-[520px] flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <ChatThread studentId={studentId} currentUserId={user?.uid ?? ""} currentUserRole="manager" />
        </div>
      )}

      {activeTab === "Məlumatlar" && (
        <form
          onSubmit={handleProfileSave}
          className="flex max-w-md flex-col gap-5 rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-navy">Profil məlumatları</h2>
          <Input label="Ad Soyad" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Email" value={student.email} disabled />
          <Button type="submit" disabled={saving} className="flex items-center gap-2 self-start">
            <Save size={15} />
            {saving ? "Saxlanılır..." : "Yadda saxla"}
          </Button>
        </form>
      )}

      <AddApplicationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        studentId={studentId}
        universities={universities}
      />
    </div>
  );
}
