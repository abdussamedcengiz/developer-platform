// Bu sayfanin verisi API'den gelmiyor -- statik.
// O yuzden useState/useEffect yok. Her sayfa veri cekmek zorunda degil.

// BILDIKLERIN. Buradaki her satir bir mulakatta sorulabilir.
const skills = [
  {
    category: "Frontend",
    items: [
      "React",
      "React Native (Expo)",
      "TypeScript",
      "JavaScript (ES6+)",
      "Tailwind CSS",
      "HTML / CSS",
      "Vite",
    ],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "PHP", "Laravel", "C#", "Python", "REST API", "JWT"],
  },
  {
    category: "Veritabanı",
    items: ["PostgreSQL", "MySQL", "Prisma ORM", "PDO", "SQL"],
  },
  {
    category: "Araçlar",
    items: ["Git", "GitHub", "npm", "Postman", "Algoritma & Veri Yapıları"],
  },
];

// OGRENDIKLERIN. Ayri tutmak bilincli bir tercih:
// "biliyorum" ile "ogreniyorum" ayni sey degil ve
// bu durustluk mulakatta seni korur.
const learning = [
  "Makine Öğrenmesi",
  "Derin Öğrenme",
  "Büyük Dil Modelleri (LLM)",
  "PyTorch",
  "RAG & Vektör Veritabanları",
  "Görüntü İşleme",
];

const contact = {
  email: "cengizabdussamed17@gmail.com",
  github: "https://github.com/abdussamedcengiz",
  linkedin: "https://www.linkedin.com/in/abdussamed-cengiz-788951236/",
};

function AboutPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Hakkımda</h1>

      <div className="mt-6 space-y-4 leading-relaxed text-slate-600 dark:text-slate-300">
        <p>
          Yazılım mühendisiyim, İzmir'de yaşıyorum. Kırklareli Üniversitesi
          Yazılım Mühendisliği'nden 2025'te mezun oldum ve iş arıyorum.
        </p>
        <p>
          Web ve mobil tarafta çalışıyorum. TypeScript, React, React Native,
          Node.js ve PostgreSQL kullanıyorum. PHP/Laravel, C# ve Python ile de
          projeler yazdım. Üniversitede algoritma ve veri yapıları üzerine C ve
          C++ ile çalıştım.
        </p>
        <p>
          Bir işi baştan sona görmeyi tercih ediyorum: veritabanı şeması, API,
          arayüz. Bu site de öyle yazıldı — hazır tema kullanmadım, her katmanı
          kendim kurdum. Kodu{" "}
          <a
            href="https://github.com/abdussamedcengiz"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            GitHub'da
          </a>{" "}
          açık.
        </p>
        <p>
          Makine öğrenmesi ve büyük dil modelleri üzerine çalışıyorum.
          İlgilendiğim nokta bu alanı çalışan ürünlere bağlamak.
        </p>
      </div>

      {/* --- SU AN --- */}
      <section className="mt-16">
        <h2 className="text-xl font-bold tracking-tight">Şu an</h2>

        <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-300">
          <li className="flex gap-3">
            <span className="text-slate-400 dark:text-slate-600">—</span>
            <span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                İş arıyorum.
              </span>{" "}
              Junior full-stack, frontend veya mobil pozisyonlar. İzmir ya da
              uzaktan.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-slate-400 dark:text-slate-600">—</span>
            <span>
              Makine öğrenmesi ve derin öğrenme temellerini çalışıyorum
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-slate-400 dark:text-slate-600">—</span>
            <span>
              LLM tabanlı uygulamalar üzerine deneyler yapıyorum: RAG, model
              entegrasyonu
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-slate-400 dark:text-slate-600">—</span>
            <span>Bu platformu geliştirmeye devam ediyorum</span>
          </li>
        </ul>
      </section>

      {/* --- DENEYIM --- */}
      <section className="mt-16">
        <h2 className="text-xl font-bold tracking-tight">Deneyim</h2>

        <div className="mt-6">
          {/* Mobilde alt alta, sm'den itibaren yan yana.
              Tarih sagda: goz once role, sonra tarihe gidiyor. */}
          <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
            <h3 className="font-semibold">Full Stack Developer</h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Tem 2024 – Eki 2024
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            EABİLİŞİM · İzmir
          </p>

          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Web uygulamalarının hem arayüz hem sunucu tarafında geliştirme
            yaptım. PHP/Laravel ve JavaScript ile takım içinde çalıştım.
          </p>
        </div>
      </section>

      {/* --- EGITIM --- */}
      <section className="mt-16">
        <h2 className="text-xl font-bold tracking-tight">Eğitim</h2>

        <div className="mt-6">
          <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
            <h3 className="font-semibold">Yazılım Mühendisliği, Lisans</h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              2021 – 2025
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Kırklareli Üniversitesi
          </p>
        </div>
      </section>

      {/* --- YETENEKLER --- */}
      <section className="mt-16">
        <h2 className="text-xl font-bold tracking-tight">Yetenekler</h2>

        <div className="mt-6 space-y-6">
          {skills.map((group) => (
            <div key={group.category}>
              <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                {group.category}
              </h3>

              {/* flex-wrap: satira sigmayanlar alt satira gecer. */}
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Kesikli cerceve: gorsel fark, anlamsal farki destekliyor. */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Öğreniyorum
            </h3>

            <ul className="mt-3 flex flex-wrap gap-2">
              {learning.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-dashed border-slate-300 px-3 py-1 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --- ILETISIM --- */}
      <section className="mt-16">
        <h2 className="text-xl font-bold tracking-tight">İletişim</h2>

        <p className="mt-4 text-slate-600 dark:text-slate-300">
          İş ve staj teklifleri için e-posta en hızlı yol.
        </p>

        <ul className="mt-4 space-y-2 text-sm">
          <li>
            {/* mailto: -> tiklayinca e-posta programini acar */}
            <a
              href={`mailto:${contact.email}`}
              className="text-blue-600 transition hover:underline dark:text-blue-400"
            >
              {contact.email}
            </a>
          </li>
          <li>
            <a
              href={contact.github}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 transition hover:underline dark:text-blue-400"
            >
              github.com/abdussamedcengiz
            </a>
          </li>
          <li>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 transition hover:underline dark:text-blue-400"
            >
              LinkedIn
            </a>
          </li>
        </ul>

        {/* public/ klasorundeki dosyalar site kokunden servis edilir:
            public/cv.pdf  ->  /cv.pdf
            Vite bu dosyalari islemez, oldugu gibi kopyalar. */}
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary inline-block"
          >
            CV (Türkçe)
          </a>

          <a
            href="/cv-en.pdf"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary inline-block"
          >
            CV (English)
          </a>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
