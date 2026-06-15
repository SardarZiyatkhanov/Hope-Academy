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
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { ApplicationDoc, DocumentDoc, UniversityDoc, UserDoc } from "@/types";

const TABS = ["Ərizələr", "Sənədlər", "Mesajlar", "Məlumatlar"] as const;
type Tab = (typeof TABS)[number];

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

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", studentId), (snap) => {
      if (snap.exists()) {
        const data = { uid: snap.id, ...snap.data() } as UserDoc;
        setStudent(data);
        setName(data.name);
        setPhone(data.phone ?? "");
      }
    });
    return unsubscribe;
  }, [studentId]);

  useEffect(() => {
    const applicationsQuery = query(
      collection(db, "applications"),
      where("studentId", "==", studentId)
    );
    const unsubscribe = onSnapshot(applicationsQuery, (snapshot) => {
      setApplications(
        snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as ApplicationDoc))
      );
    });
    return unsubscribe;
  }, [studentId]);

  useEffect(() => {
    const documentsQuery = query(collection(db, "documents"), where("studentId", "==", studentId));
    const unsubscribe = onSnapshot(documentsQuery, (snapshot) => {
      setDocuments(
        snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as DocumentDoc))
      );
    });
    return unsubscribe;
  }, [studentId]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "universities"), (snapshot) => {
      setUniversities(
        snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as UniversityDoc))
      );
    });
    return unsubscribe;
  }, []);

  const handleProfileSave = async (event: FormEvent) => {
    event.preventDefault();
    await updateDoc(doc(db, "users", studentId), { name, phone });
    showToast("Məlumatlar yeniləndi");
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
      <div>
        <h1 className="text-xl font-semibold text-navy">{student.name}</h1>
        <p className="text-sm text-gray-500">{student.email}</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab
                ? "border-blue text-blue"
                : "border-transparent text-gray-500 hover:text-navy"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Ərizələr" && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button onClick={() => setModalOpen(true)}>Yeni ərizə əlavə et</Button>
          </div>
          {applications.length === 0 && (
            <p className="text-sm text-gray-400">Hələ ərizə yoxdur</p>
          )}
          {applications.map((application) => (
            <div key={application.id} className="rounded-card bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-navy">{application.universityName}</p>
                  <p className="text-xs text-gray-500">
                    {application.program} · {application.universityCountry}
                  </p>
                </div>
                <AppStatusSelect applicationId={application.id} status={application.status} />
              </div>
              <button
                type="button"
                onClick={() =>
                  setExpandedId((current) => (current === application.id ? null : application.id))
                }
                className="mt-3 text-xs font-medium text-blue"
              >
                {expandedId === application.id ? "Bağla" : "Ətraflı"}
              </button>
              {expandedId === application.id && (
                <div className="mt-4">
                  <Timeline application={application} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "Sənədlər" && (
        <div className="rounded-card bg-white p-4 sm:p-6">
          <DocumentList studentId={studentId} documents={documents} uploadedBy={user?.uid ?? ""} />
        </div>
      )}

      {activeTab === "Mesajlar" && (
        <div className="flex h-[480px] flex-col overflow-hidden rounded-card bg-white">
          <ChatThread studentId={studentId} currentUserRole="manager" />
        </div>
      )}

      {activeTab === "Məlumatlar" && (
        <form
          onSubmit={handleProfileSave}
          className="flex max-w-md flex-col gap-4 rounded-card bg-white p-4 sm:p-6"
        >
          <Input label="Ad Soyad" value={name} onChange={(event) => setName(event.target.value)} />
          <Input label="Telefon" value={phone} onChange={(event) => setPhone(event.target.value)} />
          <Input label="Email" value={student.email} disabled />
          <Button type="submit">Yadda saxla</Button>
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
