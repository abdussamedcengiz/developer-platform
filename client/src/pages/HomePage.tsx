import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import PostCard from "../components/PostCard";
import ProjectCard from "../components/ProjectCard";
import type { Post } from "../types/post";
import type { Project } from "../types/project";

function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

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
        setProjects(projectsData.filter((p) => p.featured));
      } catch (err) {
        // Veri gelmese bile tanitim bolumu gorunsun.
        console.error(err);
      }
    }

    loadData();
  }, []);

  return (
    <div>
      {/* --- HERO --- */}
      <section>
        {/* text-balance: baslik satirlarini dengeli boler,
            son satirda tek kelime kalmasini onler. */}
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Yazılım Mühendisi · İzmir
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Abdüssamed Cengiz
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          Web ve mobil uygulamalar geliştiriyorum. TypeScript, React, React
          Native ve Node.js kullanıyorum. Bir işi veritabanından arayüze kadar
          baştan sona kurarım.
        </p>

        <p className="mt-4 max-w-xl leading-relaxed text-slate-500 dark:text-slate-400">
          Yeni mezunum ve iş arıyorum. Aşağıdaki projelerin hepsini kendim
          yazdım — bu site de dâhil.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/projects" className="btn-primary px-5 py-2.5">
            Projelerim
          </Link>

          {/* Ise alimci icin en kisa yol: dogrudan e-posta.
              Ikinci butonu "Hakkimda" yapmak bir tiklama daha ekliyordu. */}
          <a
            href="mailto:cengizabdussamed17@gmail.com"
            className="btn-secondary px-5 py-2.5"
          >
            İletişime geç
          </a>

          {/* public/cv.pdf -> site kokunde /cv.pdf olarak servis edilir */}
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 text-sm font-medium text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
          >
            CV (PDF)
          </a>
        </div>
      </section>

      {/* --- ONE CIKAN PROJELER --- */}
      {/* "length > 0" ACIKCA yaziliyor: sadece "length &&" yazsaydik
          dizi bosken ekrana "0" basilirdi. */}
      {projects.length > 0 && (
        <section className="mt-20">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold tracking-tight">
              Öne Çıkan Projeler
            </h2>
            <Link
              to="/projects"
              className="text-sm text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              Tümü →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* --- SON YAZILAR --- */}
      {posts.length > 0 && (
        <section className="mt-20">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold tracking-tight">Son Yazılar</h2>
            <Link
              to="/blog"
              className="text-sm text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              Tümü →
            </Link>
          </div>

          <div className="mt-2">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default HomePage;
