import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import Container from "../components/Container";
import PostCard from "../components/PostCard";
import ProjectCard from "../components/ProjectCard";
import { SkeletonList } from "../components/Skeleton";
import {
  ArrowRightIcon,
  DocumentIcon,
  MailIcon,
  GitHubIcon,
  LinkedInIcon,
} from "../components/Icons";
import type { Post } from "../types/post";
import type { Project } from "../types/project";

// Hero'nun altindaki yigin serisi. Bu liste bilerek KISA:
// "her sey" demek "hicbir sey" demektir. Bunlar gunluk kullandiklarim.
const stack = [
  "TypeScript",
  "React",
  "React Native",
  "Node.js",
  "Express",
  "PostgreSQL",
  "Prisma",
  "Tailwind",
];

function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Promise.all: iki istegi AYNI ANDA baslatir.
        // Birbirlerine bagli olmadiklari icin sirayla beklemek gereksiz.
        const [postsData, projectsData] = await Promise.all([
          api.get<Post[]>("/api/posts"),
          api.get<Project[]>("/api/projects"),
        ]);

        setPosts(postsData.slice(0, 3));

        // One cikanlar yoksa en yeni 4 projeyi goster.
        // Bos bir "Projeler" bolumu, dolu bir bolumden daha kotu.
        const featured = projectsData.filter((p) => p.featured);
        setProjects(featured.length > 0 ? featured : projectsData.slice(0, 4));
      } catch (err) {
        // Veri gelmese bile tanitim bolumu gorunsun.
        // Ana sayfanin asil isi kim oldugunu anlatmak; liste ikincil.
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div>
      {/* --- HERO --- */}
      <section className="relative">
        {/* Dekoratif katman: ince izgara + ustten inen yumusak isik.
            pointer-events-none -> tiklamalari engellemez.
            aria-hidden -> ekran okuyucu bunu okumaz, cunku anlami yok.
            mask-image: izgara asagi dogru silinerek biter, keskin
            bir kesme cizgisi olusmaz.

            DIKKAT: burada "-z-10" KULLANMIYORUZ. Negatif z-index bu
            katmani, uygulamanin kokundeki bg-white/dark:bg-slate-950
            katmaninin ARKASINA atardi ve doku tamamen gorunmez olurdu.
            Sirayi DOM duzeni belirliyor: dekor once, icerik sonra. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 h-96 overflow-hidden"
        >
          <div className="bg-grid absolute inset-0 opacity-[0.55] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
          <div className="absolute top-0 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-accent-500/10 blur-3xl dark:bg-accent-500/15" />
        </div>

        <Container size="lg" className="relative">
          <div className="animate-fade-up">
            {/* MUSAITLIK ROZETI
                Ise alimcinin ilk sordugu soru "musait mi?".
                Yanip sonen nokta dikkati oraya cekiyor. */}
            <p className="badge-emerald">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              İş fırsatlarına açığım
            </p>

            {/* text-balance: baslik satirlarini dengeli boler,
                son satirda tek kelime kalmasini onler. */}
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Abdüssamed Cengiz
            </h1>

            <p className="mt-3 font-mono text-sm text-accent-600 dark:text-accent-400">
              Yazılım Mühendisi · İzmir
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Web ve mobil uygulamalar geliştiriyorum. TypeScript, React, React
              Native ve Node.js kullanıyorum. Bir işi veritabanından arayüze
              kadar baştan sona kurarım.
            </p>

            <p className="mt-4 max-w-2xl leading-relaxed text-slate-500 dark:text-slate-400">
              Yeni mezunum ve iş arıyorum. Aşağıdaki projelerin hepsini kendim
              yazdım — bu site de dâhil.
            </p>

            {/* --- EYLEMLER ---
                Hiyerarsi bilincli: bir birincil (Projelerim),
                bir ikincil (E-posta), bir sessiz (CV).
                Uc esit buton olsaydi kullanici hangisine
                basacagini bilemezdi. */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/projects" className="btn-primary group px-5">
                Projelerim
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>

              {/* Ise alimci icin en kisa yol: dogrudan e-posta.
                  Ikinci butonu "Hakkimda" yapmak bir tiklama daha ekliyordu. */}
              <a
                href="mailto:cengizabdussamed17@gmail.com"
                className="btn-secondary px-5"
              >
                <MailIcon className="h-4 w-4" />
                İletişime geç
              </a>

              {/* public/cv.pdf -> site kokunde /cv.pdf olarak servis edilir */}
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                <DocumentIcon className="h-4 w-4" />
                CV (PDF)
              </a>

              <span
                aria-hidden="true"
                className="hidden h-6 w-px bg-slate-200 sm:block dark:bg-slate-800"
              />

              <div className="flex items-center gap-1">
                <a
                  href="https://github.com/abdussamedcengiz"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub profilim"
                  title="GitHub"
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                >
                  <GitHubIcon className="h-[18px] w-[18px]" />
                </a>
                <a
                  href="https://www.linkedin.com/in/abdussamed-cengiz-788951236/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profilim"
                  title="LinkedIn"
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                >
                  <LinkedInIcon className="h-[18px] w-[18px]" />
                </a>
              </div>
            </div>

            {/* --- YIGIN ---
                Metin icinde gecen teknolojileri taranabilir hale
                getiriyor. Ise alimci CV'yi okumaz, TARAR. */}
            <ul className="mt-10 flex flex-wrap gap-2">
              {stack.map((item) => (
                <li key={item} className="chip font-mono">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* --- ONE CIKAN PROJELER --- */}
      <Container size="lg">
        <section className="mt-20 sm:mt-24">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="section-title">Öne Çıkan Projeler</h2>

            <Link
              to="/projects"
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm text-slate-500 transition hover:text-accent-600 dark:text-slate-400 dark:hover:text-accent-400"
            >
              Tümü
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-6">
            {loading ? (
              <SkeletonList variant="project" count={2} />
            ) : projects.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              // Ana sayfada buyuk bir "bos durum" kutusu asiri olurdu.
              // Tek satirlik sessiz bir not yeterli.
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Projeler yakında burada olacak.
              </p>
            )}
          </div>
        </section>

        {/* --- SON YAZILAR ---
            "length > 0" ACIKCA yaziliyor: sadece "length &&" yazsaydik
            dizi bosken ekrana "0" basilirdi. */}
        {(loading || posts.length > 0) && (
          <section className="mt-20 sm:mt-24">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="section-title">Son Yazılar</h2>

              <Link
                to="/blog"
                className="group inline-flex shrink-0 items-center gap-1.5 text-sm text-slate-500 transition hover:text-accent-600 dark:text-slate-400 dark:hover:text-accent-400"
              >
                Tümü
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="mt-2 max-w-3xl">
              {loading ? (
                <SkeletonList count={2} />
              ) : (
                posts.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </div>
          </section>
        )}

        {/* --- ILETISIM SERIDI ---
            Sayfanin sonuna gelen kullanici bir sonraki adimi
            aramak zorunda kalmasin. */}
        <section className="mt-20 sm:mt-24">
          <div className="card relative overflow-hidden px-6 py-10 text-center sm:px-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-accent-500/10 blur-3xl"
            />

            <h2 className="section-title">Birlikte çalışalım</h2>

            <p className="mx-auto mt-3 max-w-md text-slate-600 dark:text-slate-300">
              Junior full-stack, frontend veya mobil pozisyonlar için açığım.
              İzmir ya da uzaktan. E-posta en hızlı yol.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a
                href="mailto:cengizabdussamed17@gmail.com"
                className="btn-primary px-5"
              >
                <MailIcon className="h-4 w-4" />
                E-posta gönder
              </a>

              <Link to="/about" className="btn-secondary px-5">
                Hakkımda
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}

export default HomePage;
