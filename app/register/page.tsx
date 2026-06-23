"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { AuthBrandPanel } from "@/components/features/AuthBrandPanel";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, User, UserPlus } from "lucide-react";
import { cn } from "@/lib/cn";

const FIELD_CLASSES =
  "w-full rounded-[8px] border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-50 disabled:text-gray-400";

function errorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "Bu email artıq istifadə olunur.";
    case "auth/invalid-email":
      return "Email düzgün formatda deyil.";
    case "auth/weak-password":
      return "Şifrə ən azı 6 simvol olmalıdır.";
    default:
      return "Qeydiyyat zamanı xəta baş verdi. Yenidən cəhd edin.";
  }
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Şifrələr uyğun gəlmir.");
      return;
    }

    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        email,
        name,
        role: "student",
        managerId: null,
        phone: phone || null,
        createdAt: serverTimestamp(),
      });

      const idToken = await credential.user.getIdToken();
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      router.push("/student/dashboard");
    } catch (err) {
      const code = err instanceof Error && "code" in err ? String((err as { code: string }).code) : "";
      setError(errorMessage(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen">
      <AuthBrandPanel
        headline="Hesab yaradın və proses izləməyə başlayın"
        description="Müraciətinizi təqdim edin, sənədlərinizi yükləyin və qəbul prosesini onlayn panel üzərindən izləyin."
      />

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center bg-light p-4 py-12 lg:w-1/2 lg:bg-white">
        <div className="w-full max-w-md">
          {/* Mobile-only brand lockup (left panel is hidden below lg) */}
          <div className="mb-8 flex flex-col items-center gap-2 text-center lg:hidden">
            <Image src="/logo.jpg" alt="Hope Academy" width={56} height={56} className="rounded-full" />
            <span className="flex flex-col items-center leading-tight">
              <span className="font-heading text-2xl font-bold text-navy">Hope Academy</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
                Edu and Career Counselling
              </span>
            </span>
          </div>

          <div className="rounded-card border border-gray-100 bg-white p-8 shadow-xl shadow-navy/5 sm:p-10">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-blue/10 text-blue">
              <UserPlus size={24} />
            </div>

            <h1 className="font-heading text-2xl font-bold text-navy">Qeydiyyatdan keçin</h1>
            <p className="mt-1 text-sm text-gray-500">Tələbə hesabı yaradın</p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-navy">
                  Ad Soyad
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="name"
                    type="text"
                    required
                    maxLength={100}
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Adınız və soyadınız"
                    className={FIELD_CLASSES}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-navy">
                  E-poçt
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="email"
                    type="email"
                    required
                    maxLength={200}
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="email@example.com"
                    className={FIELD_CLASSES}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-sm font-medium text-navy">
                  Telefon
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="phone"
                    type="tel"
                    maxLength={30}
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+994 50 123 45 67"
                    className={FIELD_CLASSES}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-navy">
                  Şifrə
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    maxLength={128}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className={cn(FIELD_CLASSES, "pr-11")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-navy"
                    aria-label={showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-navy">
                  Şifrəni təkrarla
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    maxLength={128}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="••••••••"
                    className={FIELD_CLASSES}
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-[8px] bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}

              <Button type="submit" disabled={loading} className="mt-2 w-full">
                {loading ? <Spinner className="border-white/40 border-t-white" /> : "Qeydiyyatdan keç"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Artıq hesabınız var?{" "}
              <Link href="/login?role=student" className="font-medium text-blue hover:underline">
                Daxil olun
              </Link>
            </p>
          </div>

          <Link
            href="/"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-navy"
          >
            <ArrowLeft size={16} />
            Ana səhifəyə qayıt
          </Link>
        </div>
      </div>
    </main>
  );
}
