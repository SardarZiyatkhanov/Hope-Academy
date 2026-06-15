"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth-context";
import { UniversityDoc } from "@/types";

interface AddApplicationModalProps {
  open: boolean;
  onClose: () => void;
  studentId: string;
  universities: UniversityDoc[];
}

export function AddApplicationModal({
  open,
  onClose,
  studentId,
  universities,
}: AddApplicationModalProps) {
  const [universityId, setUniversityId] = useState("");
  const [program, setProgram] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const university = universities.find((item) => item.id === universityId);
    if (!university) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, "applications"), {
        studentId,
        universityId: university.id,
        universityName: university.name,
        universityCountry: university.country,
        program,
        status: "preparation",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        statusHistory: [
          { status: "preparation", changedAt: Timestamp.now(), changedBy: user?.uid ?? "" },
        ],
      });
      showToast("Ərizə əlavə edildi");
      setUniversityId("");
      setProgram("");
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Yeni ərizə əlavə et">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select
          label="Universitet"
          required
          value={universityId}
          onChange={(event) => setUniversityId(event.target.value)}
        >
          <option value="">Seçin</option>
          {universities.map((university) => (
            <option key={university.id} value={university.id}>
              {university.name} — {university.country}
            </option>
          ))}
        </Select>
        <Input
          label="Proqram"
          required
          value={program}
          onChange={(event) => setProgram(event.target.value)}
          placeholder="M.Sc. Computer Science"
        />
        <Button type="submit" disabled={submitting || !universityId} className="w-full">
          {submitting ? "Əlavə edilir..." : "Əlavə et"}
        </Button>
      </form>
    </Modal>
  );
}
