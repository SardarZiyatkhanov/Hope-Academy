"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth-context";
import { logActivity } from "@/lib/activity-log";
import { COUNTRIES, LEAD_LEVEL_LABELS } from "@/lib/constants";
import { LeadLevel, UserDoc } from "@/types";

const INITIAL_FORM = {
  name: "",
  surname: "",
  phone: "",
  email: "",
  country: COUNTRIES[0],
  level: "bachelor" as LeadLevel,
  specialty: "",
  city: "",
  assignedTo: "",
};

interface CreateLeadModalProps {
  open: boolean;
  onClose: () => void;
  managers: UserDoc[];
}

export function CreateLeadModal({ open, onClose, managers }: CreateLeadModalProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const { user, profile } = useAuth();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const ref = await addDoc(collection(db, "leads"), {
        name: form.name,
        surname: form.surname,
        phone: form.phone,
        email: form.email,
        country: form.country,
        level: form.level,
        specialty: form.specialty,
        city: form.city || null,
        assignedTo: form.assignedTo || null,
        status: "new",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await logActivity({
        action: "create",
        entity: "lead",
        entityId: ref.id,
        entityName: `${form.name} ${form.surname}`,
        userId: user?.uid ?? "",
        userName: profile?.name ?? "",
      });
      showToast("Lid əlavə edildi");
      setForm(INITIAL_FORM);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Yeni lid">
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Ad"
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <Input
          label="Soyad"
          required
          value={form.surname}
          onChange={(event) => setForm({ ...form, surname: event.target.value })}
        />
        <Input
          label="Telefon"
          type="tel"
          required
          value={form.phone}
          onChange={(event) => setForm({ ...form, phone: event.target.value })}
        />
        <Input
          label="E-poçt"
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <Select
          label="Ölkə"
          value={form.country}
          onChange={(event) => setForm({ ...form, country: event.target.value })}
        >
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </Select>
        <Select
          label="Səviyyə"
          value={form.level}
          onChange={(event) => setForm({ ...form, level: event.target.value as LeadLevel })}
        >
          {Object.entries(LEAD_LEVEL_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Input
          label="İxtisas"
          value={form.specialty}
          onChange={(event) => setForm({ ...form, specialty: event.target.value })}
        />
        <Input
          label="Şəhər (opsional)"
          value={form.city}
          onChange={(event) => setForm({ ...form, city: event.target.value })}
        />
        <Select
          label="Menecer"
          value={form.assignedTo}
          onChange={(event) => setForm({ ...form, assignedTo: event.target.value })}
          className="sm:col-span-2"
        >
          <option value="">Təyin edilməyib</option>
          {managers.map((manager) => (
            <option key={manager.uid} value={manager.uid}>
              {manager.name}
            </option>
          ))}
        </Select>

        <div className="sm:col-span-2">
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Əlavə edilir..." : "Əlavə et"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
