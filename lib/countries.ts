import { GraduationCap, Banknote, Globe2, Clock, FileCheck, Home } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface CountryData {
  slug: string;
  flag: string;
  name: string;
  nameAz: string;
  tagline: string;
  description: string;
  highlights: { icon: LucideIcon; label: string; value: string }[];
  whyStudy: { title: string; desc: string }[];
  topUniversities: { name: string; city: string; note: string }[];
  requirements: { label: string; desc: string }[];
}

export const COUNTRIES: CountryData[] = [
  {
    slug: "almaniya",
    flag: "🇩🇪",
    name: "Germany",
    nameAz: "Almaniya",
    tagline: "Pulsuzu dövlət universitetlər, yüksək keyfiyyətli təhsil",
    description:
      "Almaniya dünyanın ən güclü iqtisadiyyatlarından birinə sahib olmaqla yanaşı, beynəlxalq tələbələrə pulsuz dövlət universitetlərini açıq saxlayır. Mühəndislik, texnologiya və elm sahəsindəki universitetlər qlobal reytinqlərdə hər il yüksəlir.",
    highlights: [
      { icon: Banknote, label: "Tədris haqqı", value: "Pulsuz (dövlət)" },
      { icon: Globe2, label: "Dil", value: "Alman / İngilis" },
      { icon: Clock, label: "Müraciət müddəti", value: "Yanvar – Mart" },
      { icon: Home, label: "Yaşayış xərci", value: "€700–1000/ay" },
    ],
    whyStudy: [
      { title: "Pulsuz təhsil", desc: "Əksər dövlət universitetlərində semestrlük qeydiyyat haqqı €150–350 arasındadır, tədris haqqı isə yoxdur." },
      { title: "Güclü iş bazarı", desc: "Almaniyanın texnologiya, avtomobil və maliyyə sektorları mezunlara yüksək tələbat göstərir." },
      { title: "Beynəlxalq mühit", desc: "350.000-dən çox beynəlxalq tələbə — dünyadan insanlarla şəbəkə qurmaq şansı." },
      { title: "Post-tədris icazəsi", desc: "Məzunlar 18 ay iş axtarmaq üçün Almaniyada qalmaq hüququna malikdir." },
    ],
    topUniversities: [
      { name: "Technische Universität München", city: "Münhen", note: "Mühəndislik & texnologiya üzrə Avropanın #1" },
      { name: "Humboldt-Universität zu Berlin", city: "Berlin", note: "Humanitar və sosial elmlər üzrə güclü" },
      { name: "Ludwig-Maximilian-Universität München", city: "Münhen", note: "Tibb, hüquq, iqtisadiyyat" },
      { name: "Heidelberg University", city: "Heidelberg", note: "Almaniyada ən köhnə universitet (1386)" },
    ],
    requirements: [
      { label: "Dil sertifikatı", desc: "Alman dili üçün TestDaF / DSH (C1); İngilis dilindəki proqramlar üçün IELTS 6.0+" },
      { label: "Diplom / transkript", desc: "Notariat təsdiqlənmiş, Almaniyada tanınan format" },
      { label: "Motivasiya məktubu", desc: "Tədqiqat maraqlarınızı əks etdirən, 1–2 səhifəlik" },
      { label: "Tövsiyə məktubları", desc: "2–3 akademik / peşəkar tövsiyə" },
    ],
  },
  {
    slug: "niderland",
    flag: "🇳🇱",
    name: "Netherlands",
    nameAz: "Niderland",
    tagline: "İngilisdilli proqramlar, innovasiya mərkəzi",
    description:
      "Niderland beynəlxalq tələbələr üçün ən çox İngilisdilli proqram təklif edən ölkələrdən biridir. Amsterdam, Delft, Leiden kimi şəhərlər həm akademik, həm də texnoloji inovasiya mərkəzləridir.",
    highlights: [
      { icon: Banknote, label: "Tədris haqqı", value: "€2.500–15.000/il" },
      { icon: Globe2, label: "Dil", value: "Əsasən İngilis" },
      { icon: Clock, label: "Müraciət müddəti", value: "Yanvar – Aprel" },
      { icon: Home, label: "Yaşayış xərci", value: "€900–1300/ay" },
    ],
    whyStudy: [
      { title: "İngilisdilli proqramlar", desc: "2.000-dən çox tam İngilisdilli bakalavr və magistr proqramı." },
      { title: "Startup ekosistemi", desc: "Amsterdam Avropanın ən güclü startup mərkəzlərindən biridir — tələbə layihələri üçün ideal." },
      { title: "Beynəlxalq tanınma", desc: "QS World Rankings-də daim ilk 200-ə daxil olan universitetlər." },
      { title: "Scholarship imkanları", desc: "Holland Scholarship, Erasmus+ və universitet xüsusi bursları mövcuddur." },
    ],
    topUniversities: [
      { name: "University of Amsterdam", city: "Amsterdam", note: "Sosial elmlər, biznes, hüquq" },
      { name: "Delft University of Technology", city: "Delft", note: "Mühəndislik & arxitektura üzrə Avropanın liderləri" },
      { name: "Leiden University", city: "Leiden", note: "Niderland'ın ən köhnə universiteti (1575)" },
      { name: "Erasmus University Rotterdam", city: "Rotterdam", note: "Biznes & iqtisadiyyat sahəsində güclü" },
    ],
    requirements: [
      { label: "Dil sertifikatı", desc: "IELTS 6.0–6.5+ (proqrama görə dəyişir)" },
      { label: "Diplom / transkript", desc: "İngilis və ya Niderland dilinə rəsmi tərcümə ilə" },
      { label: "Motivasiya məktubu", desc: "Xüsusi proqrama marağınızı izah edən, strukturlu" },
      { label: "CV", desc: "Akademik və peşəkar nailiyyətləri əks etdirən Avropa formatı" },
    ],
  },
  {
    slug: "cexiya",
    flag: "🇨🇿",
    name: "Czech Republic",
    nameAz: "Çexiya",
    tagline: "Mərkəzi Avropa'nın qəlbindəki pulsuz təhsil",
    description:
      "Çexiya, xüsusilə Praqa, Avropanın ən gözəl şəhərlərindən birindədir. Çex dilindəki proqramlar pulsuzdur; İngilis dilindəki proqramlarda isə tədris haqqı çox münasib qiymətə təqdim edilir.",
    highlights: [
      { icon: Banknote, label: "Tədris haqqı", value: "Pulsuz (Çex dili) / €2-5K (İng.)" },
      { icon: Globe2, label: "Dil", value: "Çex / İngilis" },
      { icon: Clock, label: "Müraciət müddəti", value: "Fevral – Aprel" },
      { icon: Home, label: "Yaşayış xərci", value: "€500–800/ay" },
    ],
    whyStudy: [
      { title: "Aşağı yaşayış xərci", desc: "Qərbi Avropa ilə müqayisədə yaşayış, qida və nəqliyyat xərcləri 40-50% aşağıdır." },
      { title: "Çex dilini öyrən, pulsuz oxu", desc: "1 il Çex dili hazırlıq kursu ilə Çex proqramlarına pulsuzu qəbul." },
      { title: "Şengen zona", desc: "Praqa vizası bütün Şengen ölkələrinə giriş hüququ verir." },
      { title: "Güclü texniki universitetlər", desc: "CTU Prague mühəndislik sahəsindəki ən yaxşı universitetlər sırasındadır." },
    ],
    topUniversities: [
      { name: "Charles University", city: "Praqa", note: "1348-ci ildə qurulan, Orta Avropanın ən köhnə universiteti" },
      { name: "Czech Technical University in Prague", city: "Praqa", note: "Mühəndislik & texnologiya üzrə №1" },
      { name: "Masaryk University", city: "Brno", note: "Humanitar elmlər, hüquq, sosial elmlər" },
      { name: "University of Economics Prague", city: "Praqa", note: "Biznes & iqtisadiyyat" },
    ],
    requirements: [
      { label: "Dil sertifikatı", desc: "Çex proqramları: B2 Çex dili; İngilis proqramları: IELTS 5.5–6.5" },
      { label: "Diplom / transkript", desc: "Apostil ilə təsdiqlənmiş, Çex dilinə tərcümə edilmiş" },
      { label: "Motivasiya məktubu", desc: "Seçdiyiniz proqrama uyğunluğunuzu göstərən məktub" },
      { label: "Sağlamlıq sığortası", desc: "Çexiyada etibarlı beynəlxalq tibbi sığorta" },
    ],
  },
  {
    slug: "belcika",
    flag: "🇧🇪",
    name: "Belgium",
    nameAz: "Belçika",
    tagline: "Avropanın qəlbindəki çoxdilli təhsil",
    description:
      "Belçika NATO-nun və Avropa İttifaqının baş qərargahına ev sahibliyi edir. KU Leuven, Ghent University kimi dünyaca məşhur universitetlər Belçikanı beynəlxalq tələbələr üçün çox cəlbedici edir.",
    highlights: [
      { icon: Banknote, label: "Tədris haqqı", value: "€900–4.175/il" },
      { icon: Globe2, label: "Dil", value: "Fransız / Hollandça / İngilis" },
      { icon: Clock, label: "Müraciət müddəti", value: "Fevral – May" },
      { icon: Home, label: "Yaşayış xərci", value: "€800–1200/ay" },
    ],
    whyStudy: [
      { title: "Avropa İttifaqı mərkəzi", desc: "Brüsseldəki AB qurumlarında staj və karyera imkanları." },
      { title: "Münasib tədris haqqı", desc: "Qərbi Avropada ən aşağı tədris haqlarından biri." },
      { title: "Çoxdilli mühit", desc: "Fransız, Hollandca və İngilis dillərini eyni vaxtda praktika etmək imkanı." },
      { title: "Beynəlxalq tanınma", desc: "KU Leuven dünya reytinqlərində hər il ilk 100-ə daxildir." },
    ],
    topUniversities: [
      { name: "KU Leuven", city: "Leuven", note: "1425-ci ildən, Belçikanın №1 universiteti" },
      { name: "Ghent University", city: "Gent", note: "Elm & mühəndislik sahəsindəki güclü tədqiqat mərkəzi" },
      { name: "Université libre de Bruxelles", city: "Brüssel", note: "Fransızdilli, hüquq & siyasi elmlər" },
      { name: "Vrije Universiteit Brussel", city: "Brüssel", note: "Hollandca & İngilis dilindəki proqramlar" },
    ],
    requirements: [
      { label: "Dil sertifikatı", desc: "IELTS 6.0+ (İngilis proqramları); B2 Fransız/Hollandca (müvafiq proqramlar)" },
      { label: "Diplom / transkript", desc: "Notariat təsdiqlənmiş, rəsmi tərcümə ilə" },
      { label: "Motivasiya məktubu", desc: "Xüsusi proqrama marağınızı əks etdirən strukturlu məktub" },
      { label: "Maliyyə sübut sənədi", desc: "Aylıq €800+ yaşayış xərclərini ödəyə biləcəyinizi göstərən sənəd" },
    ],
  },
  {
    slug: "fransa",
    flag: "🇫🇷",
    name: "France",
    nameAz: "Fransa",
    tagline: "İncəsənət, moda, mütbəx — və dünyaca məşhur universitetlər",
    description:
      "Fransa həm tarixi, həm mədəniyyəti, həm də akademik keyfiyyəti ilə beynəlxalq tələbələr üçün ən populyar təyinat nöqtələrindən biridir. Paris, Lyon, Bordeaux kimi şəhərlərdəki universitetlər qlobal tanınmaya malikdir.",
    highlights: [
      { icon: Banknote, label: "Tədris haqqı", value: "€170–3.770/il (dövlət)" },
      { icon: Globe2, label: "Dil", value: "Fransız / İngilis" },
      { icon: Clock, label: "Müraciət müddəti", value: "Yanvar – Mart" },
      { icon: Home, label: "Yaşayış xərci", value: "€800–1400/ay" },
    ],
    whyStudy: [
      { title: "Aşağı dövlət universiteti haqqı", desc: "Fransız dövlət universitetlərində tədris haqqı beynəlxalq tələbələr üçün belə son dərəcə münasibdir." },
      { title: "Grande Écoles", desc: "HEC Paris, Sciences Po, École Polytechnique — biznes və elmdə dünyanın ən prestijli məktəbləri." },
      { title: "Mədəni zənginlik", desc: "Sənət, moda, qastronomiyanın mərkəzindəki şəhərlərdə yaşamaq." },
      { title: "Erasmus+ şəbəkəsi", desc: "Fransadan digər Avropa universitetlərinə mübadiləyə getmək asanlığı." },
    ],
    topUniversities: [
      { name: "Sorbonne Université", city: "Paris", note: "Humanitar elmlər üzrə Avropanın simvolu" },
      { name: "École Polytechnique", city: "Palaiseau", note: "Mühəndislik & elm üzrə Fransanın №1" },
      { name: "Sciences Po", city: "Paris", note: "Siyasi elmlər, beynəlxalq münasibətlər" },
      { name: "HEC Paris", city: "Paris", note: "Biznes & MBA üzrə Avropanın №1" },
    ],
    requirements: [
      { label: "Dil sertifikatı", desc: "DELF/DALF B2+ (Fransız proqramları); IELTS 6.5+ (İngilis proqramları)" },
      { label: "Diplom / transkript", desc: "Rəsmi fransız dilinə tərcümə + apostil" },
      { label: "Motivasiya məktubu", desc: "Fransızcada yazılmış motivasiya məktubu (əksər universitetlər üçün)" },
      { label: "Fransız tələbə vizası", desc: "Campus France platforması üzərindən müraciət tələb olunur" },
    ],
  },
  {
    slug: "polsa",
    flag: "🇵🇱",
    name: "Poland",
    nameAz: "Polşa",
    tagline: "Sürətlə inkişaf edən, münasib qiymətli Avropa ölkəsi",
    description:
      "Polşa son illərdə beynəlxalq tələbələr arasında sürətlə populyarlaşan bir ölkəyə çevrilib. Münasib tədris haqqı, aşağı yaşayış xərci və güclü İngilisdilli proqramlar Polşanı Azərbaycanlı tələbələr üçün ideal seçimə çevirir.",
    highlights: [
      { icon: Banknote, label: "Tədris haqqı", value: "€2.000–4.000/il" },
      { icon: Globe2, label: "Dil", value: "Polşa / İngilis" },
      { icon: Clock, label: "Müraciət müddəti", value: "Mart – İyun" },
      { icon: Home, label: "Yaşayış xərci", value: "€400–700/ay" },
    ],
    whyStudy: [
      { title: "Ən aşağı yaşayış xərci", desc: "Varşava Avropanın ən ucuz paytaxtlarından biri — tələbə həyatı üçün ideal." },
      { title: "Tibb fakültələri", desc: "Polşa tibb universitetləri beynəlxalq tələbələri İngilis dilindəki proqramlarda qəbul edir." },
      { title: "Şengen zonu", desc: "Polşa Şengen zonanın üzvüdür — bütün Avropa əlçatanlıdır." },
      { title: "Sürətlə inkişaf edən iqtisadiyyat", desc: "IT, mühəndislik, biznes sahəsindəki şirkətlər tələbə məzunlarına tələbatını artırır." },
    ],
    topUniversities: [
      { name: "University of Warsaw", city: "Varşava", note: "Polşanın ən nüfuzlu dövlət universiteti" },
      { name: "Jagiellonian University", city: "Krakov", note: "1364-cü ildən, humanitar elmlər güclü" },
      { name: "Warsaw University of Technology", city: "Varşava", note: "Mühəndislik & texnologiya sahəsindəki lider" },
      { name: "Medical University of Warsaw", city: "Varşava", note: "Tibb proqramları İngilis dilindədir" },
    ],
    requirements: [
      { label: "Dil sertifikatı", desc: "IELTS 5.5–6.0+ (İngilis proqramları); B1 Polşa (Polşadilli proqramlar)" },
      { label: "Diplom / transkript", desc: "Polşa dilinə rəsmi tərcümə + notariat təsdiqi" },
      { label: "Motivasiya məktubu", desc: "Seçdiyiniz proqrama niyə uyğun olduğunuzu izah edən məktub" },
      { label: "Şəxsiyyət vəsiqəsi / pasport", desc: "Etibarlı pasport surəti, müraciət zamanı tələb edilir" },
    ],
  },
  {
    slug: "avstriya",
    flag: "🇦🇹",
    name: "Austria",
    nameAz: "Avstriya",
    tagline: "Klassik Avropa, yüksək həyat keyfiyyəti, münasib təhsil",
    description:
      "Vyana dünyanın ən yüksək həyat keyfiyyətinə malik şəhərləri sırasında hər il birinci pillədə yer alır. Avstriya universitetlərinin tədris haqqı Qərbi Avropanın digər ölkələri ilə müqayisədə çox münasibdir.",
    highlights: [
      { icon: Banknote, label: "Tədris haqqı", value: "€726–1.500/il" },
      { icon: Globe2, label: "Dil", value: "Alman / İngilis" },
      { icon: Clock, label: "Müraciət müddəti", value: "Yanvar – Aprel" },
      { icon: Home, label: "Yaşayış xərci", value: "€800–1200/ay" },
    ],
    whyStudy: [
      { title: "Həyat keyfiyyəti", desc: "Vyana Economist Intelligence Unit-in \"Yaşanılabilir Şəhərlər\" reytinqinin uzun illər lideridır." },
      { title: "Münasib tədris haqqı", desc: "Avstriya dövlət universitetlərinin haqqı Qərbi Avropanın ən aşağılarından biridir." },
      { title: "Mədəni zənginlik", desc: "Musiqi, sənət, tarix — Vyanada akademik həyatın xaricindəki imkanlar sonsuzdur." },
      { title: "DACH şəbəkəsi", desc: "Avstriyadan Almaniya və İsveçrəyə keçid Alman dili biliklərinizlə olduqca asandır." },
    ],
    topUniversities: [
      { name: "University of Vienna", city: "Vyana", note: "1365-ci ildən, Avstriya'nın ən böyük universiteti" },
      { name: "TU Wien", city: "Vyana", note: "Mühəndislik & texnologiya üzrə Avstriyanın №1" },
      { name: "University of Graz", city: "Qrats", note: "Humanitar elmlər, sosial elmlər, hüquq" },
      { name: "Johannes Kepler University Linz", city: "Linz", note: "Biznes, iqtisadiyyat, sosial elmlər" },
    ],
    requirements: [
      { label: "Dil sertifikatı", desc: "ÖSD/TestDaF B2+ (Alman proqramları); IELTS 6.0+ (İngilis proqramları)" },
      { label: "Diplom / transkript", desc: "Apostil + Alman dilinə rəsmi tərcümə" },
      { label: "Motivasiya məktubu", desc: "Niyə Avstriya, niyə bu proqram — aydın izahatla" },
      { label: "Maliyyə sənədi", desc: "Sığorta + bank hesabı çıxarışı müraciət üçün tələb edilir" },
    ],
  },
];

export function getCountry(slug: string): CountryData | undefined {
  return COUNTRIES.find((c) => c.slug === slug);
}

export { GraduationCap, FileCheck };
