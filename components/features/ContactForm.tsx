"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, "contactMessages"), {
        ...form,
        status: "new",
        createdAt: serverTimestamp(),
      });
      showToast("Mesajınız göndərildi! Tezliklə sizinlə əlaqə saxlayacağıq.");
      setForm(INITIAL_FORM);
    } catch {
      showToast("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
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
        label="Telefon (opsional)"
        type="tel"
        value={form.phone}
        onChange={(event) => setForm({ ...form, phone: event.target.value })}
      />
      <Input
        label="Mövzu"
        value={form.subject}
        onChange={(event) => setForm({ ...form, subject: event.target.value })}
      />
      <div className="sm:col-span-2">
        <Textarea
          label="Mesaj"
          required
          rows={5}
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? "Göndərilir..." : "Mesaj göndər"}
        </Button>
      </div>
    </form>
  );
}
