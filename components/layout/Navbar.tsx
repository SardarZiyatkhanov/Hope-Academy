import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-navy">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Hope Academy" width={36} height={36} />
          <span className="text-lg font-semibold text-white">Hope Academy</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/login?role=student">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Ərizəmi yoxla
            </Button>
          </Link>
          <Link href="/login?role=admin">
            <Button variant="primary">Panel</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
