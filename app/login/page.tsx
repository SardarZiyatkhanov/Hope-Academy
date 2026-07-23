"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { AuthBrandPanel } from "@/components/features/AuthBrandPanel";
import { ArrowLeft, Eye, EyeOff, GraduationCap, Lock, Mail, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";

const FIELD_CLASSES =
  "w-full rounded-[8px] border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-50 disabled:text-gray-400";

function LoginForm({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const subtitle = isAdmin
    ? "İdarəetmə panelinizə daxil olun"
    : "Tələbə kabinetinizə daxil olun";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "users", credential.user.uid));
      const userRole = snap.exists() ? snap.data().role : null;

      if (userRole) {
        const idToken = await credential.user.getIdToken();
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
      }

      if (userRole === "student") {
        router.push("/student/dashboard");
      } else if (userRole === "manager" || userRole === "superadmin") {
        router.push("/admin");
      } else {
        setError("Hesabınız üçün rol təyin edilməyib.");
      }
    } catch {
      setError("Email və ya şifrə yanlışdır.");
    } finally {
      setLoading(false);
    }
  };

  return (
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

      <div
        className={cn(
          "rounded-card border border-gray-100 bg-white p-8 shadow-xl shadow-navy/5 sm:p-10",
          isAdmin && "border-t-4 border-t-navy"
        )}
      >
        {isAdmin && (
          <span className="mb-4 inline-flex w-fit items-center rounded-pill bg-navy/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy">
            Menecer Paneli
          </span>
        )}
        <div
          className={cn(
            "mb-5 flex h-12 w-12 items-center justify-center rounded-full",
            isAdmin ? "bg-navy/10 text-navy" : "bg-blue/10 text-blue"
          )}
        >
          {isAdmin ? <ShieldCheck size={24} /> : <GraduationCap size={24} />}
        </div>

        <h1 className="font-heading text-2xl font-bold text-navy">
          {isAdmin ? "Panelə xoş gəlmisiniz" : "Xoş gəlmisiniz"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
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
                maxLength={128}
                autoComplete="current-password"
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

          {error && (
            <p className="rounded-[8px] bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? <Spinner className="border-white/40 border-t-white" /> : "Daxil ol"}
          </Button>
        </form>

        {!isAdmin && (
          <p className="mt-6 text-center text-sm text-gray-500">
            Hesabınız yoxdur?{" "}
            <Link href="/register" className="font-medium text-blue hover:underline">
              Qeydiyyatdan keçin
            </Link>
          </p>
        )}
      </div>

      <Link
        href="/"
        className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-navy"
      >
        <ArrowLeft size={16} />
        Ana səhifəyə qayıt
      </Link>
    </div>
  );
}

function LoginPageContent() {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("role") === "admin";

  return (
    <main className="flex min-h-screen">
      <AuthBrandPanel
        badge={isAdmin ? "Menecer Paneli" : undefined}
        headline={
          isAdmin
            ? "Hope Academy idarəetmə panelinə xoş gəlmisiniz"
            : "Bakıdan bütün dünyaya təhsil səyahətiniz"
        }
        description={
          isAdmin
            ? "Tələbə ərizələrini idarə edin, sənədləri yoxlayın və prosesi izləyin."
            : "Universitet seçimi, sənədlərin hazırlanması, müraciət və viza prosesində etibarlı tərəfdaşınız."
        }
      />

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center bg-light p-4 py-12 lg:w-1/2 lg:bg-white">
        <LoginForm isAdmin={isAdmin} />
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
