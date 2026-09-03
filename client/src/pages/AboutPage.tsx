import Container from "../components/Container";
import {
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  DocumentIcon,
  ArrowUpRightIcon,
} from "../components/Icons";

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
      "Bootstrap",
      "HTML / CSS",
      "Vite",
    ],
  },
  {
    category: "Backend",
    items: [
      "Node.js",
      "Express",
      "PHP",
      "Laravel",
      "C#",
      "Python",
      "REST API",
      "JWT",
    ],
  },
  {
    category: "Veritabanı",
    items: ["PostgreSQL", "MySQL", "Prisma ORM", "PDO", "SQL"],
  },
  {
    category: "Araçlar & Yöntemler",
    items: [
      "Git",
      "GitHub",
      "Docker",
      "npm",
      "Postman",
      "Agile / Scrum",
      "CI/CD",
      "Algoritma & Veri Yapıları",
    ],
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
  "Kubernetes",
  "Prometheus",
  "Grafana",
];

const now = [
  {
    strong: "İş arıyorum.",
    text: "Junior full-stack, frontend veya mobil pozisyonlar. İzmir ya da uzaktan.",
  },
  { text: "Makine öğrenmesi ve derin öğrenme temellerini çalışıyorum" },
  {
    text: "LLM tabanlı uygulamalar üzerine deneyler yapıyorum: RAG, model entegrasyonu",
  },
  { text: "Bu platformu geliştirmeye devam ediyorum" },
];

const experience = [
  {
    role: "Full Stack Developer — Staj",
    org: "EA Telekomünikasyon Bilişim Teknolojileri · İzmir",
    period: "Tem – Eki 2024 · 40 iş günü",
    bullets: [
      "Ödeme geçidi entegrasyonunu uçtan uca geliştirdim: kullanıcıların uygulama üzerinden güvenli şekilde ödeme yapmasını sağlayan backend ve frontend akışı",
      "React Native ve Expo ile iOS ve Android için çapraz platform mobil uygulamalar geliştirdim",
      "Laravel ve PHP ile ölçeklenebilir web uygulamaları geliştirdim; veritabanı yönetiminde PDO ve MySQL kullandım",
      "Gerçek zamanlı veri işleyen Node.js API'leri yazarak sistem performansını iyileştirdim",
      "Takım içinde API geliştirme, hata ayıklama ve test süreçlerinde görev aldım",
    ],
  },
];

const education = [
  {
    role: "Yazılım Mühendisliği, Lisans",
    org: "Kırklareli Üniversitesi",
    period: "Eyl 2021 – Haz 2025",
  },
];

const contact = {
  email: "cengizabdussamed17@gmail.com",
  github: "https://github.com/abdussamedcengiz",
  linkedin: "https://www.linkedin.com/in/abdussamed-cengiz-788951236/",
};

// Bolum basligi + ustunde ince bir cizgi.
// Ayni kalip 5 kez tekrarlaniyordu; tek yerde tanimlamak
// bolumler arasi ritmi garantiye aliyor.
function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="section-title flex items-center gap-3">
      {children}
      <span
        aria-hidden="true"
        className="h-px flex-1 bg-slate-200 dark:bg-slate-800"
      />
    </h2>
  );
}

