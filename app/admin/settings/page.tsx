"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { logActivity } from "@/lib/activity-log";
import { exportToCSV } from "@/lib/export-csv";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { ApplicationDoc, LeadDoc, UserDoc } from "@/types";
import {
  Bell,
  Shield,
  Palette,
  Database,
  Save,
  Download,
  Moon,
  Sun,
  Check,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface NotificationPrefs {
  newLead: boolean;
  statusChange: boolean;
  newMessage: boolean;
  newStudent: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  newLead: true,
  statusChange: true,
  newMessage: true,
  newStudent: true,
};

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
        checked ? "bg-blue" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

export default function AdminSettingsPage() {
  const { user, profile } = useAuth();
  const { showToast } = useToast();

  // Notifications
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);
  const [prefsLoading, setPrefsLoading] = useState(true);

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  // Theme
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Data export
  const [students, setStudents] = useState<UserDoc[]>([]);
  const [leads, setLeads] = useState<LeadDoc[]>([]);
  const [applications, setApplications] = useState<ApplicationDoc[]>([]);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "settings", user.uid)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data() as Partial<NotificationPrefs>;
        setPrefs({ ...DEFAULT_PREFS, ...data });
      }
      setPrefsLoading(false);
    });
  }, [user]);

  useEffect(() => {
    const saved = localStorage.getItem("ha-theme");
    if (saved === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const unsubs = [
      onSnapshot(
        query(collection(db, "users"), where("role", "==", "student")),
        (snap) =>
          setStudents(
            snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserDoc))
          )
      ),
      onSnapshot(collection(db, "leads"), (snap) =>
        setLeads(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as LeadDoc))
        )
      ),
      onSnapshot(collection(db, "applications"), (snap) =>
        setApplications(
          snap.docs.map(
            (d) => ({ id: d.id, ...d.data() } as ApplicationDoc)
          )
        )
      ),
    ];
    return () => unsubs.forEach((u) => u());
  }, []);

  const handleSavePrefs = async () => {
    if (!user) return;
    await setDoc(doc(db, "settings", user.uid), prefs);
    await logActivity({
      action: "update",
      entity: "settings",
      entityId: user.uid,
      entityName: "Bildiriş parametrləri",
      userId: user.uid,
      userName: profile?.name ?? "",
    });
    showToast("Bildiriş parametrləri saxlanıldı");
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("Yeni şifrələr uyğun gəlmir");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Şifrə minimum 6 simvol olmalıdır");
      return;
    }

    setChangingPassword(true);
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser || !firebaseUser.email) throw new Error("No user");

      const credential = EmailAuthProvider.credential(
        firebaseUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, newPassword);

      await logActivity({
        action: "update",
        entity: "settings",
        entityId: user?.uid ?? "",
        entityName: "Şifrə dəyişdirildi",
        userId: user?.uid ?? "",
        userName: profile?.name ?? "",
      });

      showToast("Şifrə uğurla dəyişdirildi");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPasswordError("Cari şifrə yanlışdır");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleToggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("ha-theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    showToast(next === "dark" ? "Qaranlıq rejim aktivdir" : "İşıqlı rejim aktivdir");
  };

  const handleExportStudents = () => {
    exportToCSV(
      students.map((s) => ({
        Ad: s.name,
        Email: s.email,
        Telefon: s.phone ?? "",
      })),
      "telebeler"
    );
  };

  const handleExportLeads = () => {
    exportToCSV(
      leads.map((l) => ({
        Ad: l.name,
        Soyad: l.surname,
        Telefon: l.phone,
        Email: l.email,
        Ölkə: l.country,
        Səviyyə: l.level,
        İxtisas: l.specialty,
        Status: l.status,
      })),
      "lidler"
    );
  };

  const handleExportApplications = () => {
    exportToCSV(
      applications.map((a) => ({
        Universitet: a.universityName,
        Ölkə: a.universityCountry,
        Proqram: a.program,
        Status: a.status,
      })),
      "erizeler"
    );
  };

  const NOTIF_OPTIONS: {
    key: keyof NotificationPrefs;
    label: string;
    desc: string;
  }[] = [
    {
      key: "newLead",
      label: "Yeni lid",
      desc: "Yeni lid əlavə edildikdə bildiriş",
    },
    {
      key: "statusChange",
      label: "Status dəyişikliyi",
      desc: "Ərizə statusu dəyişdikdə bildiriş",
    },
    {
      key: "newMessage",
      label: "Yeni mesaj",
      desc: "Tələbədən yeni mesaj gəldikdə bildiriş",
    },
    {
      key: "newStudent",
      label: "Yeni tələbə",
      desc: "Yeni tələbə qeydiyyatdan keçdikdə bildiriş",
    },
  ];

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="text-xl font-bold text-navy">Parametrlər</h1>
        <p className="mt-0.5 text-sm text-gray-400">
          Sistem parametrləri və tənzimləmələr
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Notifications */}
        <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
              <Bell size={16} className="text-blue-600" />
            </span>
            <h2 className="text-sm font-semibold text-navy">Bildirişlər</h2>
          </div>
          <div className="flex flex-col gap-4 p-5">
            {prefsLoading ? (
              <p className="text-sm text-gray-400">Yüklənir...</p>
            ) : (
              <>
                {NOTIF_OPTIONS.map((opt) => (
                  <div
                    key={opt.key}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-navy">
                        {opt.label}
                      </p>
                      <p className="text-xs text-gray-400">{opt.desc}</p>
                    </div>
                    <Toggle
                      checked={prefs[opt.key]}
                      onChange={(v) =>
                        setPrefs((prev) => ({ ...prev, [opt.key]: v }))
                      }
                    />
                  </div>
                ))}
                <Button
                  onClick={handleSavePrefs}
                  className="mt-2 flex items-center gap-2 self-start"
                >
                  <Save size={14} />
                  Yadda saxla
                </Button>
              </>
            )}
          </div>
        </section>

        {/* Security */}
        <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-50">
              <Shield size={16} className="text-green-600" />
            </span>
            <h2 className="text-sm font-semibold text-navy">Təhlükəsizlik</h2>
          </div>
          <form
            onSubmit={handleChangePassword}
            className="flex flex-col gap-4 p-5"
          >
            <Input
              label="Cari şifrə"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              label="Yeni şifrə"
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Yeni şifrəni təsdiqlə"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordError && (
              <p className="text-sm text-red-600">{passwordError}</p>
            )}
            <Button
              type="submit"
              disabled={changingPassword}
              className="flex items-center gap-2 self-start"
            >
              <Shield size={14} />
              {changingPassword ? "Dəyişdirilir..." : "Şifrəni dəyiş"}
            </Button>
          </form>
        </section>

        {/* Theme */}
        <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50">
              <Palette size={16} className="text-violet-600" />
            </span>
            <h2 className="text-sm font-semibold text-navy">Görünüş</h2>
          </div>
          <div className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-navy">Tema</p>
                <p className="text-xs text-gray-400">
                  İşıqlı və ya qaranlıq rejim seçin
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (theme !== "light") handleToggleTheme();
                  }}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all",
                    theme === "light"
                      ? "border-blue bg-blue-50 text-blue"
                      : "border-gray-200 text-gray-400 hover:border-gray-300"
                  )}
                >
                  <Sun size={18} />
                </button>
                <button
                  onClick={() => {
                    if (theme !== "dark") handleToggleTheme();
                  }}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all",
                    theme === "dark"
                      ? "border-blue bg-blue-50 text-blue"
                      : "border-gray-200 text-gray-400 hover:border-gray-300"
                  )}
                >
                  <Moon size={18} />
                </button>
              </div>
            </div>
            {theme === "dark" && (
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2">
                <Check size={14} className="text-amber-600" />
                <p className="text-xs text-amber-700">
                  Qaranlıq rejim aktivdir
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Data export */}
        <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50">
              <Database size={16} className="text-amber-600" />
            </span>
            <h2 className="text-sm font-semibold text-navy">Məlumatlar</h2>
          </div>
          <div className="flex flex-col gap-3 p-5">
            <p className="text-xs text-gray-400">
              Bütün məlumatları CSV formatında ixrac edin
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                onClick={handleExportStudents}
                className="flex items-center gap-2 border border-gray-200"
              >
                <Download size={14} />
                Tələbələr ({students.length})
              </Button>
              <Button
                variant="ghost"
                onClick={handleExportLeads}
                className="flex items-center gap-2 border border-gray-200"
              >
                <Download size={14} />
                Lidlər ({leads.length})
              </Button>
              <Button
                variant="ghost"
                onClick={handleExportApplications}
                className="flex items-center gap-2 border border-gray-200"
              >
                <Download size={14} />
                Ərizələr ({applications.length})
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
