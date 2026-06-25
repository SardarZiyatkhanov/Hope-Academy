import Image from "next/image";
import { Marquee } from "@/components/ui/Marquee";

const UNIVERSITIES = [
  {
    name: "KU Leuven",
    logo: "/logos/kuleuven.png",
    abbr: "KUL",
    color: "from-[#003f8a] to-[#002a5c]",
  },
  {
    name: "University of Amsterdam",
    logo: "/logos/uva.png",
    abbr: "UvA",
    color: "from-[#bc0031] to-[#8a0023]",
  },
  {
    name: "Charles University",
    logo: "/logos/charles.png",
    abbr: "CU",
    color: "from-[#003087] to-[#001f59]",
  },
  {
    name: "University College London",
    logo: "/logos/ucl.png",
    abbr: "UCL",
    color: "from-[#500778] to-[#36054f]",
  },
  {
    name: "Humboldt-Universität Berlin",
    logo: "/logos/humboldt.png",
    abbr: "HUB",
    color: "from-[#1a3a6b] to-[#0d2244]",
  },
  {
    name: "Sapienza Università di Roma",
    logo: "/logos/sapienza.png",
    abbr: "SAP",
    color: "from-[#82001a] to-[#5a0012]",
  },
  {
    name: "Eötvös Loránd University",
    logo: "/logos/elte.png",
    abbr: "ELTE",
    color: "from-[#005b9a] to-[#003d68]",
  },
  {
    name: "University of Vienna",
    logo: "/logos/univie.png",
    abbr: "UniWien",
    color: "from-[#0063a6] to-[#004477]",
  },
  {
    name: "Sorbonne Université",
    logo: null,
    abbr: "SU",
    color: "from-[#003189] to-[#001f60]",
  },
  {
    name: "University of Warsaw",
    logo: null,
    abbr: "UW",
    color: "from-[#8b0000] to-[#5c0000]",
  },
];

function LogoBadge({ uni }: { uni: (typeof UNIVERSITIES)[0] }) {
  if (uni.logo) {
    return (
      <div className="flex h-14 w-40 shrink-0 items-center justify-center rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md">
        <Image
          src={uni.logo}
          alt={uni.name}
          width={120}
          height={40}
          className="max-h-full max-w-full object-contain"
          unoptimized
        />
      </div>
    );
  }
  return (
    <div
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${uni.color} text-[11px] font-bold text-white shadow-sm transition-shadow hover:shadow-md`}
    >
      {uni.abbr}
    </div>
  );
}

export function PartnerUniversities() {
  return (
    <section aria-label="Tərəfdaş universitetlər" className="border-y border-gray-100 bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
          Tərəfdaş universitetlər
        </p>
      </div>

      <div className="mt-8">
        <Marquee speed="normal" pauseOnHover>
          {UNIVERSITIES.map((uni) => (
            <div
              key={uni.name}
              className="flex items-center gap-3 whitespace-nowrap px-2"
              title={uni.name}
            >
              <LogoBadge uni={uni} />
              <span className="text-sm font-medium text-gray-500">
                {uni.name}
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
