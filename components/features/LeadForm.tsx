"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { db } from "@/lib/firebase";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setSubmitted(true);
      setForm(INITIAL_FORM);
    } catch {
      setError("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="flex flex-col items-center gap-5 py-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue to-navy shadow-lg"
          >
            <CheckCircle2 size={40} className="text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles size={16} className="text-gold" />
              <h3 className="text-xl font-bold text-navy">Müraciətiniz alındı!</h3>
              <Sparkles size={16} className="text-gold" />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Komandamız 24 saat ərzində sizinlə əlaqə saxlayacaq.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-xs text-blue underline-offset-2 hover:underline"
          >
            Yeni müraciət et
          </motion.button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="grid gap-4 sm:grid-cols-2"
        >
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
          {error && (
            <p className="sm:col-span-2 rounded-[8px] bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? "Göndərilir..." : "Müraciət göndər"}
            </Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
