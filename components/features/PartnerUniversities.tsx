const UNIVERSITIES = [
  "Humboldt-Universität zu Berlin",
  "University of Amsterdam",
  "University of Vienna",
  "Sorbonne Université",
  "University of Warsaw",
  "KU Leuven",
  "Charles University",
  "Eötvös Loránd University",
  "Sapienza Università di Roma",
  "University College London",
  "Istanbul University",
  "American University in Dubai",
  "Cairo University",
];

export function PartnerUniversities() {
  const items = [...UNIVERSITIES, ...UNIVERSITIES];

  return (
    <section className="border-y border-gray-100 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
          Tərəfdaş universitetlər
        </p>
        <div className="mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-12">
            {items.map((name, index) => (
              <span
                key={`${name}-${index}`}
                className="whitespace-nowrap text-base font-semibold text-gray-400"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
