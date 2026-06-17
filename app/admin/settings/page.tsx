import { Settings, Bell, Shield, Palette, Database } from "lucide-react";

const SETTING_SECTIONS = [
  {
    icon: Bell,
    title: "Bildirişlər",
    description: "Email və push bildiriş parametrləri",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Shield,
    title: "Təhlükəsizlik",
    description: "Şifrə, 2FA və giriş tarixçəsi",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Palette,
    title: "Görünüş",
    description: "Tema, dil və regional parametrlər",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: Database,
    title: "Məlumatlar",
    description: "İxrac, yedəkləmə və inteqrasiyalar",
    color: "bg-amber-50 text-amber-600",
  },
];

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-7">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-navy">Parametrlər</h1>
        <p className="mt-0.5 text-sm text-gray-400">Sistem parametrləri və tənzimləmələr</p>
      </div>

      {/* Settings grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SETTING_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="flex cursor-not-allowed items-start gap-4 rounded-xl border border-gray-100 bg-white p-5 opacity-60 shadow-sm"
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${section.color}`}>
                <Icon size={20} />
              </span>
              <div>
                <p className="font-semibold text-navy">{section.title}</p>
                <p className="mt-0.5 text-sm text-gray-400">{section.description}</p>
                <span className="mt-2 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Tezliklə
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info card */}
      <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 px-5 py-4">
        <Settings size={18} className="shrink-0 text-blue-500" />
        <p className="text-sm text-blue-700">
          Bu bölmə hazırda hazırlanır. Yaxın zamanda tam funksionallıq əlavə ediləcək.
        </p>
      </div>
    </div>
  );
}
