"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const subtitle =
    role === "admin" ? "İdarəetmə panelinə giriş" : "Tələbə kabinetinə giriş";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "users", credential.user.uid));
      const userRole = snap.exists() ? snap.data().role : null;

      if (userRole) {
        document.cookie = `session_role=${userRole}; path=/; max-age=${60 * 60 * 24 * 7}`;
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
    <div className="w-full max-w-md rounded-card bg-white p-8 shadow-xl">
      <div className="flex flex-col items-center gap-2 text-center">
        <Image
          src="/logo.jpg"
          alt="Hope Academy"
          width={48}
          height={48}
          className="rounded-full"
        />
        <h1 className="text-xl font-semibold text-navy">Hope Academy</h1>
        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
          Edu and Career Counselling
        </p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <Input
          label="E-poçt"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="email@example.com"
        />
        <Input
          label="Şifrə"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={loading} className="mt-2 w-full">
          {loading ? <Spinner className="border-white/40 border-t-white" /> : "Daxil ol"}
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy p-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
