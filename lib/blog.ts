export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  content: { heading?: string; body: string }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "xaricde-oxumaq-ucun-5-addim",
    title: "Xaricdə Oxumaq Üçün 5 Addım",
    excerpt: "Xaricdə təhsil almaq istəyirsiniz? Bu məqalədə ən ağıllı başlanğıc nöqtəsindən son addıma qədər bütün prosesi izah edirik.",
    category: "Bələdçi",
    readTime: "5 dəq",
    date: "2025-01-15",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
    content: [
      { body: "Xaricdə oxumaq ideyası çoxumuzu həyəcanlandırır, lakin haradan başlayacağını bilməmək çox vaxt insanları duraksadır. Bu məqalədə prosesi 5 sadə addıma bölürük." },
      { heading: "1. Özünüzü tanıyın", body: "Hansı sahəni oxumaq istəyirsiniz? Mühəndislik, tibb, biznes, hüquq, incəsənət? Büdcəniz nədir? Dil bilikləriniz hansı səviyyədədir? Bu suallara cavab vermək doğru ölkə və universitetin seçimini dəfələrlə asanlaşdırır." },
      { heading: "2. Ölkə və universiteti seçin", body: "Hər ölkənin müraciət sistemi, dil tələbləri, yaşayış xərci fərqlidir. Almaniya pulsuz dövlət universitetləri ilə öndə gedir, Niderland İngilisdilli proqramların zənginliyi ilə seçilir, Çexiya isə yaşayış xərclərinin aşağılığı ilə cəlbedicidir." },
      { heading: "3. Dil sertifikatını hazırlayın", body: "Əksər universitetlər IELTS, TOEFL, TestDaF, DSH, DELF kimi sertifikatlar tələb edir. Müraciət tarixindən ən azı 6-9 ay əvvəl sınava hazırlaşmağa başlayın." },
      { heading: "4. Sənədlər paketini toplayın", body: "Diplom, transkript, motivasiya məktubu, tövsiyə məktubları, pasport surəti — universitetdən universitetə dəyişən sənəd tələbləri var. Hope Academy kimi məsləhətçilərdən kömək almaq bu mərhələdə ciddi vaxt qənaəti edir." },
      { heading: "5. Müraciəti göndərin və vizaya hazırlaşın", body: "Qəbul məktubunu aldıqdan sonra tələbə vizasına müraciət edirsiniz. Bu mərhələdə bank hesabı, sığorta, yaşayış yeri axtarışı paralel gedir. Hope Academy bu addımların hamısında sistematik dəstək verir." },
    ],
  },
  {
    slug: "almaniyada-pulsuz-universitetler",
    title: "Almaniyada Pulsuz Dövlət Universitetləri: 2025 Bələdçisi",
    excerpt: "Almaniyada əksər dövlət universiteti beynəlxalq tələbələr üçün də pulsuzdur. Yalnız semestrlük qeydiyyat haqqı ödənilir — bu isə €150–350 arasındadır.",
    category: "Almaniya",
    readTime: "6 dəq",
    date: "2025-02-10",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80",
    content: [
      { body: "Almaniya dünyada beynəlxalq tələbələrə pulsuz təhsil imkanı sunan ən böyük ölkələrdən biridir. Dövlət universitetlərinin büdcəsi federal hökumət tərəfindən maliyyələşdirilir, buna görə tədris haqqı mövcud deyil." },
      { heading: "Semestrlük qeydiyyat haqqı", body: "Hər yarımildə ödənilən €150–350 arası qeydiyyat haqqı (Semesterbeitrag) əslində tədris haqqı deyil — ictimai nəqliyyat keçidi, tələbə birliyi üzvlüyü və müxtəlif xidmətlər daxildir." },
      { heading: "Ən yaxşı pulsuz universitetlər", body: "TU München, Humboldt Universität Berlin, LMU München, Heidelberg University, RWTH Aachen — bu universitetlər QS World Rankings-in ilk 200-ündə yer alır və tam pulsuzdur." },
      { heading: "Dil tələbləri", body: "Alman dilindəki proqramlar üçün TestDaF (TDN 4) və ya DSH-2 sertifikatı tələb edilir. İngilis dilindəki proqramlar üçün isə IELTS 6.0–6.5 kifayətdir. İngilis dilindəki proqramların sayı hər il artır." },
      { heading: "DAAD Bursu", body: "Almaniya Akademik Mübadiləsi Xidməti (DAAD) hər il minlərlə beynəlxalq tələbəyə burs verir. DAAD bursları aylıq €934 (bakalavr) ilə €1.200 (magistr) arasında dəyişir." },
    ],
  },
  {
    slug: "ielts-olmadan-qebul",
    title: "IELTS Olmadan Xaricə Qəbul Mümkündürmü?",
    excerpt: "IELTS balınız yoxdur? Bu məqalədə IELTS tələb etməyən proqramları, alternativ dil sertifikatlarını və xüsusi qəbul yollarını izah edirik.",
    category: "Faydalı Məlumat",
    readTime: "4 dəq",
    date: "2025-03-05",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80",
    content: [
      { body: "IELTS nüfuzlu bir dil sertifikatıdır, lakin onsuz da xaricdə oxumaq mümkündür. Bu məqalədə alternativləri araşdırırıq." },
      { heading: "TOEFL — IELTS-in alternativ", body: "ABŞ qaynağından olan TOEFL imtahanı IELTS-dən fərqli formatdadır. Bir çox Avropa universiteti TOEFL-ü qəbul edir. Əksər universitetlər IELTS 6.5 = TOEFL iBT 90 kimi hesablayır." },
      { heading: "Duolingo English Test", body: "Duolingo English Test son illərdə çox populyarlaşıb. 250-dən çox universitet bu sertifikatı qəbul edir. IELTS-dən 3-4 dəfə ucuz, onlayndır, nəticə 2 gündə gəlir." },
      { heading: "İngilis dilinin ana dili kimi qeydə alınması", body: "Orta məktəb və ya universitetdə təhsilini İngilis dilindəki məktəbdə alan tələbələr bəzən dil sertifikatından muaf tutulur. Transkriptinizdə təhsilin İngilis dilindəki olduğu yazılıbsa, universitetə sübut olaraq göndərə bilərsiniz." },
      { heading: "Alman dili proqramları (pulsuz)", body: "Almaniyada Çex dilindəki proqramlar kimi, Alman dilini öyrənib dövlət universitetinə pulsuzu qəbul olmaq mümkündür. TestDaF imtahanı IELTS-in ekvivalentidir, lakin daha az bilinir." },
    ],
  },
  {
    slug: "viza-musahibesine-hazirlik",
    title: "Tələbə Vizası Müsahibəsinə Necə Hazırlaşmalı?",
    excerpt: "Tələbə vizası müsahibəsi çox narahat edici ola bilər. Bu məqalədə ən çox verilən sualları, hazırlıq ipuçlarını və geyim tövsiyələrini paylaşırıq.",
    category: "Viza",
    readTime: "7 dəq",
    date: "2025-04-20",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80",
    content: [
      { body: "Tələbə vizası müsahibəsi prosesi ölkədən ölkəyə dəyişir, lakin bir sıra ortaq prinsiplər vardır. Yaxşı hazırlıq şansınızı əhəmiyyətli dərəcədə artırır." },
      { heading: "Əvvəlcədən sənədlərini hazırla", body: "Qəbul məktubu, tədris haqqı ödəniş sübut (varsa), bank hesabı çıxarışı (aylıq €700+ kifayət edəcək qədər), sığorta, yaşayış sübut sənədi (yataqxana, kirayə müqaviləsi) — hamısı tam hazır olmalıdır." },
      { heading: "Ən çox verilən suallar", body: "\"Niyə bu universiteti seçdiniz?\" — Proqrama xas detallar verin. \"Türkiyəyə niyə deyil, Almaniyaya?\" — Akademik və karyera əsaslı cavab. \"Bitirdikdən sonra ölkənizdə işləyəcəksiniz?\" — Ölkənizə bağlılığınızı göstərən aydın plan." },
      { heading: "Sənəd sıralaması", body: "Sənədlərinizi məntiqi sırada, aydın şəkildə düzenleyin. Konsulun sizin sənədlərinizi asan tapa bilməsi müsbət təsir bağışlayır. Orijinal sənəd + fotokopi + bəzən notariat tərcüməsi format olaraq qəbul edilir." },
      { heading: "Dil müsahibəsi", body: "Alman, Fransız, Çex visaları üçün konsulat bəzən dil biliklərinizi yoxlaya bilər. Əsas ifadələri, universitetin adını, proqramınızı həmin dildə söyləyə bilin." },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
