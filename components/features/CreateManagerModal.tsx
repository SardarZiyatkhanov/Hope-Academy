"use client";

import { FormEvent, useState } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, getSecondaryAuth } from "@/lib/firebase";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth-context";
import { logActivity } from "@/lib/activity-log";

const INITIAL_FORM = { name: "", email: "", password: "", phone: "" };

interface CreateManagerModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateManagerModal({ open, onClose }: CreateManagerModalProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const { user, profile } = useAuth();

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
        role: "manager",
        phone: form.phone || null,
        createdAt: serverTimestamp(),
      });

      await signOut(secondaryAuth);

      await logActivity({
        action: "create",
        entity: "manager",
        entityId: credential.user.uid,
        entityName: form.name,
        userId: user?.uid ?? "",
        userName: profile?.name ?? "",
      });

      showToast("Menecer yaradıldı");
      setForm(INITIAL_FORM);
      onClose();
    } catch {
      setError("Menecer yaradılmadı. Email artıq istifadə olunur ola bilər.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Yeni menecer">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Ad Soyad"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="E-poçt"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Şifrə"
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Input
          label="Telefon"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Yaradılır..." : "Yarat"}
        </Button>
      </form>
    </Modal>
  );
}
