"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth-context";
import { logActivity } from "@/lib/activity-log";
import { COUNTRIES } from "@/lib/constants";
import { UniversityDoc } from "@/types";

const EMPTY_FORM = {
  name: "",
  country: COUNTRIES[0],
  city: "",
  website: "",
  ieltsMin: "",
  tuitionPerYear: "",
  specialties: "",
};

interface CreateUniversityModalProps {
  open: boolean;
  onClose: () => void;
  editing?: UniversityDoc | null;
}

export function CreateUniversityModal({
  open,
  onClose,
  editing,
}: CreateUniversityModalProps) {
  const [form, setForm] = useState(() =>
    editing
      ? {
          name: editing.name,
          country: editing.country,
          city: editing.city,
          website: editing.website ?? "",
          ieltsMin: editing.ieltsMin?.toString() ?? "",
          tuitionPerYear: editing.tuitionPerYear?.toString() ?? "",
          specialties: editing.specialties?.join(", ") ?? "",
        }
      : EMPTY_FORM
  );
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const { user, profile } = useAuth();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    const data = {
      name: form.name,
      country: form.country,
      city: form.city,
      website: form.website || null,
      ieltsMin: form.ieltsMin ? parseFloat(form.ieltsMin) : null,
      tuitionPerYear: form.tuitionPerYear
        ? parseInt(form.tuitionPerYear, 10)
        : null,
      specialties: form.specialties
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editing) {
        await updateDoc(doc(db, "universities", editing.id), data);
        await logActivity({
          action: "update",
          entity: "university",
          entityId: editing.id,
          entityName: form.name,
          userId: user?.uid ?? "",
          userName: profile?.name ?? "",
        });
        showToast("Universitet yeniləndi");
      } else {
        const ref = await addDoc(collection(db, "universities"), {
          ...data,
          createdAt: serverTimestamp(),
        });
        await logActivity({
          action: "create",
          entity: "university",
          entityId: ref.id,
          entityName: form.name,
          userId: user?.uid ?? "",
          userName: profile?.name ?? "",
        });
        showToast("Universitet əlavə edildi");
      }
      setForm(EMPTY_FORM);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Universiteti redaktə et" : "Yeni universitet"}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Ad"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="sm:col-span-2"
        />
        <Select
          label="Ölkə"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
        >
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Input
          label="Şəhər"
          required
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
        <Input
          label="Veb-sayt"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
        />
        <Input
          label="IELTS minimum"
          type="number"
          step="0.5"
          min="0"
          max="9"
          value={form.ieltsMin}
          onChange={(e) => setForm({ ...form, ieltsMin: e.target.value })}
        />
        <Input
          label="İllik təhsil haqqı (€)"
          type="number"
          value={form.tuitionPerYear}
          onChange={(e) =>
            setForm({ ...form, tuitionPerYear: e.target.value })
          }
        />
        <Input
          label="İxtisaslar (vergüllə)"
          value={form.specialties}
          onChange={(e) => setForm({ ...form, specialties: e.target.value })}
          className="sm:col-span-2"
        />

        <div className="sm:col-span-2">
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting
              ? "Saxlanılır..."
              : editing
                ? "Yadda saxla"
                : "Əlavə et"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
