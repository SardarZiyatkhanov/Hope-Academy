import Image from "next/image";

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

function LogoBadge({ uni }: { uni: typeof UNIVERSITIES[0] }) {
  if (uni.logo) {
    return (
      <div className="flex h-12 w-36 shrink-0 items-center justify-center rounded-[10px] bg-white px-3 py-2 shadow-sm ring-1 ring-gray-100">
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
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br ${uni.color} text-[11px] font-bold text-white shadow-sm`}
    >
      {uni.abbr}
    </div>
  );
}

export function PartnerUniversities() {
  const items = [...UNIVERSITIES, ...UNIVERSITIES];

  return (
    <section className="border-y border-gray-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
          Tərəfdaş universitetlər
        </p>
        <div className="mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-5">
            {items.map((uni, index) => (
              <div
                key={`${uni.name}-${index}`}
                className="flex items-center gap-3 whitespace-nowrap"
                title={uni.name}
              >
                <LogoBadge uni={uni} />
                <span className="text-sm font-medium text-gray-500">{uni.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
