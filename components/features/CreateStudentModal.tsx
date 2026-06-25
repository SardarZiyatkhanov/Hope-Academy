"use client";

import { FormEvent, useState } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, getSecondaryAuth } from "@/lib/firebase";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth-context";
import { logActivity } from "@/lib/activity-log";
import { UserDoc } from "@/types";

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  phone: "",
  managerId: "",
};

interface CreateStudentModalProps {
  open: boolean;
  onClose: () => void;
  managers: UserDoc[];
}

export function CreateStudentModal({ open, onClose, managers }: CreateStudentModalProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const { user: authUser, profile } = useAuth();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const secondaryAuth = getSecondaryAuth();
    try {
      const credential = await createUserWithEmailAndPassword(
        secondaryAuth,
        form.email,
        form.password
      );

      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        email: form.email,
        name: form.name,
        role: "student",
        managerId: form.managerId || null,
        phone: form.phone || null,
        createdAt: serverTimestamp(),
      });

      await signOut(secondaryAuth);

      await logActivity({
        action: "create",
        entity: "student",
        entityId: credential.user.uid,
        entityName: form.name,
        userId: authUser?.uid ?? "",
        userName: profile?.name ?? "",
      });

      showToast("Tələbə yaradıldı");
      setForm(INITIAL_FORM);
      onClose();
    } catch {
      setError("Tələbə yaradılmadı. Email artıq istifadə olunur ola bilər.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Yeni tələbə">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Ad Soyad"
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <Input
          label="E-poçt"
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <Input
          label="Şifrə"
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
        <Input
          label="Telefon"
          value={form.phone}
          onChange={(event) => setForm({ ...form, phone: event.target.value })}
        />
        <Select
          label="Menecer"
          value={form.managerId}
          onChange={(event) => setForm({ ...form, managerId: event.target.value })}
        >
          <option value="">Təyin edilməyib</option>
          {managers.map((manager) => (
            <option key={manager.uid} value={manager.uid}>
              {manager.name}
            </option>
          ))}
        </Select>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Yaradılır..." : "Yarat"}
        </Button>
      </form>
    </Modal>
  );
}
