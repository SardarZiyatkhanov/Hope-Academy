import { WifiOff, RotateCcw } from "lucide-react";

export const metadata = {
  title: "Oflayn",
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-light px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-navy/5">
        <WifiOff size={36} className="text-navy" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-navy">İnternet bağlantısı yoxdur</h1>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        Bu səhifəni görmək üçün internet bağlantısı lazımdır. Bağlantınızı yoxlayın
        və yenidən cəhd edin.
      </p>
      <a
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-[8px] bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue"
      >
        <RotateCcw size={16} />
        Yenidən cəhd et
      </a>
    </main>
  );
}
