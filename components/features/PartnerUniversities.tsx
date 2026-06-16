const UNIVERSITIES = [
  { abbr: "HUB", name: "Humboldt-Universität zu Berlin", color: "from-[#1a3a6b] to-[#0d2244]" },
  { abbr: "UvA", name: "University of Amsterdam", color: "from-[#bc0031] to-[#8a0023]" },
  { abbr: "UniWien", name: "University of Vienna", color: "from-[#0063a6] to-[#004477]" },
  { abbr: "SU", name: "Sorbonne Université", color: "from-[#003189] to-[#001f60]" },
  { abbr: "UW", name: "University of Warsaw", color: "from-[#8b0000] to-[#5c0000]" },
  { abbr: "KUL", name: "KU Leuven", color: "from-[#003f8a] to-[#002a5c]" },
  { abbr: "CU", name: "Charles University", color: "from-[#003087] to-[#001f59]" },
  { abbr: "ELTE", name: "Eötvös Loránd University", color: "from-[#005b9a] to-[#003d68]" },
  { abbr: "UCL", name: "University College London", color: "from-[#500778] to-[#36054f]" },
  { abbr: "UniTO", name: "Sapienza Università di Roma", color: "from-[#82001a] to-[#5a0012]" },
];

export function PartnerUniversities() {
  const items = [...UNIVERSITIES, ...UNIVERSITIES];

  return (
    <section className="border-y border-gray-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
          Tərəfdaş universitetlər
        </p>
        <div className="mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-6">
            {items.map(({ abbr, name, color }, index) => (
              <div
                key={`${name}-${index}`}
                className="flex items-center gap-3 whitespace-nowrap"
                title={name}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-gradient-to-br ${color} text-[10px] font-bold text-white shadow-sm`}
                >
                  {abbr}
                </div>
                <span className="text-sm font-medium text-gray-500">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
