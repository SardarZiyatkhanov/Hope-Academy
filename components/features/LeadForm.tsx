"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

const COUNTRIES = [
  "Almaniya",
  "Niderland",
  "Çexiya",
  "Belçika",
  "Fransa",
  "Polşa",
  "Avstriya",
  "Digər",
];

const LEVELS: Array<{ value: string; label: string }> = [
  { value: "bachelor", label: "Bakalavr" },
  { value: "master", label: "Magistr" },
  { value: "phd", label: "Doktorantura (PhD)" },
];

const INITIAL_FORM = {
  name: "",
  surname: "",
  phone: "",
  email: "",
  country: COUNTRIES[0],
  level: "bachelor",
  specialty: "",
  city: "",
};

export function LeadForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, "leads"), {
        ...form,
        status: "new",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      showToast("Müraciətiniz qeydə alındı! Tezliklə sizinlə əlaqə saxlayacağıq.");
      setForm(INITIAL_FORM);
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
        label="Maraqlandığınız ölkə"
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
        label="Təhsil səviyyəsi"
        value={form.level}
        onChange={(event) => setForm({ ...form, level: event.target.value })}
      >
        {LEVELS.map((level) => (
          <option key={level.value} value={level.value}>
            {level.label}
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
      <div className="sm:col-span-2">
        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? "Göndərilir..." : "Müraciət göndər"}
        </Button>
      </div>
    </form>
  );
}