// Deneyim ve egitim ayni bicimde gorunuyor -- tek bilesen yeter.
function TimelineItem({
  role,
  org,
  period,
  bullets,
}: {
  role: string;
  org: string;
  period: string;
  bullets?: string[];
}) {
  return (
    // Sol kenarda dikey cizgi + nokta: zaman cizelgesi hissi.
    // relative + absolute nokta, cizgiyi tam ortalar.
    <li className="relative border-l border-slate-200 pb-8 pl-6 last:border-transparent last:pb-0 dark:border-slate-800">
      <span
        aria-hidden="true"
        className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-white bg-accent-500 dark:border-slate-950"
      />

      {/* Mobilde alt alta, sm'den itibaren yan yana.
          Tarih sagda: goz once role, sonra tarihe gidiyor. */}
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline sm:gap-4">
        <h3 className="font-semibold">{role}</h3>
        <span className="shrink-0 font-mono text-xs text-slate-500 dark:text-slate-400">
          {period}
        </span>
      </div>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{org}</p>

      {bullets && (
        <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-300">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-slate-400 dark:bg-slate-600"
              />
              <span className="text-[0.95rem] leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function AboutPage() {
  return (
    <Container>
      <header>
        <h1 className="page-title">Hakkımda</h1>
      </header>

      <div className="prose-body mt-6 space-y-4">
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
            href={contact.github}
            target="_blank"
            rel="noreferrer"
            className="link-underline"
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
        <SectionHeading>Şu an</SectionHeading>

        <ul className="mt-6 space-y-2.5 text-slate-600 dark:text-slate-300">
          {now.map((item) => (
            <li key={item.text} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500"
              />
              <span>
                {item.strong && (
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {item.strong}{" "}
                  </span>
                )}
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* --- DENEYIM --- */}
      <section className="mt-16">
        <SectionHeading>Deneyim</SectionHeading>

        <ul className="mt-6">
          {experience.map((item) => (
            <TimelineItem key={item.role} {...item} />
          ))}
        </ul>
      </section>

      {/* --- EGITIM --- */}
      <section className="mt-16">
        <SectionHeading>Eğitim</SectionHeading>

        <ul className="mt-6">
          {education.map((item) => (
            <TimelineItem key={item.role} {...item} />
          ))}
        </ul>
      </section>

      {/* --- YETENEKLER --- */}
      <section className="mt-16">
        <SectionHeading>Yetenekler</SectionHeading>

        <div className="mt-6 space-y-6">
          {skills.map((group) => (
            <div key={group.category}>
              <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                {group.category}
              </h3>

              {/* flex-wrap: satira sigmayanlar alt satira gecer. */}
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Kesikli cerceve: gorsel fark, anlamsal farki destekliyor.
              "Biliyorum" ile "ogreniyorum" bir bakista ayrilsin. */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Öğreniyorum
            </h3>

            <ul className="mt-3 flex flex-wrap gap-2">
              {learning.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-dashed border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400"
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
        <SectionHeading>İletişim</SectionHeading>

        <div className="card mt-6 p-6">
          <p className="text-slate-600 dark:text-slate-300">
            İş ve staj teklifleri için e-posta en hızlı yol.
          </p>

          <ul className="mt-5 space-y-3 text-sm">
            <li>
              {/* mailto: -> tiklayinca e-posta programini acar */}
              <a
                href={`mailto:${contact.email}`}
                className="group inline-flex items-center gap-2.5 text-slate-700 transition hover:text-accent-600 dark:text-slate-300 dark:hover:text-accent-400"
              >
                <MailIcon className="h-4 w-4 text-slate-400" />
                {contact.email}
              </a>
            </li>
            <li>
              <a
                href={contact.github}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2.5 text-slate-700 transition hover:text-accent-600 dark:text-slate-300 dark:hover:text-accent-400"
              >
                <GitHubIcon className="h-4 w-4 text-slate-400" />
                github.com/abdussamedcengiz
                <ArrowUpRightIcon className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
              </a>
            </li>
            <li>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2.5 text-slate-700 transition hover:text-accent-600 dark:text-slate-300 dark:hover:text-accent-400"
              >
                <LinkedInIcon className="h-4 w-4 text-slate-400" />
                LinkedIn
                <ArrowUpRightIcon className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
              </a>
            </li>
          </ul>

          {/* public/ klasorundeki dosyalar site kokunden servis edilir:
              public/cv.pdf  ->  /cv.pdf
              Vite bu dosyalari islemez, oldugu gibi kopyalar. */}
          <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              <DocumentIcon className="h-4 w-4" />
              CV (Türkçe)
            </a>

            <a
              href="/cv-en.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              <DocumentIcon className="h-4 w-4" />
              CV (English)
            </a>
          </div>
        </div>
      </section>
    </Container>
  );
}

export default AboutPage;
