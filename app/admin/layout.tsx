import { Suspense } from "react";
import { PortalHeader } from "@/components/layout/PortalHeader";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-light">
      <PortalHeader title="İdarəetmə paneli" />
      <div className="mx-auto flex max-w-7xl">
        <Suspense fallback={<div className="hidden w-[200px] shrink-0 sm:flex" style={{ background: "linear-gradient(180deg, #0e2454 0%, #091b43 100%)" }} />}>
          <Sidebar />
        </Suspense>
        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
